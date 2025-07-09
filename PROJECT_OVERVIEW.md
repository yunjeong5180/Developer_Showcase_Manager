# Developer Showcase Manager - 프로젝트 개요

## 프로젝트 소개

Developer Showcase Manager는 개발자들이 자신의 포트폴리오를 효과적으로 관리할 수 있는 관리자 대시보드 애플리케이션입니다. Vue 3와 Supabase를 기반으로 구축되었으며, 프로젝트 관리, 프로필 설정, 포스트 작성 등의 기능을 제공합니다.

## 주요 특징

### 1. 인증 및 보안
- **Supabase 기반 인증**: 이메일/비밀번호 로그인
- **OAuth 소셜 로그인**: GitHub, Google 등 (AuthCallback 구현)
- **2단계 인증(2FA)**: 추가 보안 레이어
- **비밀번호 재설정**: 이메일을 통한 안전한 비밀번호 복구
- **세션 관리**: 자동 로그인 및 '상태 유지' 기능

### 2. 핵심 기능
- **대시보드**: 프로젝트 현황 및 통계 요약
- **프로젝트 관리**: 포트폴리오 프로젝트 CRUD 작업
- **포스트 작성/관리**: 기술 블로그 포스트 작성 및 관리
- **프로필 관리**: 개인 정보, 소셜 링크, 자기소개 관리
- **보안 설정**: 2FA 설정, 비밀번호 변경 등

### 3. 기술적 특징
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 대응
- **SPA 구조**: Vue Router를 활용한 단일 페이지 애플리케이션
- **실시간 상태 관리**: Supabase 실시간 리스너
- **모던 UI/UX**: 그라디언트 디자인, 부드러운 애니메이션

## 기술 스택

### Frontend
- **Vue 3.2.13**: Progressive JavaScript Framework
- **Vue Router 4**: SPA 라우팅
- **Vuex 4**: 상태 관리 (현재 미사용, 향후 확장 가능)
- **JavaScript ES6+**: 모던 자바스크립트
- **CSS3**: 커스텀 스타일링, Flexbox, Grid

### Backend & Infrastructure
- **Supabase**: Backend as a Service
  - PostgreSQL 데이터베이스
  - 인증 서비스
  - 실시간 구독
  - Row Level Security (RLS)
- **Node.js**: 개발 환경
- **npm**: 패키지 관리

### 개발 도구
- **Vue CLI Service**: 프로젝트 빌드 및 개발 서버
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Babel**: JavaScript 트랜스파일링
- **Sass**: CSS 전처리기

## 프로젝트 구조

```
developer-showcase-frontend/
├── public/              # 정적 파일
├── src/
│   ├── assets/         # 이미지, 폰트 등 리소스
│   ├── components/     # 재사용 가능한 Vue 컴포넌트
│   ├── config/         # 설정 파일 (Supabase, 환경변수 등)
│   ├── router/         # Vue Router 설정
│   ├── services/       # API 서비스 레이어
│   ├── store/          # Vuex 스토어 (향후 확장용)
│   ├── views/          # 페이지 컴포넌트
│   ├── App.vue         # 루트 컴포넌트
│   └── main.js         # 애플리케이션 진입점
├── .env files          # 환경변수 설정
├── package.json        # 프로젝트 의존성
└── vue.config.js       # Vue CLI 설정
```

## 주요 페이지 및 라우트

1. **인증 관련**
   - `/login` - 로그인
   - `/signup` - 회원가입
   - `/forgot-password` - 비밀번호 찾기
   - `/reset-password` - 비밀번호 재설정
   - `/two-factor-auth` - 2단계 인증

2. **메인 기능**
   - `/dashboard` - 메인 대시보드
   - `/projects` - 프로젝트 관리
   - `/create-post` - 새 포스트 작성
   - `/post-list` - 포스트 목록
   - `/profile` - 프로필 관리

## 보안 및 인증 흐름

1. **로그인 프로세스**
   - 이메일/비밀번호 입력
   - Supabase 인증 검증
   - 세션 토큰 발급 및 저장
   - 대시보드로 리다이렉트

2. **세션 관리**
   - 자동 세션 체크 (App.vue)
   - '상태 유지' 옵션
   - 인증 가드를 통한 라우트 보호

3. **비밀번호 재설정**
   - 이메일로 재설정 링크 발송
   - 토큰 검증
   - 새 비밀번호 설정

## 배포 및 환경 설정

### 환경 변수
- `.env.production` - 프로덕션 환경
- `.env.staging` - 스테이징 환경
- 주요 변수: `VUE_APP_SUPABASE_URL`, `VUE_APP_SUPABASE_ANON_KEY`

### 빌드 및 배포
- **개발**: `npm run serve`
- **빌드**: `npm run build`
- **Railway 배포**: Docker 기반 배포 (Dockerfile 포함)
- **정적 서빙**: `serve` 패키지 사용

## 현재 브랜치 상태
- **현재 브랜치**: `feature/add-nickname-and-validation`
- **메인 브랜치**: `main`
- 닉네임 기능 및 유효성 검증 추가 작업 진행 중

## 향후 개발 계획
1. Vuex를 활용한 전역 상태 관리 구현
2. 프로젝트 이미지 업로드 기능
3. 실시간 알림 시스템
4. 다크 모드 지원
5. 다국어 지원 (i18n)
6. 성능 최적화 및 코드 스플리팅