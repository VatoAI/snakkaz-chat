#!/bin/bash

echo "🚀 LAUNCHING SNAKKAZ WORLD DOMINATION STACK! 🚀"

# Pull latest Docker AI images
echo "📥 Pulling Docker AI stack..."
docker pull docker/model-runner:llama3.1
docker pull qdrant/qdrant:latest
docker pull redis:7-alpine
docker pull postgres:15-alpine

# Build and launch the full stack
echo "🏗️ Building and launching SnakkaZ..."
docker-compose -f docker-compose-world-domination.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 30

# Health checks
echo "🏥 Running health checks..."
echo "Main app: $(curl -s http://localhost:3001/health | jq -r .status)"
echo "AI Model: $(curl -s http://localhost:8000/health 2>/dev/null || echo 'Starting...')"
echo "Vector DB: $(curl -s http://localhost:6333/health 2>/dev/null || echo 'Starting...')"

echo ""
echo "🎉 SNAKKAZ WORLD DOMINATION STACK LAUNCHED! 🎉"
echo "=============================================="
echo "📱 Main App:      http://localhost:3001"
echo "🧠 AI Endpoint:   http://localhost:8000"
echo "💾 Vector DB:     http://localhost:6333"
echo "🚀 Analytics:     http://localhost:3002"
echo "⚡ Redis Cache:   localhost:6379"
echo "📊 Database:      localhost:5432"
echo ""
echo "🌍 READY TO DOMINATE THE WORLD! 🌍"
