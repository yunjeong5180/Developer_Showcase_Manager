# 🚀 배포 가이드

## 📋 배포 전 체크리스트

- [ ] 모든 테스트 통과 확인 (`npm run test`)
- [ ] 빌드 성공 확인 (`npm run build`)
- [ ] 환경 변수 준비 (`.env.example` 참고)
- [ ] Git 커밋 및 푸시 완료

## 🔷 Netlify 배포

### 1. GitHub 연동 배포 (권장)

1. [Netlify](https://app.netlify.com) 로그인
2. "Add new site" → "Import an existing project" 클릭
3. GitHub 연동 및 저장소 선택
4. 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18.19.1
5. 환경 변수 설정:
   ```
   VUE_APP_SUPABASE_URL=your_supabase_url
   VUE_APP_SUPABASE_ANON_KEY=your_supabase_key
   ```
6. "Deploy site" 클릭

### 2. CLI 배포

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 빌드 및 배포
npm run build
netlify deploy --prod --dir=dist
```

### 3. 드래그 앤 드롭 배포

1. `npm run build` 실행
2. [Netlify Drop](https://app.netlify.com/drop) 접속
3. `dist` 폴더를 드래그 앤 드롭

## 🟦 Vercel 배포

### 1. GitHub 연동 배포

1. [Vercel](https://vercel.com) 로그인
2. "New Project" 클릭
3. GitHub 저장소 Import
4. Framework Preset: "Vue.js" 선택
5. 환경 변수 추가
6. "Deploy" 클릭

### 2. CLI 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 🚂 Railway 배포

### 1. GitHub 연동 배포

1. [Railway](https://railway.app) 로그인
2. "New Project" → "Deploy from GitHub repo"
3. 저장소 선택
4. 환경 변수 설정 (Variables 탭)
5. 자동 배포 시작

### 2. 환경 변수 설정

Railway 대시보드 → Variables:
```
VUE_APP_SUPABASE_URL=...
VUE_APP_SUPABASE_ANON_KEY=...
PORT=8080
```

## 🐳 Docker 배포

### 1. Docker 이미지 빌드

```bash
# 이미지 빌드
docker build -t mycodit-vue .

# 로컬 실행
docker run -p 8080:80 \
  -e VUE_APP_SUPABASE_URL=your_url \
  -e VUE_APP_SUPABASE_ANON_KEY=your_key \
  mycodit-vue
```

### 2. Docker Compose 사용

```bash
# 실행
docker-compose up -d

# 중지
docker-compose down
```

## 🔧 환경별 설정

### 개발 환경
```bash
NODE_ENV=development
VUE_APP_DEBUG_MODE=true
```

### 스테이징 환경
```bash
NODE_ENV=staging
VUE_APP_DEBUG_MODE=false
```

### 프로덕션 환경
```bash
NODE_ENV=production
VUE_APP_DEBUG_MODE=false
```

## 📊 배포 후 확인사항

### 1. 기능 테스트
- [ ] 홈페이지 로딩 확인
- [ ] 로그인/회원가입 동작
- [ ] 프로젝트 CRUD 기능
- [ ] 이미지 업로드
- [ ] 반응형 디자인

### 2. 성능 확인
- [ ] Lighthouse 점수 측정
- [ ] 로딩 속도 테스트
- [ ] PWA 기능 동작

### 3. SEO 확인
- [ ] 메타 태그 확인
- [ ] Open Graph 태그
- [ ] 사이트맵 생성

## 🔒 보안 체크리스트

- [ ] HTTPS 활성화
- [ ] 환경 변수 보안
- [ ] CSP 헤더 설정
- [ ] Rate Limiting 설정

## 🐛 문제 해결

### Build 실패
```bash
# 캐시 삭제 후 재빌드
rm -rf node_modules
npm install
npm run build
```

### 환경 변수 인식 안됨
- Vite는 `VITE_` 접두사 사용
- 배포 플랫폼에서 재배포 트리거

### 404 에러 (SPA 라우팅)
- Netlify: `netlify.toml` 확인
- Vercel: `vercel.json` 추가
- Nginx: 설정 파일 수정

## 📱 PWA 배포 확인

1. Chrome DevTools → Application 탭
2. Service Worker 등록 확인
3. Manifest 확인
4. 오프라인 동작 테스트

## 🎯 성능 최적화

### CDN 설정
- Cloudflare 연동
- 정적 자산 캐싱
- 이미지 최적화

### 모니터링
- Google Analytics 설정
- Sentry 에러 트래킹
- 성능 모니터링

## 📚 추가 자료

- [Netlify 문서](https://docs.netlify.com)
- [Vercel 문서](https://vercel.com/docs)
- [Railway 문서](https://docs.railway.app)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

## 💡 팁

1. **스테이징 환경 활용**: 프로덕션 배포 전 테스트
2. **자동 배포 설정**: GitHub Actions 활용
3. **롤백 계획**: 이전 버전으로 즉시 복구 가능하도록 준비
4. **모니터링**: 배포 후 24시간 집중 모니터링

---

배포 관련 문의사항이 있으시면 [이슈](https://github.com/your-repo/issues)를 생성해주세요.