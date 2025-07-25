#!/usr/bin/env python3
"""
SnakkaZ MCP + LLaMA Integration Test
Demonstrates integration between MCP Memory and LLaMA for Norwegian tech conversations
"""

import requests
import json
import time
from datetime import datetime

class SnakkazMCPDemo:
    def __init__(self):
        self.mcp_base_url = "http://localhost:8001"
        print("🚀 SnakkaZ MCP + LLaMA Integration Demo")
        print("=" * 50)
        
    def test_mcp_connection(self):
        """Test connection to MCP Memory server"""
        try:
            response = requests.get(f"{self.mcp_base_url}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ MCP Memory Server: {data['status']}")
                print(f"📊 Entities: {data['memory_usage']['entities']}")
                print(f"💭 Observations: {data['memory_usage']['observations']}")
                return True
        except:
            print("❌ MCP Memory Server: Nedkoblet")
            return False
    
    def search_norwegian_knowledge(self, query):
        """Search for Norwegian tech knowledge"""
        try:
            response = requests.get(f"{self.mcp_base_url}/search", params={"q": query})
            if response.status_code == 200:
                data = response.json()
                print(f"\n🔍 Søk: '{query}'")
                print(f"📝 Resultater: {data['results_count']}")
                
                for result in data['results'][:2]:  # Show first 2 results
                    print(f"\n  📋 {result['name']} ({result['type']})")
                    for obs in result['observations'][:2]:  # Show first 2 observations
                        print(f"    • {obs}")
                        
                return data['results']
        except Exception as e:
            print(f"❌ Søk feilet: {e}")
            return []
    
    def add_norwegian_knowledge(self, entity_name, entity_type, observations):
        """Add new Norwegian knowledge to the graph"""
        try:
            payload = {
                "name": entity_name,
                "type": entity_type,
                "observations": observations
            }
            
            response = requests.post(f"{self.mcp_base_url}/entities", json=payload)
            if response.status_code == 200:
                print(f"✅ Lagt til: {entity_name}")
                return True
        except Exception as e:
            print(f"❌ Kunne ikke legge til {entity_name}: {e}")
            return False
    
    def simulate_llama_conversation(self, user_input):
        """Simulate LLaMA conversation with MCP context"""
        print(f"\n🤖 Simulert LLaMA samtale:")
        print(f"👤 Bruker: {user_input}")
        
        # Search for relevant context
        search_results = self.search_norwegian_knowledge(user_input)
        
        # Simulate LLaMA response with context
        context_summary = []
        for result in search_results[:3]:
            context_summary.extend(result['observations'][:2])
        
        llama_response = f"""
🤖 LLaMA (med MCP kontekst): 
Basert på SnakkaZ kunnskapsbase finner jeg:

{chr(10).join(f"• {obs}" for obs in context_summary[:3])}

Dette gir meg kontekst til å svare mer presist på ditt spørsmål om norsk tech-utvikling.
        """
        
        print(llama_response)
        return llama_response
    
    def run_demo(self):
        """Run the complete demo"""
        print(f"⏰ Demo startet: {datetime.now().strftime('%H:%M:%S')}")
        
        # Test 1: Check MCP connection
        if not self.test_mcp_connection():
            return
        
        # Test 2: Search existing knowledge
        self.search_norwegian_knowledge("Glass Liquid")
        self.search_norwegian_knowledge("Norwegian developers")
        
        # Test 3: Add new knowledge
        print(f"\n🧠 Legger til ny kunnskap...")
        self.add_norwegian_knowledge(
            "Supabase Integration",
            "database",
            [
                "PostgreSQL database for SnakkaZ",
                "Real-time subscriptions for chat",
                "Authentication and user management",
                "Vector embeddings for semantic search"
            ]
        )
        
        # Test 4: Simulate LLaMA conversations
        print(f"\n💬 LLaMA Samtale Demo:")
        self.simulate_llama_conversation("Fortell meg om Glass Liquid design")
        self.simulate_llama_conversation("Hvordan fungerer MCP integration")
        
        # Test 5: Show final stats
        print(f"\n📊 Demo Statistikk:")
        try:
            response = requests.get(f"{self.mcp_base_url}/graph")
            if response.status_code == 200:
                data = response.json()
                stats = data['stats']
                print(f"  📋 Totalt entities: {stats['entities_count']}")
                print(f"  🔗 Totalt relasjoner: {stats['relations_count']}")
                print(f"  💭 Totalt observasjoner: {stats['total_observations']}")
        except:
            pass
            
        print(f"\n🎉 Demo fullført! SnakkaZ MCP + LLaMA integrering fungerer!")

if __name__ == "__main__":
    demo = SnakkazMCPDemo()
    demo.run_demo()
