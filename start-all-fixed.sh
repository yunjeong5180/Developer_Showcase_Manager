#!/bin/bash

# 모든 서비스를 백그라운드에서 시작하는 스크립트

echo "🚀 Starting all services..."

# 현재 디렉토리 저장
BASE_DIR=$(pwd)

# 1. Welcome Vue.js (포트 3000)
echo "Starting Welcome Vue.js on port 3000..."
cd welcome-vue
npm run serve &
WELCOME_PID=$!
cd "$BASE_DIR"

# 2. My Codit Vue.js (포트 8080)  
echo "Starting My Codit Vue.js on port 8080..."
npm run serve &
VUE_PID=$!

# 3. Portfolio Vue.js (포트 3001)
echo "Starting Portfolio Vue.js on port 3001..."
cd portfolio-vue
npm run serve &
PORTFOLIO_PID=$!
cd "$BASE_DIR"

echo "✅ All services started!"
echo "📍 Access URLs:"
echo "   - Welcome (Vue.js): http://localhost:3000"
echo "   - My Codit (Vue.js): http://localhost:8080" 
echo "   - Portfolio (Vue.js): http://localhost:3001"
echo ""
echo "Process IDs:"
echo "   - Welcome PID: $WELCOME_PID"
echo "   - Vue PID: $VUE_PID"
echo "   - Portfolio PID: $PORTFOLIO_PID"
echo ""
echo "To stop all services, press Ctrl+C"

# 종료 시그널 핸들링
trap "echo 'Stopping all services...'; kill $WELCOME_PID $VUE_PID $PORTFOLIO_PID 2>/dev/null; exit" INT TERM

# 백그라운드 프로세스들이 종료될 때까지 대기
wait