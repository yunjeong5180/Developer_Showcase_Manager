# 🚀 Developer Showcase Manager

> **개발자를 위한 포트폴리오 관리 시스템**  
> Vue 3 + Supabase 기반의 현대적이고 직관적인 관리자 대시보드

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📋 **프로젝트 소개**

**Developer Showcase Manager**는 개발자들이 자신의 포트폴리오를 체계적으로 관리할 수 있는 관리자 대시보드 애플리케이션입니다. 

Vue 3와 Supabase를 기반으로 구축되어 프로젝트 관리, 프로필 설정, 인증 시스템 등 포트폴리오 운영에 필요한 모든 기능을 제공합니다.

### 🎯 **핵심 가치**
- **효율성**: 직관적인 UI로 빠른 포트폴리오 관리
- **보안성**: 강화된 인증 시스템과 2단계 인증 지원
- **확장성**: 모듈화된 구조로 기능 확장 용이
- **접근성**: 모든 디바이스에서 완벽한 반응형 지원

---

## ✨ **주요 기능**

### 🔐 **완벽한 인증 시스템**
- **이메일/비밀번호 로그인** + Remember Me 기능
- **소셜 로그인**: GitHub, Google OAuth 지원
- **2단계 인증(2FA)**: TOTP 기반 추가 보안
- **비밀번호 관리**: 찾기/재설정/변경 기능
- **세션 관리**: 자동 로그인 및 보안 로그아웃

### 📊 **스마트 대시보드**
- **실시간 통계**: 프로젝트 수, 조회수, 업데이트 현황
- **빠른 작업**: 원클릭 프로젝트 추가/관리
- **최근 활동**: 실시간 활동 로그 표시
- **반응형 레이아웃**: 모든 화면 크기 최적화

### 💼 **프로젝트 관리**
- **CRUD 작업**: 프로젝트 생성, 수정, 삭제
- **이미지 업로드**: 드래그 앤 드롭 지원
- **기술 스택 관리**: 태그 기반 기술 스택 분류
- **GitHub/Demo 링크**: 프로젝트 링크 관리

### 👤 **프로필 관리**
- **개인 정보**: 이름, 타이틀, 자기소개 관리
- **소셜 링크**: GitHub, LinkedIn, 블로그 등
- **프로필 이미지**: Supabase Storage 연동
- **기술 스택**: 보유 기술 및 숙련도 관리

### 🔒 **고급 보안 기능**
- **Row Level Security**: 사용자별 데이터 격리
- **입력 검증**: 실시간 데이터 유효성 검사
- **CSRF 보호**: 크로스 사이트 요청 위조 방지
- **암호화**: 민감 정보 안전한 저장

---

## 🛠️ **기술 스택**

### **Frontend**
- **Vue 3.2.13**: 최신 Composition API 활용
- **Vue Router 4**: SPA 라우팅 및 인증 가드
- **JavaScript ES6+**: 모던 자바스크립트 문법
- **CSS3**: Grid, Flexbox, 애니메이션
- **Sass**: CSS 전처리기

### **Backend & Infrastructure**
- **Supabase**: Backend as a Service
  - PostgreSQL 데이터베이스
  - 실시간 구독 및 인증
  - 파일 스토리지
  - Row Level Security
- **Docker**: 컨테이너 기반 배포
- **Railway**: 클라우드 배포 플랫폼

### **개발 도구**
- **Vue CLI**: 프로젝트 빌드 및 개발 서버
- **ESLint + Prettier**: 코드 품질 관리
- **Babel**: 자바스크립트 트랜스파일링
- **Git/GitHub**: 버전 관리

---

## 🚀 **빠른 시작**

### **필수 조건**
- Node.js 18.0 이상
- npm 또는 yarn
- Git

### **설치 및 실행**

1. **저장소 클론**
   ```bash
   git clone https://github.com/yunjeong5180/Developer_Showcase_Manager.git
   cd Developer_Showcase_Manager
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   VUE_APP_SUPABASE_URL=your_supabase_url
   VUE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run serve
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:8080
   ```

### **기타 명령어**
```bash
# 프로덕션 빌드
npm run build

# 린팅 검사
npm run lint

# 린팅 자동 수정
npm run lint -- --fix

# Docker 빌드
docker build -t developer-showcase .

# Docker 실행
docker run -p 8080:8080 developer-showcase
```

---

## 📁 **프로젝트 구조**

```
developer-showcase-manager/
├── 📁 public/              # 정적 파일
├── 📁 src/
│   ├── 📁 assets/          # 이미지, 폰트 등 리소스
│   ├── 📁 components/      # 재사용 가능한 Vue 컴포넌트
│   │   ├── SignupModal.vue     # 회원가입 모달
│   │   ├── SecuritySettings.vue # 보안 설정
│   │   └── SkillsModal.vue     # 기술 스택 모달
│   ├── 📁 config/          # 설정 파일
│   │   ├── supabase.js         # Supabase 클라이언트
│   │   ├── environment.js      # 환경 변수
│   │   └── auth.js             # 인증 설정
│   ├── 📁 views/           # 페이지 컴포넌트
│   │   ├── 🔐 Login.vue         # 로그인
│   │   ├── 🔐 Signup.vue        # 회원가입
│   │   ├── 🔐 ForgotPassword.vue # 비밀번호 찾기
│   │   ├── 🔐 ResetPassword.vue  # 비밀번호 재설정
│   │   ├── 🔐 TwoFactorAuth.vue  # 2단계 인증
│   │   ├── 📊 Dashboard.vue      # 메인 대시보드
│   │   ├── 👤 Profile.vue       # 프로필 관리
│   │   ├── 📝 CreatePost.vue     # 프로젝트 추가
│   │   └── 📋 PostList.vue      # 프로젝트 목록
│   ├── 📁 router/          # Vue Router 설정
│   ├── 📁 services/        # API 서비스 레이어
│   ├── 📁 store/           # Vuex 스토어 (향후 확장)
│   ├── App.vue             # 루트 컴포넌트
│   └── main.js             # 애플리케이션 진입점
├── 📄 package.json         # 프로젝트 의존성
├── 📄 vue.config.js        # Vue CLI 설정
├── 📄 Dockerfile           # Docker 설정
└── 📁 docs/               # 프로젝트 문서
    ├── PROJECT_STATUS_CHECKLIST.md
    └── PROJECT_OVERVIEW.md
```

---

## 🌐 **시스템 아키텍처**

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   사용자 포트폴리오    │    │    관리자 대시보드     │    │    백엔드 API      │
│  (공개 페이지)        │    │   (이 프로젝트)      │    │   (Supabase)      │
├─────────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│ www.domain.com      │◄──►│ admin.domain.com    │◄──►│ Supabase            │
│                     │    │                     │    │ PostgreSQL          │
│ • 포트폴리오 조회      │    │ • 프로젝트 관리       │    │ Authentication      │
│ • 프로젝트 목록       │    │ • 프로필 설정        │    │ Storage             │
│ • 연락처 정보        │    │ • 통계 대시보드       │    │ Real-time           │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

---

## 📊 **현재 개발 현황**

### ✅ **완료된 기능 (90%)**

#### 🔐 **인증 시스템** (85%)
- [x] 이메일/비밀번호 로그인
- [x] 소셜 로그인 (GitHub, Google)
- [x] 회원가입 및 실시간 검증
- [x] 비밀번호 찾기/재설정
- [x] 세션 관리 및 자동 로그인
- [x] 2FA UI (TOTP 백엔드 로직 구현 필요)

#### 💼 **프로젝트 관리** (95%)
- [x] 프로젝트 CRUD API (생성, 수정, 삭제, 조회)
- [x] 이미지 업로드 서비스 (리사이징, 메타데이터 추출 포함)
- [x] 프로젝트 목록 조회 (필터링, 정렬, 페이지네이션)
- [x] 프로젝트 상세 조회 (조회수 증가 기능)
- [x] 권한 기반 접근 제어

#### 📊 **대시보드 & 통계** (90%)
- [x] 실시간 통계 데이터 표시
- [x] 월별 통계 및 분석
- [x] 기술 스택 통계
- [x] 프로젝트 성과 분석
- [x] 차트 및 그래프 시각화

#### 👤 **프로필 관리** (100%)
- [x] 개인 정보 수정
- [x] 프로필 이미지 업로드
- [x] 기술 스택 관리 (모달 포함)
- [x] URL 검증 및 실시간 미리보기
- [x] 소셜 링크 관리

#### 🎨 **사용자 인터페이스** (85%)
- [x] 반응형 디자인 (모든 화면)
- [x] 모던 그라디언트 UI
- [x] 모바일 최적화
- [x] 인터랙티브 애니메이션
- [x] 접근성 고려 설계
- [x] 로딩 스피너 및 토스트 메시지

#### 🔒 **보안 기능** (80%)
- [x] Row Level Security 정책
- [x] 입력 데이터 검증
- [x] 사용자 권한 확인
- [x] CSRF 보호 (부분 구현)

#### 🔧 **기능 확장** (70%)
- [x] 검색 및 필터링 (프로젝트 목록)
- [x] 알림 시스템 (토스트 메시지)
- [x] 이메일/닉네임 실시간 중복 확인
- [x] 배치 이미지 업로드

### 🚧 **진행 중인 기능 (10%)**

#### 🔧 **개선 예정**
- [ ] 다크 모드 지원
- [ ] 무한 스크롤
- [ ] 실시간 WebSocket 연결
- [ ] 프로젝트 관리 페이지 완성
- [ ] 2FA TOTP 백엔드 로직 완성

---

## 🎯 **로드맵**

### **Phase 1: 핵심 기능 완성** ✅ (완료)
- [x] 프로젝트 테이블 및 API 구현
- [x] 이미지 업로드 서비스 연동
- [x] 대시보드 실시간 데이터 바인딩
- [x] 사용자 인증 시스템 구현
- [x] 프로필 관리 기능 완성

### **Phase 2: 사용자 경험 개선** 🚧 (진행 중)
- [x] 검색 및 필터링 기능
- [x] 실시간 알림 시스템 (토스트 메시지)
- [ ] 성능 최적화 및 캐싱
- [ ] 무한 스크롤 구현
- [ ] 실시간 WebSocket 연결

### **Phase 3: 고급 기능** 📋 (예정)
- [ ] 다크 모드 지원
- [ ] 다국어 지원 (i18n)
- [ ] 관리자 도구 및 분석
- [ ] PWA (Progressive Web App) 지원
- [ ] 고급 통계 및 분석 대시보드

---

## 🚀 **배포**

### **개발 환경**
```bash
npm run serve
```

### **프로덕션 빌드**
```bash
npm run build
npm run start
```

### **Docker 배포**
```bash
docker build -t developer-showcase .
docker run -p 8080:8080 developer-showcase
```

### **Railway 배포**
- 자동 배포 설정 완료
- Docker 기반 배포
- 환경 변수 자동 설정

---

## 🤝 **기여하기**

1. 프로젝트 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

---

## 📄 **라이선스**

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 👩‍💻 **개발자 정보**

**양윤정 (Yun Jeong Yang)**
- 🌐 GitHub: [@yunjeong5180](https://github.com/yunjeong5180)
- 📧 Email: yunjeong5180@gmail.com
- 🎯 목표: 개발자들을 위한 최고의 포트폴리오 관리 도구 만들기

---

## 📚 **관련 문서**

- [📊 프로젝트 진행 상황 체크리스트](./PROJECT_STATUS_CHECKLIST.md)
- [🏗️ 프로젝트 아키텍처](./PROJECT_OVERVIEW.md)
- [🔧 개발 가이드](./DEVELOPMENT_GUIDE.md)

---

<div align="center">

### ⭐ **포트폴리오 관리를 위한 든든한 도구가 되길 바랍니다!**

**Star ⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**

</div>