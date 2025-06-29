# Snakkaz Chat Memory System - MCP Server Implementation
# Dette er et komplett minnesystem for admin bruk i Snakkaz Chat
# AI-agenter får full oversikt over brukerens minnestrukturer

from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import json
import asyncpg
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
import numpy as np
from pgvector.asyncpg import register_vector
import openai
from dataclasses import dataclass, asdict
import redis.asyncio as redis
import hashlib
import os

@dataclass
class Memory:
    user_id: str
    memory_type: str
    key: str
    value: str
    embedding: Optional[List[float]] = None
    metadata: Optional[Dict[str, Any]] = None
    confidence: float = 1.0
    importance: float = 0.5
    access_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_accessed: Optional[datetime] = None
    ttl_seconds: Optional[int] = None  # Time to live
    context: Optional[str] = None
    source: Optional[str] = None  # Hvor minnet kom fra (chat, system, etc)

class MemoryMCPServer:
    def __init__(self):
        self.server = Server("snakkaz-memory-server")
        self.db_pool: Optional[asyncpg.Pool] = None
        self.redis_client = None
        self.openai_client = None
        
        # Minnetyper med ulike oppbevaringsstrategier
        self.memory_types = {
            "user_preference": {"ttl": None, "importance_weight": 0.8},
            "conversation_context": {"ttl": 86400, "importance_weight": 0.6},  # 24 timer
            "learned_fact": {"ttl": None, "importance_weight": 0.7},
            "emotional_state": {"ttl": 3600, "importance_weight": 0.9},  # 1 time
            "task_context": {"ttl": 7200, "importance_weight": 0.7},  # 2 timer
            "user_relationship": {"ttl": None, "importance_weight": 0.9},
            "interaction_pattern": {"ttl": None, "importance_weight": 0.6}
        }
        
    async def setup(self):
        """Initialiser database, cache og AI-klienter"""
        # PostgreSQL med pgvector - bruk Supabase connection
        supabase_url = os.getenv('VITE_SUPABASE_URL', 'https://wqpoozpbceucynsojmbk.supabase.co')
        db_host = supabase_url.replace('https://', '').replace('http://', '')
        
        self.db_pool = await asyncpg.create_pool(
            host=db_host,
            port=5432,
            user="postgres",
            password=os.getenv('SUPABASE_DB_PASSWORD', ''),
            database="postgres",
            min_size=10,
            max_size=20,
            command_timeout=60
        )
        
        # Registrer pgvector
        if self.db_pool:
            async with self.db_pool.acquire() as conn:
                await register_vector(conn)
                await self._create_tables(conn)
        
        # Redis for rask cache - fallback til local hvis ikke tilgjengelig
        try:
            self.redis_client = await redis.from_url(
                os.getenv('REDIS_URL', "redis://localhost:6379"),
                encoding="utf-8",
                decode_responses=True
            )
        except Exception as e:
            print(f"Redis ikke tilgjengelig, bruker in-memory cache: {e}")
            self.redis_client = None
        
        # OpenAI for embeddings - bruk eksisterende API key
        api_key = os.getenv('VITE_ANTHROPIC_API_KEY') or os.getenv('VITE_OPENAI_API_KEY')
        if api_key:
            self.openai_client = openai.AsyncOpenAI(api_key=api_key)
        else:
            print("Warning: Ingen AI API key funnet - embeddings vil ikke fungere")
        
    async def _create_tables(self, conn):
        """Opprett nødvendige databaser med indekser"""
        await conn.execute("""
            CREATE EXTENSION IF NOT EXISTS vector;
            
            CREATE TABLE IF NOT EXISTS snakkaz_memories (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                memory_type VARCHAR(50) NOT NULL,
                key VARCHAR(500) NOT NULL,
                value TEXT NOT NULL,
                embedding vector(1536),  -- OpenAI ada-002 dimensjon
                metadata JSONB DEFAULT '{}',
                confidence FLOAT DEFAULT 1.0,
                importance FLOAT DEFAULT 0.5,
                access_count INTEGER DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                last_accessed TIMESTAMPTZ DEFAULT NOW(),
                expires_at TIMESTAMPTZ,
                context TEXT,
                source VARCHAR(50),
                
                -- Unikt minne per bruker og nøkkel
                UNIQUE(user_id, key)
            );
            
            -- Indekser for rask søk
            CREATE INDEX IF NOT EXISTS idx_snakkaz_user_id ON snakkaz_memories(user_id);
            CREATE INDEX IF NOT EXISTS idx_snakkaz_memory_type ON snakkaz_memories(memory_type);
            CREATE INDEX IF NOT EXISTS idx_snakkaz_expires_at ON snakkaz_memories(expires_at);
            CREATE INDEX IF NOT EXISTS idx_snakkaz_importance ON snakkaz_memories(importance DESC);
            CREATE INDEX IF NOT EXISTS idx_snakkaz_embedding ON snakkaz_memories USING ivfflat (embedding vector_cosine_ops);
            
            -- Minnerelasjoner (for å koble relaterte minner)
            CREATE TABLE IF NOT EXISTS snakkaz_memory_relations (
                id SERIAL PRIMARY KEY,
                memory_id_1 INTEGER REFERENCES snakkaz_memories(id) ON DELETE CASCADE,
                memory_id_2 INTEGER REFERENCES snakkaz_memories(id) ON DELETE CASCADE,
                relation_type VARCHAR(50),
                strength FLOAT DEFAULT 0.5,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            -- Minnesamlinger (for gruppering)
            CREATE TABLE IF NOT EXISTS snakkaz_memory_collections (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                metadata JSONB DEFAULT '{}',
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            CREATE TABLE IF NOT EXISTS snakkaz_collection_memories (
                collection_id INTEGER REFERENCES snakkaz_memory_collections(id) ON DELETE CASCADE,
                memory_id INTEGER REFERENCES snakkaz_memories(id) ON DELETE CASCADE,
                PRIMARY KEY (collection_id, memory_id)
            );
            
            -- Admin oversikt over minnebruk
            CREATE TABLE IF NOT EXISTS snakkaz_memory_stats (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                total_memories INTEGER DEFAULT 0,
                memory_types JSONB DEFAULT '{}',
                total_size_bytes BIGINT DEFAULT 0,
                last_updated TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id)
            );
        """)
        
    async def _generate_embedding(self, text: str) -> Optional[List[float]]:
        """Generer vektor-embedding for tekst"""
        if not self.openai_client:
            return None
            
        try:
            response = await self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Feil ved generering av embedding: {e}")
            return None
            
    def _calculate_importance(self, memory: Memory) -> float:
        """Beregn viktigheten av et minne basert på flere faktorer"""
        base_importance = memory.importance
        
        # Øk viktighet basert på minnetype
        type_weight = self.memory_types.get(
            memory.memory_type, {}
        ).get("importance_weight", 0.5)
        
        # Øk viktighet basert på tilgangsfrekvens
        access_weight = min(memory.access_count * 0.01, 0.3)
        
        # Reduser viktighet over tid (decay)
        if memory.created_at:
            age_days = (datetime.now(timezone.utc) - memory.created_at).days
            time_decay = max(0, 1 - (age_days * 0.001))
        else:
            time_decay = 1.0
            
        # Øk viktighet basert på confidence
        confidence_weight = memory.confidence * 0.2
        
        total_importance = (
            base_importance * 0.4 +
            type_weight * 0.3 +
            access_weight * 0.1 +
            time_decay * 0.1 +
            confidence_weight * 0.1
        )
        
        return min(max(total_importance, 0), 1)
        
    async def store_memory(
        self,
        user_id: str,
        memory_type: str,
        key: str,
        value: str,
        confidence: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None,
        context: Optional[str] = None,
        source: Optional[str] = None,
        ttl_seconds: Optional[int] = None
    ) -> Dict[str, Any]:
        """Lagre et minne med embedding og metadata"""
        try:
            # Generer embedding
            embedding_text = f"{key}: {value}"
            if context:
                embedding_text = f"{context} | {embedding_text}"
            embedding = await self._generate_embedding(embedding_text)
            
            # Beregn TTL basert på minnetype hvis ikke spesifisiert
            if ttl_seconds is None:
                ttl_seconds = self.memory_types.get(
                    memory_type, {}
                ).get("ttl")
            
            expires_at = None
            if ttl_seconds:
                expires_at = datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)
            
            # Opprett minneobjekt
            memory = Memory(
                user_id=user_id,
                memory_type=memory_type,
                key=key,
                value=value,
                embedding=embedding,
                metadata=metadata or {},
                confidence=confidence,
                context=context,
                source=source,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            
            # Beregn viktighet
            memory.importance = self._calculate_importance(memory)
            
            # Lagre i database
            if self.db_pool:
                async with self.db_pool.acquire() as conn:
                    result = await conn.fetchrow("""
                    INSERT INTO snakkaz_memories (
                        user_id, memory_type, key, value, embedding,
                        metadata, confidence, importance, context, source,
                        expires_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    ON CONFLICT (user_id, key) DO UPDATE SET
                        value = EXCLUDED.value,
                        embedding = EXCLUDED.embedding,
                        metadata = EXCLUDED.metadata,
                        confidence = EXCLUDED.confidence,
                        importance = EXCLUDED.importance,
                        context = EXCLUDED.context,
                        source = EXCLUDED.source,
                        updated_at = NOW(),
                        access_count = snakkaz_memories.access_count + 1
                    RETURNING id, created_at, updated_at
                    """, 
                        user_id, memory_type, key, value, embedding,
                        json.dumps(metadata or {}), confidence, memory.importance,
                        context, source, expires_at
                    )
                
                memory_id = result['id']
                
                # Oppdater statistikk
                await self._update_memory_stats(conn, user_id)
                
            # Cache i Redis for rask tilgang
            if self.redis_client:
                cache_key = f"snakkaz_memory:{user_id}:{key}"
                await self.redis_client.setex(
                    cache_key,
                    ttl_seconds or 86400,  # Standard 24 timer cache
                    json.dumps({
                        "id": memory_id,
                        "value": value,
                        "metadata": metadata,
                        "confidence": confidence,
                        "importance": memory.importance
                    })
                )
            
            return {
                "success": True,
                "memory_id": memory_id,
                "message": "Minne lagret",
                "importance": memory.importance
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
            
    async def retrieve_memory(
        self,
        user_id: str,
        query: Optional[str] = None,
        memory_types: Optional[List[str]] = None,
        limit: int = 10,
        similarity_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """Hent relevante minner med semantisk søk"""
        try:
            memories = []
            
            # Sjekk cache først for direkte oppslag
            if query and ":" in query and self.redis_client:
                cache_key = f"snakkaz_memory:{user_id}:{query}"
                cached = await self.redis_client.get(cache_key)
                if cached:
                    memories.append(json.loads(cached))
                    
            # Semantisk søk i database
            if query:
                query_embedding = await self._generate_embedding(query)
                
                if self.db_pool:
                    async with self.db_pool.acquire() as conn:
                        # Oppdater expired minner
                        await conn.execute("""
                            DELETE FROM snakkaz_memories 
                            WHERE expires_at IS NOT NULL AND expires_at < NOW()
                        """)
                    
                    # Søk med vektor-likhet
                    conditions = ["user_id = $1"]
                    params = [user_id]
                    param_count = 1
                    
                    if memory_types:
                        param_count += 1
                        conditions.append(f"memory_type = ANY(${param_count})")
                        params.append(memory_types)  # Keep as is - list of strings
                        
                    if query_embedding:
                        param_count += 1
                        similarity_condition = f"""
                            1 - (embedding <=> ${param_count}::vector) > {similarity_threshold}
                        """
                        conditions.append(similarity_condition)
                        params.append(query_embedding)  # Keep as is - list of floats
                        
                    where_clause = " AND ".join(conditions)
                    
                    rows = await conn.fetch(f"""
                        SELECT 
                            id, key, value, memory_type, metadata,
                            confidence, importance, access_count,
                            context, source, created_at, updated_at,
                            1 - (embedding <=> $3::vector) as similarity
                        FROM snakkaz_memories
                        WHERE {where_clause}
                        ORDER BY 
                            importance DESC,
                            similarity DESC
                        LIMIT {limit}
                    """, *params)
                    
                    # Oppdater last_accessed
                    memory_ids = [row['id'] for row in rows]
                    if memory_ids:
                        await conn.execute("""
                            UPDATE snakkaz_memories 
                            SET last_accessed = NOW(), 
                                access_count = access_count + 1
                            WHERE id = ANY($1)
                        """, memory_ids)
                        
                    memories = [dict(row) for row in rows]
                    
            return memories
            
        except Exception as e:
            print(f"Feil ved henting av minner: {e}")
            return []
            
    async def forget_memory(
        self,
        user_id: str,
        key: Optional[str] = None,
        memory_type: Optional[str] = None,
        older_than_days: Optional[int] = None
    ) -> Dict[str, Any]:
        """Slett minner basert på kriterier"""
        try:
            conditions = ["user_id = $1"]
            params = [user_id]
            param_count = 1
            
            if key:
                param_count += 1
                conditions.append(f"key = ${param_count}")
                params.append(key)
                
            if memory_type:
                param_count += 1
                conditions.append(f"memory_type = ${param_count}")
                params.append(memory_type)
                
            if older_than_days:
                conditions.append(
                    f"created_at < NOW() - INTERVAL '{older_than_days} days'"
                )
                
            where_clause = " AND ".join(conditions)
            
            if not self.db_pool:
                return {"deleted_count": 0}
                
            async with self.db_pool.acquire() as conn:
                deleted = await conn.fetchval(f"""
                    DELETE FROM snakkaz_memories
                    WHERE {where_clause}
                    RETURNING COUNT(*)
                """, *params)
                
                # Oppdater statistikk
                await self._update_memory_stats(conn, user_id)
                
            # Tøm cache
            if key and self.redis_client:
                await self.redis_client.delete(f"snakkaz_memory:{user_id}:{key}")
                
            return {
                "success": True,
                "deleted_count": deleted or 0
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def _update_memory_stats(self, conn, user_id: str):
        """Oppdater minnestatistikk for admin oversikt"""
        try:
            stats = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total_memories,
                    json_object_agg(memory_type, count) as memory_types,
                    SUM(LENGTH(value)) as total_size_bytes
                FROM (
                    SELECT 
                        memory_type, 
                        COUNT(*) as count,
                        value
                    FROM snakkaz_memories 
                    WHERE user_id = $1
                    GROUP BY memory_type, value
                ) sub
            """, user_id)
            
            await conn.execute("""
                INSERT INTO snakkaz_memory_stats (user_id, total_memories, memory_types, total_size_bytes)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (user_id) DO UPDATE SET
                    total_memories = EXCLUDED.total_memories,
                    memory_types = EXCLUDED.memory_types,
                    total_size_bytes = EXCLUDED.total_size_bytes,
                    last_updated = NOW()
            """, user_id, stats['total_memories'], stats['memory_types'], stats['total_size_bytes'])
            
        except Exception as e:
            print(f"Feil ved oppdatering av minnestatistikk: {e}")
            
    async def analyze_memory_patterns(
        self,
        user_id: str,
        time_range_days: int = 30
    ) -> Dict[str, Any]:
        """Analyser brukerens minnemønstre"""
        try:
            if not self.db_pool:
                return {"error": "Database not available"}
                
            async with self.db_pool.acquire() as conn:
                # Minnestatistikk
                stats = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_memories,
                        AVG(confidence) as avg_confidence,
                        AVG(importance) as avg_importance,
                        MAX(access_count) as max_access_count,
                        COUNT(DISTINCT memory_type) as unique_types
                    FROM snakkaz_memories
                    WHERE user_id = $1 
                        AND created_at > NOW() - INTERVAL '%s days'
                """ % time_range_days, user_id)
                
                # Mest brukte minnetyper
                type_distribution = await conn.fetch("""
                    SELECT 
                        memory_type,
                        COUNT(*) as count,
                        AVG(importance) as avg_importance
                    FROM snakkaz_memories
                    WHERE user_id = $1
                        AND created_at > NOW() - INTERVAL '%s days'
                    GROUP BY memory_type
                    ORDER BY count DESC
                """ % time_range_days, user_id)
                
                # Tilgangsmønstre
                access_patterns = await conn.fetch("""
                    SELECT 
                        DATE_TRUNC('hour', last_accessed) as hour,
                        COUNT(*) as access_count
                    FROM snakkaz_memories
                    WHERE user_id = $1
                        AND last_accessed > NOW() - INTERVAL '7 days'
                    GROUP BY hour
                    ORDER BY hour
                """, user_id)
                
                return {
                    "statistics": dict(stats),
                    "type_distribution": [dict(row) for row in type_distribution],
                    "access_patterns": [dict(row) for row in access_patterns]
                }
                
        except Exception as e:
            return {"error": str(e)}
            
    async def create_memory_collection(
        self,
        user_id: str,
        name: str,
        description: str,
        memory_ids: List[int]
    ) -> Dict[str, Any]:
        """Opprett en samling av relaterte minner"""
        try:
            if not self.db_pool:
                return {"error": "Database not available"}
                
            async with self.db_pool.acquire() as conn:
                # Opprett samling
                collection_id = await conn.fetchval("""
                    INSERT INTO snakkaz_memory_collections (user_id, name, description)
                    VALUES ($1, $2, $3)
                    RETURNING id
                """, user_id, name, description)
                
                # Legg til minner i samlingen
                if memory_ids:
                    await conn.executemany("""
                        INSERT INTO snakkaz_collection_memories (collection_id, memory_id)
                        VALUES ($1, $2)
                    """, [(collection_id, mid) for mid in memory_ids])
                    
                return {
                    "success": True,
                    "collection_id": collection_id
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def get_admin_overview(self) -> Dict[str, Any]:
        """Admin oversikt over alle brukeres minnebruk"""
        try:
            if not self.db_pool:
                return {"error": "Database not available"}
                
            async with self.db_pool.acquire() as conn:
                # Totale statistikker
                total_stats = await conn.fetchrow("""
                    SELECT 
                        COUNT(DISTINCT user_id) as total_users,
                        COUNT(*) as total_memories,
                        SUM(LENGTH(value)) as total_size_bytes,
                        AVG(importance) as avg_importance
                    FROM snakkaz_memories
                """)
                
                # Top brukere etter minnebruk
                top_users = await conn.fetch("""
                    SELECT 
                        user_id,
                        total_memories,
                        total_size_bytes,
                        last_updated
                    FROM snakkaz_memory_stats
                    ORDER BY total_memories DESC
                    LIMIT 20
                """)
                
                # Minnetype distribusjon
                type_distribution = await conn.fetch("""
                    SELECT 
                        memory_type,
                        COUNT(*) as count,
                        AVG(importance) as avg_importance
                    FROM snakkaz_memories
                    GROUP BY memory_type
                    ORDER BY count DESC
                """)
                
                return {
                    "total_statistics": dict(total_stats),
                    "top_users": [dict(row) for row in top_users],
                    "type_distribution": [dict(row) for row in type_distribution]
                }
                
        except Exception as e:
            return {"error": str(e)}
            
    # MCP Tool Definitions
    @property
    def tools(self):
        return [
            {
                "name": "store_memory",
                "description": "Lagre informasjon i langtidsminne med embedding og metadata",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string", "description": "Unik bruker-ID"},
                        "memory_type": {
                            "type": "string",
                            "enum": [
                                "user_preference",
                                "conversation_context", 
                                "learned_fact",
                                "emotional_state",
                                "task_context",
                                "user_relationship",
                                "interaction_pattern"
                            ]
                        },
                        "key": {"type": "string", "description": "Unik nøkkel for minnet"},
                        "value": {"type": "string", "description": "Minneinnhold"},
                        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                        "metadata": {"type": "object"},
                        "context": {"type": "string"},
                        "source": {"type": "string"},
                        "ttl_seconds": {"type": "integer"}
                    },
                    "required": ["user_id", "memory_type", "key", "value"]
                }
            },
            {
                "name": "retrieve_memory",
                "description": "Hent relevant informasjon fra minne med semantisk søk",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string"},
                        "query": {"type": "string"},
                        "memory_types": {"type": "array", "items": {"type": "string"}},
                        "limit": {"type": "integer", "default": 10},
                        "similarity_threshold": {"type": "number", "default": 0.7}
                    },
                    "required": ["user_id"]
                }
            },
            {
                "name": "forget_memory",
                "description": "Slett minner basert på kriterier",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string"},
                        "key": {"type": "string"},
                        "memory_type": {"type": "string"},
                        "older_than_days": {"type": "integer"}
                    },
                    "required": ["user_id"]
                }
            },
            {
                "name": "analyze_memory_patterns",
                "description": "Analyser brukerens minnemønstre",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string"},
                        "time_range_days": {"type": "integer", "default": 30}
                    },
                    "required": ["user_id"]
                }
            },
            {
                "name": "create_memory_collection",
                "description": "Opprett en samling av relaterte minner",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string"},
                        "name": {"type": "string"},
                        "description": {"type": "string"},
                        "memory_ids": {"type": "array", "items": {"type": "integer"}}
                    },
                    "required": ["user_id", "name", "description"]
                }
            },
            {
                "name": "get_admin_overview",
                "description": "Admin oversikt over alle brukeres minnebruk",
                "inputSchema": {
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            }
        ]
    
    async def call_tool(self, name: str, arguments: dict):
        """Handle tool calls"""
        if name == "store_memory":
            return await self.store_memory(**arguments)
        elif name == "retrieve_memory":
            return await self.retrieve_memory(**arguments)
        elif name == "forget_memory":
            return await self.forget_memory(**arguments)
        elif name == "analyze_memory_patterns":
            return await self.analyze_memory_patterns(**arguments)
        elif name == "create_memory_collection":
            return await self.create_memory_collection(**arguments)
        elif name == "get_admin_overview":
            return await self.get_admin_overview()
        else:
            raise ValueError(f"Ukjent verktøy: {name}")
            
    async def cleanup_expired_memories(self):
        """Periodisk opprydding av utløpte minner"""
        while True:
            try:
                if self.db_pool:
                    async with self.db_pool.acquire() as conn:
                        deleted = await conn.fetchval("""
                            DELETE FROM snakkaz_memories
                            WHERE expires_at IS NOT NULL AND expires_at < NOW()
                            RETURNING COUNT(*)
                        """)
                    if deleted:
                        print(f"Slettet {deleted} utløpte minner")
                        
                await asyncio.sleep(3600)  # Kjør hver time
                
            except Exception as e:
                print(f"Feil ved opprydding: {e}")
                await asyncio.sleep(300)  # Prøv igjen om 5 min

# Hovedprogram
async def main():
    server = MemoryMCPServer()
    await server.setup()
    
    # Start oppryddingsprosess
    asyncio.create_task(server.cleanup_expired_memories())
    
    print("🧠 Snakkaz Memory System startet - AI har full oversikt")
    print("📊 Admin dashboard tilgjengelig gjennom MCP tools")
    
    # Start MCP server
    import sys
    async with server.server.run(
        sys.stdin.buffer,
        sys.stdout.buffer,
        InitializationOptions(
            server_name="snakkaz-memory",
            server_version="1.0.0",
            capabilities={}
        )
    ):
        await asyncio.Event().wait()  # Keep server running

if __name__ == "__main__":
    asyncio.run(main())
