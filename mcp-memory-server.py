#!/usr/bin/env python3
"""
SnakkaZ MCP Memory Server - Simplified Version
A lightweight in-memory knowledge graph for SnakkaZ MCP
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
import uuid

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("snakkaz-mcp-memory")

app = FastAPI(
    title="SnakkaZ MCP Memory Server",
    description="In-memory knowledge graph for SnakkaZ MCP",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
class MemoryStore:
    def __init__(self):
        self.entities: Dict[str, Dict] = {}
        self.relations: List[Dict] = []
        self.observations: Dict[str, List[str]] = {}
        
    def create_entity(self, name: str, entity_type: str, observations: Optional[List[str]] = None):
        """Create a new entity in the knowledge graph"""
        entity_id = str(uuid.uuid4())
        self.entities[name] = {
            "id": entity_id,
            "name": name,
            "type": entity_type,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        if observations:
            self.observations[name] = observations
        else:
            self.observations[name] = []
            
        return entity_id
    
    def add_observation(self, entity_name: str, observation: str):
        """Add observation to an entity"""
        if entity_name not in self.entities:
            raise ValueError(f"Entity {entity_name} not found")
            
        if entity_name not in self.observations:
            self.observations[entity_name] = []
            
        self.observations[entity_name].append(observation)
        self.entities[entity_name]["updated_at"] = datetime.now().isoformat()
    
    def create_relation(self, from_entity: str, to_entity: str, relation_type: str):
        """Create a relation between entities"""
        if from_entity not in self.entities:
            raise ValueError(f"Entity {from_entity} not found")
        if to_entity not in self.entities:
            raise ValueError(f"Entity {to_entity} not found")
            
        relation = {
            "id": str(uuid.uuid4()),
            "from": from_entity,
            "to": to_entity,
            "type": relation_type,
            "created_at": datetime.now().isoformat()
        }
        
        self.relations.append(relation)
        return relation["id"]
    
    def search_entities(self, query: str) -> List[Dict]:
        """Search entities by name, type, or observations"""
        results = []
        query_lower = query.lower()
        
        for name, entity in self.entities.items():
            if (query_lower in name.lower() or 
                query_lower in entity["type"].lower()):
                results.append({
                    **entity,
                    "observations": self.observations.get(name, [])
                })
                continue
                
            # Search in observations
            for obs in self.observations.get(name, []):
                if query_lower in obs.lower():
                    results.append({
                        **entity,
                        "observations": self.observations.get(name, [])
                    })
                    break
                    
        return results

# Initialize memory store
memory_store = MemoryStore()

# Pre-populate with SnakkaZ knowledge
def init_snakkaz_knowledge():
    """Initialize with SnakkaZ project knowledge"""
    
    # Create core entities
    memory_store.create_entity(
        "SnakkaZ Platform", 
        "project",
        [
            "End-to-end encrypted chat platform for Norwegian developers",
            "Features Glass Liquid design system",
            "Integrates Model Context Protocol (MCP)",
            "Deployed on mcp.snakkaz.com",
            "Built with React, Node.js, and Supabase"
        ]
    )
    
    memory_store.create_entity(
        "Glass Liquid Design", 
        "design_system",
        [
            "Modern UI with liquid animations",
            "Glass morphism effects with blur",
            "Norwegian aurora-inspired colors",
            "Mobile-first responsive design",
            "Implemented in CSS with custom animations"
        ]
    )
    
    memory_store.create_entity(
        "MCP Integration", 
        "technology",
        [
            "Model Context Protocol for AI-enhanced conversations",
            "Vector database with Qdrant",
            "Knowledge graph for Norwegian tech expertise",
            "Real-time context sharing between users"
        ]
    )
    
    memory_store.create_entity(
        "Norwegian Tech Community", 
        "community",
        [
            "Target audience for SnakkaZ platform",
            "Developers seeking secure collaboration",
            "Focus on privacy and end-to-end encryption",
            "Beta testing community"
        ]
    )
    
    # Create relations
    memory_store.create_relation("SnakkaZ Platform", "Glass Liquid Design", "uses")
    memory_store.create_relation("SnakkaZ Platform", "MCP Integration", "implements")
    memory_store.create_relation("SnakkaZ Platform", "Norwegian Tech Community", "serves")
    memory_store.create_relation("Glass Liquid Design", "Norwegian Tech Community", "appeals_to")

# Initialize on startup
init_snakkaz_knowledge()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "SnakkaZ MCP Memory Server",
        "status": "running",
        "version": "1.0.0",
        "entities_count": len(memory_store.entities),
        "relations_count": len(memory_store.relations),
        "total_observations": sum(len(obs) for obs in memory_store.observations.values())
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "memory_usage": {
            "entities": len(memory_store.entities),
            "relations": len(memory_store.relations),
            "observations": sum(len(obs) for obs in memory_store.observations.values())
        }
    }

@app.post("/entities")
async def create_entity(entity_data: dict):
    """Create a new entity"""
    try:
        name = entity_data["name"]
        entity_type = entity_data["type"]
        observations = entity_data.get("observations", [])
        
        entity_id = memory_store.create_entity(name, entity_type, observations)
        
        return {
            "success": True,
            "entity_id": entity_id,
            "message": f"Entity '{name}' created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/observations")
async def add_observation(observation_data: dict):
    """Add observation to an entity"""
    try:
        entity_name = observation_data["entity_name"]
        observation = observation_data["observation"]
        
        memory_store.add_observation(entity_name, observation)
        
        return {
            "success": True,
            "message": f"Observation added to '{entity_name}'"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/relations")
async def create_relation(relation_data: dict):
    """Create a relation between entities"""
    try:
        from_entity = relation_data["from"]
        to_entity = relation_data["to"]
        relation_type = relation_data["type"]
        
        relation_id = memory_store.create_relation(from_entity, to_entity, relation_type)
        
        return {
            "success": True,
            "relation_id": relation_id,
            "message": f"Relation '{relation_type}' created between '{from_entity}' and '{to_entity}'"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/search")
async def search_entities(q: str):
    """Search entities and observations"""
    try:
        results = memory_store.search_entities(q)
        return {
            "query": q,
            "results_count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/entities")
async def get_all_entities():
    """Get all entities with their observations"""
    try:
        entities_with_obs = []
        for name, entity in memory_store.entities.items():
            entities_with_obs.append({
                **entity,
                "observations": memory_store.observations.get(name, [])
            })
        
        return {
            "count": len(entities_with_obs),
            "entities": entities_with_obs
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/relations")
async def get_all_relations():
    """Get all relations"""
    try:
        return {
            "count": len(memory_store.relations),
            "relations": memory_store.relations
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/graph")
async def get_knowledge_graph():
    """Get the complete knowledge graph"""
    try:
        entities_with_obs = []
        for name, entity in memory_store.entities.items():
            entities_with_obs.append({
                **entity,
                "observations": memory_store.observations.get(name, [])
            })
        
        return {
            "entities": entities_with_obs,
            "relations": memory_store.relations,
            "stats": {
                "entities_count": len(memory_store.entities),
                "relations_count": len(memory_store.relations),
                "total_observations": sum(len(obs) for obs in memory_store.observations.values())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    logger.info("🧠 Starting SnakkaZ MCP Memory Server...")
    logger.info(f"📊 Initialized with {len(memory_store.entities)} entities")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8001,
        log_level="info"
    )
