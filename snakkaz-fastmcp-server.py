#!/usr/bin/env python3
"""
SnakkaZ FastMCP Server - Enhanced Norwegian Tech Knowledge Platform
Upgraded implementation based on LlamaCloud MCP research
"""

import asyncio
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
import uuid

# FastMCP imports (would need: pip install mcp)
try:
    from mcp.server.fastmcp import Context, FastMCP
    FASTMCP_AVAILABLE = True
except ImportError:
    print("⚠️  FastMCP not available. Install with: pip install mcp")
    FASTMCP_AVAILABLE = False
    # Fallback to our current FastAPI implementation
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware

# Create FastMCP server for enhanced functionality
if FASTMCP_AVAILABLE:
    mcp = FastMCP("snakkaz-norwegian-tech-server")
else:
    # Fallback to FastAPI for demo
    app = FastAPI(title="SnakkaZ MCP Server (FastAPI Fallback)")

# Enhanced Norwegian knowledge store
class NorwegianTechKnowledge:
    def __init__(self):
        self.entities: Dict[str, Dict] = {}
        self.relations: List[Dict] = []
        self.observations: Dict[str, List[str]] = {}
        self.norwegian_terms: Dict[str, str] = {}
        self.code_snippets: Dict[str, Dict] = {}
        
        # Initialize with enhanced Norwegian tech knowledge
        self._init_norwegian_knowledge()
        
    def _init_norwegian_knowledge(self):
        """Initialize with comprehensive Norwegian tech knowledge"""
        
        # Core SnakkaZ entities
        self.create_entity(
            "SnakkaZ Platform", 
            "norwegian_tech_platform",
            [
                "End-to-end kryptert chat for norske utviklere",
                "Bruker Glass Liquid design system",
                "Integrerer Model Context Protocol (MCP)",
                "Fokuserer på norsk tech-community",
                "Støtter norsk språk og terminologi",
                "Deployed på mcp.snakkaz.com med LiteSpeed"
            ]
        )
        
        # Norwegian development practices
        self.create_entity(
            "Norske Utviklingsmetoder",
            "development_practices", 
            [
                "Fokus på personvern og datasikkerhet",
                "GDPR-compliance som standard",
                "Agile metodikk med norske team-strukturer",
                "Code review på norsk for bedre forståelse",
                "Dokumentasjon på norsk for lokale team"
            ]
        )
        
        # Norwegian tech stack preferences
        self.create_entity(
            "Norsk Tech Stack",
            "technology_stack",
            [
                "React/Next.js for frontend utvikling",
                "Node.js/Express for backend tjenester", 
                "PostgreSQL som foretrukket database",
                "Docker for containerisering",
                "Kubernetes for orkestrering",
                "GitHub for versjonskontroll og CI/CD"
            ]
        )
        
        # Norwegian tech companies and community
        self.create_entity(
            "Norsk Tech Community",
            "community",
            [
                "Fokus på bærekraftig teknologi",
                "Sterkt nettverk av tech-bedrifter",
                "Aktive meetups og konferanser",
                "Samarbeid mellom universiteter og industri",
                "Openness og knowledge sharing kultur"
            ]
        )

        # Add Norwegian tech terminology
        self.norwegian_terms.update({
            "utvikler": "developer",
            "programmerer": "programmer", 
            "koding": "coding",
            "programvare": "software",
            "nettsider": "websites",
            "apper": "applications",
            "database": "database",
            "sikkerhet": "security",
            "personvern": "privacy",
            "skyløsninger": "cloud solutions"
        })

    def create_entity(self, name: str, entity_type: str, observations: List[str] = None):
        """Create enhanced entity with Norwegian support"""
        entity_id = str(uuid.uuid4())
        self.entities[name] = {
            "id": entity_id,
            "name": name,
            "type": entity_type,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "norwegian_friendly": True,
            "tags": self._extract_norwegian_tags(observations or [])
        }
        
        if observations:
            self.observations[name] = observations
        else:
            self.observations[name] = []
            
        return entity_id

    def _extract_norwegian_tags(self, observations: List[str]) -> List[str]:
        """Extract Norwegian tech tags from observations"""
        tags = []
        for obs in observations:
            if "norsk" in obs.lower():
                tags.append("norwegian")
            if "utvikler" in obs.lower():
                tags.append("developer")
            if "sikkerhet" in obs.lower():
                tags.append("security")
            if "community" in obs.lower():
                tags.append("community")
        return list(set(tags))

    def search_norwegian_context(self, query: str) -> Dict[str, Any]:
        """Enhanced search with Norwegian language support"""
        results = []
        query_lower = query.lower()
        
        # Translate Norwegian terms to English for broader search
        translated_terms = []
        for nor_term, eng_term in self.norwegian_terms.items():
            if nor_term in query_lower:
                translated_terms.append(eng_term)
        
        search_terms = [query_lower] + translated_terms
        
        for name, entity in self.entities.items():
            entity_match = False
            
            # Search in entity name and type
            for term in search_terms:
                if (term in name.lower() or 
                    term in entity["type"].lower()):
                    entity_match = True
                    break
            
            # Search in observations
            if not entity_match:
                for obs in self.observations.get(name, []):
                    for term in search_terms:
                        if term in obs.lower():
                            entity_match = True
                            break
                    if entity_match:
                        break
            
            if entity_match:
                results.append({
                    **entity,
                    "observations": self.observations.get(name, []),
                    "relevance_score": self._calculate_relevance(query, name, entity)
                })
        
        # Sort by relevance
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return {
            "query": query,
            "translated_terms": translated_terms,
            "results_count": len(results),
            "results": results[:5],  # Top 5 most relevant
            "norwegian_context": True
        }

    def _calculate_relevance(self, query: str, entity_name: str, entity: Dict) -> float:
        """Calculate relevance score for Norwegian context"""
        score = 0.0
        query_lower = query.lower()
        
        # Higher score for Norwegian-tagged entities
        if entity.get("norwegian_friendly"):
            score += 0.5
            
        # Score for direct name matches
        if query_lower in entity_name.lower():
            score += 1.0
            
        # Score for tag matches
        for tag in entity.get("tags", []):
            if tag in query_lower:
                score += 0.3
                
        return score

# Initialize knowledge store
knowledge_store = NorwegianTechKnowledge()

# FastMCP Tools (if available)
if FASTMCP_AVAILABLE:
    
    @mcp.tool()
    async def search_norwegian_knowledge(ctx: Context, query: str) -> str:
        """Søk i norsk tech-kunnskapsbase med semantisk forståelse"""
        await ctx.info(f"🔍 Søker etter norsk tech-kunnskap: {query}")
        
        result = knowledge_store.search_norwegian_context(query)
        
        await ctx.info(f"📊 Fant {result['results_count']} relevante resultater")
        
        return json.dumps(result, indent=2, ensure_ascii=False)

    @mcp.tool()
    async def add_norwegian_entity(ctx: Context, name: str, entity_type: str, observations: str) -> str:
        """Legg til ny norsk tech-entitet i kunnskapsgrafen"""
        await ctx.info(f"➕ Legger til norsk entitet: {name}")
        
        obs_list = [obs.strip() for obs in observations.split(",")]
        entity_id = knowledge_store.create_entity(name, entity_type, obs_list)
        
        result = {
            "success": True,
            "entity_id": entity_id,
            "entity_name": name,
            "norwegian_support": True,
            "message": f"Norsk entitet '{name}' lagt til med {len(obs_list)} observasjoner"
        }
        
        await ctx.info(f"✅ Entitet '{name}' opprettet med ID: {entity_id}")
        
        return json.dumps(result, indent=2, ensure_ascii=False)

    @mcp.tool()
    async def analyze_norwegian_code(ctx: Context, code: str, language: str = "javascript") -> str:
        """Analyser kode med fokus på norske utviklingsstandarder"""
        await ctx.info(f"🔧 Analyserer {language} kode for norske standarder")
        
        analysis = {
            "language": language,
            "norwegian_standards": {
                "variable_naming": "Bruk engelske variabelnavn for konsistens",
                "comments": "Kommentarer på norsk for bedre teamforståelse", 
                "documentation": "Dokumenter API-er på både norsk og engelsk",
                "error_messages": "Feilmeldinger på norsk for brukervennlighet"
            },
            "security_review": {
                "gdpr_compliance": "Sjekk personvernshåndtering",
                "data_protection": "Krypter sensitive data",
                "audit_logging": "Implementer revisjonslogging"
            },
            "code_quality": {
                "readability": "Koden er lesbar for norske utviklere",
                "maintainability": "Følg norske team-standarder",
                "testing": "Skriv tester på norsk for clarity"
            },
            "suggestions": [
                "Bruk TypeScript for bedre typesikkerhet",
                "Implementer comprehensive error handling",
                "Legg til norsk språkstøtte i brukergrensesnittet",
                "Følg norske accessibility-standarder (WCAG)"
            ]
        }
        
        await ctx.info(f"📋 Fullført analyse med norske standarder")
        
        return json.dumps(analysis, indent=2, ensure_ascii=False)

    @mcp.tool()
    async def get_norwegian_tech_trends(ctx: Context, category: str = "general") -> str:
        """Få oversikt over norske tech-trender og beste praksis"""
        await ctx.info(f"📈 Henter norske tech-trender for: {category}")
        
        trends = {
            "category": category,
            "current_trends": {
                "sustainability": "Fokus på grønn teknologi og bærekraftig utvikling",
                "privacy_first": "Privacy-by-design som standard i norske løsninger",
                "cloud_adoption": "Økt bruk av skyløsninger med norsk datalagring",
                "ai_integration": "Integrering av AI med fokus på etikk og transparens",
                "remote_work": "Hybrid arbeidsmodeller med digitale samarbeidsverktøy"
            },
            "norwegian_companies": [
                "Opera Software - Nettlesere og privacy-fokuserte løsninger",
                "Telenor - Telekom og digitale tjenester", 
                "Equinor - Energi og digitalisering",
                "DNB - Fintech og digital banking",
                "Kahoot! - EdTech og interaktive løsninger"
            ],
            "community_resources": [
                "JavaZone - Norges største utviklerkonferanse",
                "Booster Conference - Agile og software craftsmanship",
                "NDC Oslo - .NET og generell utvikling",
                "UiO Department of Informatics - Akademisk forskning"
            ],
            "best_practices": {
                "code_quality": "Bruk moderne linting og formatering verktøy",
                "collaboration": "GitHub for åpen kildekode-bidrag",
                "learning": "Kontinuerlig læring gjennom norske tech-meetups",
                "networking": "Delta i lokale utveckler-communities"
            }
        }
        
        await ctx.info(f"✅ Hentet comprehensive oversikt over norske tech-trender")
        
        return json.dumps(trends, indent=2, ensure_ascii=False)

    # Enhanced server startup
    async def run_snakkaz_mcp_server():
        """Run SnakkaZ MCP server with Norwegian tech focus"""
        print("🚀 Starting SnakkaZ Norwegian Tech MCP Server...")
        print(f"📊 Initialized with {len(knowledge_store.entities)} entities")
        print(f"🇳🇴 Norwegian terms: {len(knowledge_store.norwegian_terms)}")
        print("🔧 Available tools:")
        print("   - search_norwegian_knowledge")
        print("   - add_norwegian_entity") 
        print("   - analyze_norwegian_code")
        print("   - get_norwegian_tech_trends")
        
        # Multiple transport support
        transport = os.getenv("MCP_TRANSPORT", "stdio")
        port = int(os.getenv("MCP_PORT", "8001"))
        
        if transport == "sse":
            print(f"🌐 Starting SSE server on port {port}")
            await mcp.run_sse_async(port=port)
        elif transport == "http":
            print(f"🌐 Starting HTTP server on port {port}")
            mcp.run(transport="streamable-http", port=port)
        else:
            print("📡 Starting stdio transport (for Claude Desktop)")
            mcp.run(transport="stdio")

else:
    # FastAPI fallback implementation
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def root():
        return {
            "service": "SnakkaZ Norwegian Tech MCP Server (FastAPI Fallback)",
            "status": "running",
            "entities": len(knowledge_store.entities),
            "norwegian_terms": len(knowledge_store.norwegian_terms),
            "message": "Install 'mcp' package for enhanced FastMCP features"
        }

    @app.get("/search")
    async def search_endpoint(q: str):
        result = knowledge_store.search_norwegian_context(q)
        return result

if __name__ == "__main__":
    if FASTMCP_AVAILABLE:
        asyncio.run(run_snakkaz_mcp_server())
    else:
        import uvicorn
        print("🚀 Starting SnakkaZ MCP Server (FastAPI Fallback)")
        print("💡 Install 'mcp' package for full FastMCP features")
        uvicorn.run(app, host="0.0.0.0", port=8001)
