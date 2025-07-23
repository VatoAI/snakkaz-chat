@echo off
title Fix Ollama AI Brain
echo 🔧 FIXING OLLAMA AI BRAIN ERROR
echo ===============================

echo 🛑 Stopping broken container...
docker stop snakkaz-llama-brain
docker rm snakkaz-llama-brain

echo 🧠 Starting Ollama correctly...
docker run -d ^
  --name snakkaz-llama-brain ^
  --network snakkaz-ai_snakkaz-ai-network ^
  -p 8000:11434 ^
  -v snakkaz-ai_ollama-data:/root/.ollama ^
  -e OLLAMA_HOST=0.0.0.0 ^
  ollama/ollama:latest

echo ⏳ Waiting 10 seconds for startup...
timeout /t 10

echo 📥 Downloading Llama model (this takes time)...
docker exec snakkaz-llama-brain ollama pull llama3.2

echo ✅ Testing AI brain...
curl -s http://localhost:8000 || echo "Starting up..."

echo.
echo 🎉 OLLAMA BRAIN FIXED!
echo 🧠 AI Brain: http://localhost:8000
echo 🧪 Test: docker exec snakkaz-llama-brain ollama list
echo.
pause
