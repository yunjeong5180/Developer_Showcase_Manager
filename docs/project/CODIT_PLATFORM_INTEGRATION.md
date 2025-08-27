# Codit 플랫폼 통합 구조

## 🔗 3개 페이지 연결 구조

```
Welcome (포트 3000) → My Codit (포트 8080) → Portfolio (포트 3001)
     ↑                    ↓                         ↓
     └─────────── 순환 네비게이션 ──────────────────┘
```

## 📍 각 페이지별 역할 및 기술 스택

### 1. Welcome 페이지 (랜딩)
- **포트**: `localhost:3000`
- **기술**: Next.js
- **경로**: `/home/yun/Developer_Showcase_Manager/welcome-nextjs/`
- **역할**: 플랫폼 소개 및 사용자 유입

### 2. My Codit (관리자 대시보드)
- **포트**: `localhost:8080`
- **기술**: Vue.js
- **경로**: `/home/yun/Developer_Showcase_Manager/src/views/Dashboard.vue`
- **역할**: 포트폴리오 데이터 관리 (CRUD)

### 3. Portfolio (포트폴리오 전시)
- **포트**: `localhost:3001`
- **기술**: Next.js
- **경로**: `/home/yun/Developer_Showcase_Manager/portfolio-nextjs/`
- **역할**: 완성된 포트폴리오 공개 전시

## 🚀 서버 실행 방법

### Welcome 페이지 실행
```bash
cd welcome-nextjs
npm install
npm run dev  # localhost:3000
```

### My Codit 실행
```bash
cd /home/yun/Developer_Showcase_Manager
npm install
npm run serve  # localhost:8080
```

### Portfolio 페이지 실행
```bash
cd portfolio-nextjs
npm install
npm run dev  # localhost:3001
```

## 🔄 페이지 간 연결 링크

### Welcome → 다른 페이지
- **"My Codit 시작하기"**: `http://localhost:8080/dashboard`
- **"포트폴리오 둘러보기"**: `http://localhost:3001/portfolio/demo`

### Portfolio → 다른 페이지
- **"홈"**: `http://localhost:3000`
- **"My Codit"**: `http://localhost:8080/dashboard`

### My Codit → 다른 페이지
- **"포트폴리오 미리보기"**: `http://localhost:3001/portfolio/demo`

## 📊 데이터 흐름

```
Welcome → 사용자 유입
    ↓
My Codit → 데이터 입력/관리 (프로필, 프로젝트, 스킬)
    ↓
Portfolio → 데이터 출력/전시 (완성된 포트폴리오)
```

## 🎯 향후 개선 계획

1. **통합 인증 시스템**: 세 페이지 간 로그인 상태 공유
2. **실시간 데이터 동기화**: My Codit 변경사항이 Portfolio에 즉시 반영
3. **단일 도메인 배포**: 서브도메인으로 통합 (welcome.codit.com, admin.codit.com, portfolio.codit.com)
4. **공통 컴포넌트**: 헤더, 푸터 등 재사용 가능한 UI 컴포넌트 공유

## ✅ 현재 완료된 작업

- [x] Welcome 페이지 버튼 연결
- [x] Portfolio 페이지 네비게이션 헤더 추가
- [x] My Codit 대시보드에 포트폴리오 미리보기 링크 추가
- [x] 각 페이지 간 기본 네비게이션 구조 완성