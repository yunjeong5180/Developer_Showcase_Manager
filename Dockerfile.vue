# Vue.js 관리자 앱용 Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사 (node_modules는 제외)
COPY src ./src
COPY public ./public
COPY vue.config.js babel.config.js jsconfig.json ./

# Vue.js 앱 빌드 (turbo 사용하지 않음)
RUN npx vue-cli-service build

# 프로덕션 서버 실행
EXPOSE 8080
CMD ["npm", "run", "serve"]