@echo off
echo 🔥 SnakkaZ Docker Launcher!
echo ========================

echo 📥 Copying Docker files...
copy /Y "%~dp0docker-compose-simple.yml" .
copy /Y "%~dp0package.json" .

echo 🚀 Starting SnakkaZ with Docker...
docker-compose -f docker-compose-simple.yml up -d

echo.
echo ✅ SnakkaZ Docker is starting!
echo 🌐 Main App: http://localhost:3001
echo 🏥 Health: http://localhost:3001/health
echo.
echo 📊 Check status: docker ps
echo ⏹️  Stop: docker-compose -f docker-compose-simple.yml down
echo.
pause
