# Vue.js 관리자 앱용 Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# Vue.js 앱 빌드
RUN npm run build

# 프로덕션 서버 실행
EXPOSE 8080
CMD ["npm", "run", "serve"]