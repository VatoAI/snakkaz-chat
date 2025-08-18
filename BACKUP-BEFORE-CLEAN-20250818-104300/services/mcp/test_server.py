#!/usr/bin/env python3
"""
Simple test MCP server to verify dependencies and connectivity
"""
from fastapi import FastAPI
import uvicorn
import os

app = FastAPI(title="Snakkaz Memory Test Server")

@app.get("/")
async def root():
    return {"message": "Snakkaz Memory Test Server", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "dependencies": "loaded"}

if __name__ == "__main__":
    port = int(os.getenv("MCP_PORT", 3001))
    print(f"Starting Snakkaz Memory Test Server on port {port}")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        log_level="info"
    )
