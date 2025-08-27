# 환경 변수 설정 가이드

## 🔧 필수 환경 변수

### Supabase 설정
프로젝트를 실행하기 위해 반드시 필요한 환경 변수입니다.

```bash
# Supabase 프로젝트 URL
VUE_APP_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (공개 키)
VUE_APP_SUPABASE_ANON_KEY=eyJhbGc...
```

#### Supabase 키 얻는 방법:
1. [Supabase](https://supabase.com) 대시보드 접속
2. 프로젝트 선택
3. Settings → API 메뉴 이동
4. Project URL과 anon public key 복사

## 📝 선택적 환경 변수

```bash
# API 요청 타임아웃 (밀리초, 기본값: 30000)
VUE_APP_API_TIMEOUT=30000

# 최대 파일 업로드 크기 (바이트, 기본값: 5MB)
VUE_APP_MAX_FILE_SIZE=5242880

# 허용된 이미지 타입
VUE_APP_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp

# 디버그 모드 (개발시 true)
VUE_APP_DEBUG_MODE=false
```

## 🚀 설정 방법

### 1. 로컬 개발 환경

1. `.env.example` 파일을 복사하여 `.env` 파일 생성:
```bash
cp .env.example .env
```

2. `.env` 파일을 열어 실제 값으로 변경:
```bash
VUE_APP_SUPABASE_URL=https://gjuwbcfuadlwvxrxbgui.supabase.co
VUE_APP_SUPABASE_ANON_KEY=your_actual_key_here
```

3. 개발 서버 재시작:
```bash
npm run dev
```

### 2. 프로덕션 배포

#### Netlify
1. Netlify 대시보드 → Site settings → Environment variables
2. 각 환경 변수를 Key-Value 형태로 추가
3. 재배포 트리거

#### Vercel
1. Project Settings → Environment Variables
2. 환경 변수 추가 (Production/Preview/Development 선택)
3. 재배포

#### Railway
1. Project → Variables 탭
2. Add Variable 클릭
3. 환경 변수 입력
4. 자동 재배포

## 🔒 보안 주의사항

### ⚠️ 절대 하지 말아야 할 것들:
- `.env` 파일을 Git에 커밋하지 마세요
- API 키를 코드에 하드코딩하지 마세요
- Service Key를 클라이언트에 노출하지 마세요

### ✅ 권장 사항:
- `.gitignore`에 `.env` 파일이 포함되어 있는지 확인
- 프로덕션과 개발 환경의 키를 분리
- 정기적으로 API 키 교체
- Row Level Security (RLS) 활성화

## 🧪 환경 변수 테스트

환경 변수가 제대로 설정되었는지 확인:

```javascript
// 브라우저 콘솔에서 실행
console.log(import.meta.env.VUE_APP_SUPABASE_URL)
// 출력: https://your-project.supabase.co

console.log(import.meta.env.VUE_APP_SUPABASE_ANON_KEY)
// 출력: eyJhbGc... (키의 일부)
```

## 📋 체크리스트

- [ ] `.env` 파일 생성
- [ ] Supabase URL 설정
- [ ] Supabase Anon Key 설정
- [ ] `.gitignore`에 `.env` 포함 확인
- [ ] 개발 서버에서 테스트
- [ ] 배포 플랫폼에 환경 변수 설정

## 🆘 문제 해결

### "Supabase client is not initialized" 에러
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 `VUE_APP_`으로 시작하는지 확인
- 서버를 재시작했는지 확인

### API 요청 실패
- Supabase 대시보드에서 프로젝트 상태 확인
- API 키가 올바른지 확인
- 네트워크 연결 확인

### 이미지 업로드 실패
- 파일 크기가 제한 내인지 확인
- 파일 타입이 허용된 형식인지 확인
- Supabase Storage 버킷 권한 확인

## 📚 참고 자료

- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase 문서](https://supabase.com/docs)
- [프로젝트 README](./README.md)