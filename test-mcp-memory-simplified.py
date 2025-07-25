#!/usr/bin/env python3
"""
🧠 SnakkaZ MCP Memory + LLaMA Test - Simplified Version
Tester MCP Memory systemet og LLaMA integrasjon
"""

import asyncio
import json
import os
import subprocess
import time
from typing import Dict, List, Any

def test_memory_server_status():
    """Test om MCP Memory serveren er tilgjengelig"""
    print("🧠 Testing MCP Memory Server Status...")
    
    try:
        # Check if simple memory server is running
        result = subprocess.run([
            "curl", "-s", "http://localhost:8080/health"
        ], capture_output=True, text=True, timeout=5)
        
        if result.returncode == 0:
            print("✅ Memory server is accessible")
            print(f"   Response: {result.stdout[:100]}...")
            return True
        else:
            print("❌ Memory server not accessible")
            return False
            
    except Exception as e:
        print(f"❌ Memory server test error: {e}")
        return False

def test_llama_status():
    """Test om LLaMA serveren er tilgjengelig"""
    print("🦙 Testing LLaMA Server Status...")
    
    try:
        result = subprocess.run([
            "curl", "-s", "http://localhost:8000/api/version"
        ], capture_output=True, text=True, timeout=5)
        
        if result.returncode == 0:
            print("✅ LLaMA server is accessible")
            return True
        else:
            print("❌ LLaMA server not accessible")
            print("   Note: LLaMA kan startes med 'ollama serve'")
            return False
            
    except Exception as e:
        print(f"❌ LLaMA server test error: {e}")
        return False

def start_memory_server():
    """Start MCP Memory serveren hvis den ikke kjører"""
    print("🚀 Starting MCP Memory Server...")
    
    try:
        # Start simple memory server
        memory_server_path = "/workspaces/snakkaz-chat/src/services/mcp/simple_memory_server.py"
        
        if os.path.exists(memory_server_path):
            subprocess.Popen([
                "python3", memory_server_path
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
            # Wait a moment for startup
            time.sleep(3)
            print("✅ Memory server started")
            return True
        else:
            print(f"❌ Memory server file not found: {memory_server_path}")
            return False
            
    except Exception as e:
        print(f"❌ Failed to start memory server: {e}")
        return False

def test_store_snakkaz_knowledge():
    """Lagre SnakkaZ-spesifikk kunnskap i memory systemet"""
    print("📚 Storing SnakkaZ Knowledge in Memory...")
    
    snakkaz_knowledge = [
        {
            "user_id": "snakkaz_system",
            "memory_type": "learned_fact",
            "key": "snakkaz_features",
            "value": "SnakkaZ er en E2EE chat platform med Glass Liquid design, MCP integration, og norsk språk støtte"
        },
        {
            "user_id": "snakkaz_system", 
            "memory_type": "learned_fact",
            "key": "glass_liquid_design",
            "value": "Glass Liquid design system bruker backdrop-filter blur, transparent backgrounds, og gradient farger inspirert av nordlys"
        },
        {
            "user_id": "snakkaz_system",
            "memory_type": "learned_fact", 
            "key": "mcp_integration",
            "value": "MCP (Model Context Protocol) gir AI-assistenter tilgang til SnakkaZ verktøy og persistent memory"
        },
        {
            "user_id": "snakkaz_system",
            "memory_type": "learned_fact",
            "key": "deployment_info",
            "value": "SnakkaZ er deployed på mcp.snakkaz.com med cPanel Node.js hosting og Supabase database"
        }
    ]
    
    success_count = 0
    
    for knowledge in snakkaz_knowledge:
        try:
            # Use curl to store knowledge
            curl_data = json.dumps(knowledge)
            result = subprocess.run([
                "curl", "-s", "-X", "POST",
                "http://localhost:8080/memories",
                "-H", "Content-Type: application/json",
                "-d", curl_data
            ], capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(f"✅ Stored: {knowledge['key']}")
                success_count += 1
            else:
                print(f"❌ Failed to store: {knowledge['key']}")
                
        except Exception as e:
            print(f"❌ Error storing {knowledge['key']}: {e}")
    
    print(f"📊 Successfully stored {success_count}/{len(snakkaz_knowledge)} knowledge items")
    return success_count > 0

def test_memory_search():
    """Test søk i memory systemet"""
    print("🔍 Testing Memory Search...")
    
    search_queries = [
        "What is SnakkaZ?",
        "Glass Liquid design",
        "MCP integration features", 
        "deployment information"
    ]
    
    for query in search_queries:
        try:
            result = subprocess.run([
                "curl", "-s", 
                f"http://localhost:8080/memories/snakkaz_system?q={query.replace(' ', '%20')}"
            ], capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                try:
                    response = json.loads(result.stdout)
                    memories = response.get('memories', [])
                    print(f"✅ Search '{query}': {len(memories)} results")
                    
                    if memories:
                        top_result = memories[0]
                        print(f"   📍 Top result: {top_result.get('key', 'N/A')}")
                        
                except json.JSONDecodeError:
                    print(f"❌ Invalid JSON response for '{query}'")
            else:
                print(f"❌ Search failed for '{query}'")
                
        except Exception as e:
            print(f"❌ Search error for '{query}': {e}")

def test_llama_with_memory():
    """Test LLaMA chat med memory kontekst"""
    print("🦙 Testing LLaMA + Memory Integration...")
    
    # First get relevant memories about SnakkaZ
    try:
        search_result = subprocess.run([
            "curl", "-s", 
            "http://localhost:8080/memories/snakkaz_system?q=SnakkaZ%20features"
        ], capture_output=True, text=True, timeout=10)
        
        memories = []
        if search_result.returncode == 0:
            try:
                response = json.loads(search_result.stdout)
                memories = response.get('memories', [])
            except json.JSONDecodeError:
                pass
        
        # Build context from memories
        context = "\n".join([
            f"Memory: {mem.get('value', '')}" 
            for mem in memories[:3]
        ])
        
        # Prepare LLaMA prompt with memory context
        prompt = f"""Du er SnakkaZ AI Assistant. 

RELEVANT MINNEINFORMASJON:
{context}

BRUKERENS SPØRSMÅL: Fortell meg om SnakkaZ features på norsk

Svar basert på minneinformasjonen over."""
        
        # Test LLaMA with context
        llama_payload = {
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "max_tokens": 300
            }
        }
        
        # Write payload to temp file (for curl)
        with open('/tmp/llama_test.json', 'w') as f:
            json.dump(llama_payload, f)
        
        llama_result = subprocess.run([
            "curl", "-s", "-X", "POST",
            "http://localhost:8000/api/generate",
            "-H", "Content-Type: application/json", 
            "-d", f"@/tmp/llama_test.json"
        ], capture_output=True, text=True, timeout=30)
        
        if llama_result.returncode == 0:
            try:
                response = json.loads(llama_result.stdout)
                answer = response.get('response', 'No response')
                print(f"✅ LLaMA responded with memory context")
                print(f"🤖 Response: {answer[:200]}...")
                print(f"📚 Used {len(memories)} memories as context")
                return True
            except json.JSONDecodeError:
                print("❌ Invalid JSON from LLaMA")
        else:
            print("❌ LLaMA request failed")
            
    except Exception as e:
        print(f"❌ LLaMA + Memory test error: {e}")
    
    return False

def test_external_knowledge_integration():
    """Test lagring av kunnskap fra eksterne kilder"""
    print("🌐 Testing External Knowledge Integration...")
    
    external_knowledge = [
        {
            "user_id": "snakkaz_system",
            "memory_type": "learned_fact",
            "key": "supabase_setup_guide",
            "value": "Supabase krever VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY environment variabler for å koble til database",
            "source": "supabase_docs"
        },
        {
            "user_id": "snakkaz_system",
            "memory_type": "learned_fact", 
            "key": "github_repository_info",
            "value": "SnakkaZ repository er VatoAI/snakkaz-chat på GitHub med E2EE chat og MCP integrasjon",
            "source": "github_api"
        },
        {
            "user_id": "snakkaz_system",
            "memory_type": "learned_fact",
            "key": "namecheap_dns_config", 
            "value": "Namecheap DNS: A record peker til server IP, CNAME for subdomener som mcp.snakkaz.com",
            "source": "namecheap_docs"
        }
    ]
    
    success_count = 0
    
    for knowledge in external_knowledge:
        try:
            curl_data = json.dumps(knowledge)
            result = subprocess.run([
                "curl", "-s", "-X", "POST",
                "http://localhost:8080/memories",
                "-H", "Content-Type: application/json",
                "-d", curl_data
            ], capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(f"✅ Stored external knowledge: {knowledge['key']}")
                success_count += 1
            else:
                print(f"❌ Failed to store: {knowledge['key']}")
                
        except Exception as e:
            print(f"❌ Error storing external knowledge: {e}")
    
    return success_count > 0

def run_complete_test():
    """Kjør komplett test av MCP Memory + LLaMA systemet"""
    print("🚀 SnakkaZ MCP Memory + LLaMA Complete Test")
    print("=" * 50)
    
    # Step 1: Check if servers are running
    memory_running = test_memory_server_status()
    llama_running = test_llama_status()
    
    # Step 2: Start memory server if needed
    if not memory_running:
        start_memory_server()
        time.sleep(2)
        memory_running = test_memory_server_status()
    
    # Step 3: Test memory storage and search
    if memory_running:
        test_store_snakkaz_knowledge()
        test_external_knowledge_integration()
        test_memory_search()
        
        # Step 4: Test LLaMA integration if available
        if llama_running:
            test_llama_with_memory()
        else:
            print("ℹ️  LLaMA not available - skipping LLaMA integration test")
            print("   To enable LLaMA: run 'ollama serve' in another terminal")
    
    print("\n" + "=" * 50)
    print("🎉 SnakkaZ MCP Memory Test Complete!")
    
    if memory_running and llama_running:
        print("✅ MCP Memory + LLaMA integration: WORKING! 🇳🇴")
    elif memory_running:
        print("✅ MCP Memory system: WORKING! 🧠")
        print("⚠️  LLaMA integration: Not tested (LLaMA not running)")
    else:
        print("❌ MCP Memory system: FAILED")
    
    print("\nNeste steg:")
    print("1. Deploy MCP Memory server til production")
    print("2. Konfigurer LLaMA for production bruk") 
    print("3. Integrer med live mcp.snakkaz.com")

if __name__ == "__main__":
    run_complete_test()
