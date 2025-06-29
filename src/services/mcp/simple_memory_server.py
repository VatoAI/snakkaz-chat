#!/usr/bin/env python3
"""
Snakkaz Simple Memory Server
A FastAPI-based memory system for Snakkaz Chat
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncpg
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import json
import os
from pydantic import BaseModel
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Snakkaz Memory Server", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://snakkaz.com", "https://www.snakkaz.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Memory(BaseModel):
    user_id: str
    memory_type: str
    key: str
    value: str
    metadata: Dict[str, Any] = {}
    confidence: float = 1.0
    importance: float = 0.5
    context: Optional[str] = None
    source: Optional[str] = None

class MemoryResponse(BaseModel):
    id: int
    user_id: str
    memory_type: str
    key: str
    value: str
    metadata: Dict[str, Any]
    confidence: float
    importance: float
    access_count: int
    created_at: datetime
    updated_at: datetime
    last_accessed: datetime
    context: Optional[str]
    source: Optional[str]

# Database connection
async def get_db_pool():
    if not hasattr(app.state, 'db_pool') or app.state.db_pool is None:
        # Use environment variables for database connection
        database_url = os.getenv('DATABASE_URL', 'postgresql://localhost/snakkaz')
        try:
            app.state.db_pool = await asyncpg.create_pool(database_url, min_size=1, max_size=5)
            logger.info("Database pool created successfully")
        except Exception as e:
            logger.error(f"Failed to create database pool: {e}")
            # For development, create a mock connection
            app.state.db_pool = None
    return app.state.db_pool

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Snakkaz Memory Server...")
    await get_db_pool()

@app.on_event("shutdown")
async def shutdown_event():
    if hasattr(app.state, 'db_pool') and app.state.db_pool:
        await app.state.db_pool.close()

@app.get("/")
async def root():
    return {
        "name": "Snakkaz Memory Server",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/health")
async def health_check():
    db_status = "disconnected"
    try:
        pool = await get_db_pool()
        if pool:
            async with pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/memories", response_model=Dict[str, Any])
async def store_memory(memory: Memory):
    """Store a new memory"""
    try:
        pool = await get_db_pool()
        if not pool:
            # Mock response for development
            return {
                "status": "success",
                "message": "Memory stored (mock mode)",
                "id": 1,
                "memory": memory.dict()
            }
        
        async with pool.acquire() as conn:
            query = """
                INSERT INTO snakkaz_memories 
                (user_id, memory_type, key, value, metadata, confidence, importance, context, source)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (user_id, key) 
                DO UPDATE SET 
                    value = EXCLUDED.value,
                    metadata = EXCLUDED.metadata,
                    confidence = EXCLUDED.confidence,
                    importance = EXCLUDED.importance,
                    updated_at = NOW(),
                    context = EXCLUDED.context,
                    source = EXCLUDED.source
                RETURNING id
            """
            memory_id = await conn.fetchval(
                query,
                memory.user_id,
                memory.memory_type,
                memory.key,
                memory.value,
                json.dumps(memory.metadata),
                memory.confidence,
                memory.importance,
                memory.context,
                memory.source
            )
            
            return {
                "status": "success",
                "message": "Memory stored successfully",
                "id": memory_id
            }
            
    except Exception as e:
        logger.error(f"Error storing memory: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to store memory: {str(e)}")

@app.get("/memories/{user_id}", response_model=List[MemoryResponse])
async def get_memories(user_id: str, memory_type: Optional[str] = None, limit: int = 100):
    """Retrieve memories for a user"""
    try:
        pool = await get_db_pool()
        if not pool:
            # Mock response for development
            return [
                {
                    "id": 1,
                    "user_id": user_id,
                    "memory_type": memory_type or "user_preference",
                    "key": "test_memory",
                    "value": "This is a test memory",
                    "metadata": {},
                    "confidence": 1.0,
                    "importance": 0.5,
                    "access_count": 1,
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc),
                    "last_accessed": datetime.now(timezone.utc),
                    "context": None,
                    "source": "mock"
                }
            ]
        
        async with pool.acquire() as conn:
            if memory_type:
                query = """
                    SELECT * FROM snakkaz_memories 
                    WHERE user_id = $1 AND memory_type = $2
                    ORDER BY importance DESC, updated_at DESC
                    LIMIT $3
                """
                rows = await conn.fetch(query, user_id, memory_type, limit)
            else:
                query = """
                    SELECT * FROM snakkaz_memories 
                    WHERE user_id = $1
                    ORDER BY importance DESC, updated_at DESC
                    LIMIT $2
                """
                rows = await conn.fetch(query, user_id, limit)
            
            memories = []
            for row in rows:
                memory_dict = dict(row)
                memory_dict['metadata'] = json.loads(memory_dict['metadata']) if memory_dict['metadata'] else {}
                memories.append(MemoryResponse(**memory_dict))
            
            return memories
            
    except Exception as e:
        logger.error(f"Error retrieving memories: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve memories: {str(e)}")

@app.delete("/memories/{user_id}/{key}")
async def delete_memory(user_id: str, key: str):
    """Delete a specific memory"""
    try:
        pool = await get_db_pool()
        if not pool:
            return {"status": "success", "message": "Memory deleted (mock mode)"}
        
        async with pool.acquire() as conn:
            query = "DELETE FROM snakkaz_memories WHERE user_id = $1 AND key = $2"
            result = await conn.execute(query, user_id, key)
            
            if result == "DELETE 0":
                raise HTTPException(status_code=404, detail="Memory not found")
            
            return {"status": "success", "message": "Memory deleted"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting memory: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete memory: {str(e)}")

@app.get("/stats/{user_id}")
async def get_memory_stats(user_id: str):
    """Get memory statistics for a user"""
    try:
        pool = await get_db_pool()
        if not pool:
            return {
                "total_memories": 1,
                "memory_types": {"user_preference": 1},
                "average_importance": 0.5,
                "last_updated": datetime.now(timezone.utc).isoformat()
            }
        
        async with pool.acquire() as conn:
            # Total memories
            total = await conn.fetchval(
                "SELECT COUNT(*) FROM snakkaz_memories WHERE user_id = $1", user_id
            )
            
            # Memory types breakdown
            types_query = """
                SELECT memory_type, COUNT(*) as count 
                FROM snakkaz_memories 
                WHERE user_id = $1 
                GROUP BY memory_type
            """
            types_rows = await conn.fetch(types_query, user_id)
            memory_types = {row['memory_type']: row['count'] for row in types_rows}
            
            # Average importance
            avg_importance = await conn.fetchval(
                "SELECT AVG(importance) FROM snakkaz_memories WHERE user_id = $1", user_id
            ) or 0.0
            
            # Last updated
            last_updated = await conn.fetchval(
                "SELECT MAX(updated_at) FROM snakkaz_memories WHERE user_id = $1", user_id
            )
            
            return {
                "total_memories": total,
                "memory_types": memory_types,
                "average_importance": float(avg_importance),
                "last_updated": last_updated.isoformat() if last_updated else None
            }
            
    except Exception as e:
        logger.error(f"Error getting memory stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get memory stats: {str(e)}")

if __name__ == "__main__":
    logger.info("Starting Snakkaz Memory Server on port 3001...")
    uvicorn.run(
        "simple_memory_server:app",
        host="0.0.0.0",
        port=3001,
        log_level="info",
        reload=True
    )
