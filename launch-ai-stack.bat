@echo off
title SnakkaZ AI Stack - World Domination Launcher
color 0A

echo.
echo      🧠 SNAKKAZ AI STACK UPGRADE 🧠
echo =====================================
echo      Ready for WORLD DOMINATION!
echo.

echo ⏹️  Stopping any existing containers...
docker-compose down 2>nul
docker stop snakkaz-ai-brain snakkaz-llama-brain snakkaz-vector-memory snakkaz-speed-cache snakkaz-analytics 2>nul
docker rm snakkaz-ai-brain snakkaz-llama-brain snakkaz-vector-memory snakkaz-speed-cache snakkaz-analytics 2>nul

echo.
echo 🔥 Starting AI DOMINATION STACK...
echo    This will download AI models - be patient!
echo.

docker-compose -f docker-compose-ai-stack.yml up -d

echo.
echo 🎉 SNAKKAZ AI EMPIRE IS STARTING!
echo =================================
echo.
echo 📱 Main App (AI):  http://localhost:3001
echo 🤖 AI Endpoint:    http://localhost:3001/ai
echo 🏥 Health Status:  http://localhost:3001/health
echo 🧠 Llama Brain:    http://localhost:8000
echo 📊 Analytics:      http://localhost:3002
echo 💾 Vector DB:      http://localhost:6333
echo ⚡ Redis Cache:    http://localhost:6379
echo.
echo 🔍 Check containers: docker ps
echo 📊 View logs:       docker-compose -f docker-compose-ai-stack.yml logs -f
echo ⏹️  Stop stack:      docker-compose -f docker-compose-ai-stack.yml down
echo.
echo 🚀 FIRST TIME? AI models are downloading in background!
echo    Check progress: docker logs snakkaz-llama-brain -f
echo.
pause
