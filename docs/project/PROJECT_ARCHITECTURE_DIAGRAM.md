# 🏗️ My Codit Manager - 시스템 아키텍처 다이어그램

> 📅 **작성일**: 2025년 7월 14일  
> 🎯 **목적**: 프로젝트 전체 구조와 데이터 흐름 시각화  
> 📊 **현재 상태**: 75% 완성 (인증 시스템 완료, 데이터 관리 부분 API 연동 필요)

---

## 🌐 **전체 시스템 아키텍처**

```mermaid
graph TB
    subgraph "Frontend (Vue.js SPA)"
        A[사용자 브라우저] --> B[Vue 3 Application]
        B --> C[Vue Router]
        B --> D[Vuex Store]
        B --> E[Vue Components]
    end
    
    subgraph "Service Layer"
        F[Auth Service] --> G[Supabase Auth API]
        H[Project Service] --> I[Supabase Database API]
        J[Image Service] --> K[Supabase Storage API]
    end
    
    subgraph "Backend (Supabase)"
        L[Authentication]
        M[PostgreSQL Database]
        N[File Storage]
        O[Realtime Subscriptions]
        P[Row Level Security]
    end
    
    E --> F
    E --> H
    E --> J
    G --> L
    I --> M
    K --> N
    L --> P
    M --> P
    O --> B
```

---

## 📱 **프론트엔드 아키텍처**

### 🔧 **Vue.js 컴포넌트 구조**

```mermaid
graph TD
    A[App.vue<br/>루트 컴포넌트] --> B[NavBar<br/>네비게이션]
    A --> C[router-view<br/>페이지 컨테이너]
    
    C --> D[인증 페이지들]
    C --> E[보호된 페이지들]
    
    D --> D1[Login.vue]
    D --> D2[Signup.vue]
    D --> D3[ForgotPassword.vue]
    D --> D4[ResetPassword.vue]
    D --> D5[AuthCallback.vue]
    
    E --> E1[Dashboard.vue]
    E --> E2[Profile.vue]
    E --> E3[CreatePost.vue]
    E --> E4[PostList.vue]
    E --> E5[Projects.vue]
    E --> E6[TwoFactorAuth.vue]
    
    D2 --> F[SignupModal.vue<br/>공통 컴포넌트]
    E2 --> G[SecuritySettings.vue<br/>보안 설정]
    
    style A fill:#ff6b6b
    style D fill:#4ecdc4
    style E fill:#45b7d1
    style F fill:#96ceb4
    style G fill:#96ceb4
```

### 📊 **상태 관리 패턴**

```mermaid
graph LR
    A[User Actions] --> B[Vue Components]
    B --> C[Service Layer]
    C --> D[Supabase API]
    D --> E[State Update]
    E --> B
    
    F[localStorage] --> G[Session Management]
    G --> B
    
    style A fill:#ff9999
    style B fill:#99ccff
    style C fill:#99ff99
    style D fill:#ffcc99
    style E fill:#cc99ff
```

---

## 🗄️ **데이터베이스 아키텍처**

### 📋 **테이블 관계도**

```mermaid
erDiagram
    AUTH_USERS {
        uuid id PK
        varchar email
        varchar encrypted_password
        jsonb user_metadata
        jsonb app_metadata
        timestamp created_at
        timestamp updated_at
    }
    
    USERS {
        serial id PK
        varchar email UK
        varchar name
        varchar nickname UK
        uuid auth_user_id FK
        varchar profile_image_url
        varchar one_liner
        text bio
        varchar github_url
        varchar linkedin_url
        varchar personal_blog_url
        timestamp created_at
        timestamp updated_at
    }
    
    PROJECTS {
        serial id PK
        integer user_id FK
        varchar title
        text description
        jsonb tech_stack
        varchar github_url
        varchar demo_url
        jsonb image_urls
        varchar category
        varchar status
        date start_date
        date end_date
        boolean is_featured
        integer view_count
        timestamp created_at
        timestamp updated_at
    }
    
    SKILLS {
        serial id PK
        integer user_id FK
        varchar skill_name
        integer proficiency_level
        varchar category
        timestamp created_at
    }
    
    EXPERIENCES {
        serial id PK
        integer user_id FK
        varchar company
        varchar position
        date start_date
        date end_date
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    AUTH_USERS ||--o| USERS : "1:1 관계"
    USERS ||--o{ PROJECTS : "1:N 관계"
    USERS ||--o{ SKILLS : "1:N 관계"
    USERS ||--o{ EXPERIENCES : "1:N 관계"
```

### 🔒 **Row Level Security (RLS) 정책**

```mermaid
graph TD
    A[사용자 요청] --> B{인증 확인}
    B -->|인증됨| C[RLS 정책 적용]
    B -->|미인증| D[접근 거부]
    
    C --> E{소유권 확인}
    E -->|본인 데이터| F[접근 허용]
    E -->|타인 데이터| G[접근 거부]
    
    F --> H[CRUD 작업 수행]
    
    style A fill:#e1f5fe
    style C fill:#c8e6c9
    style F fill:#a5d6a7
    style H fill:#81c784
    style D fill:#ffcdd2
    style G fill:#ffcdd2
```

---

## 🔐 **인증 시스템 아키텍처**

### 🚪 **인증 플로우**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase Auth
    participant D as Database
    
    Note over U,D: 회원가입 플로우
    U->>F: 회원가입 정보 입력
    F->>D: users 테이블에 임시 삽입 (중복 확인)
    D-->>F: 중복 확인 결과
    F->>S: auth.signUp() 호출
    S-->>F: 인증 계정 생성
    F->>D: users.auth_user_id 업데이트
    F->>S: 자동 로그아웃 실행
    F-->>U: 회원가입 완료 → 로그인 페이지
    
    Note over U,D: 로그인 플로우
    U->>F: 로그인 정보 입력
    F->>S: signInWithPassword() 호출
    S-->>F: JWT 토큰 + 사용자 정보
    F->>D: users 테이블에서 추가 정보 조회
    D-->>F: 완전한 사용자 프로필
    F-->>U: 대시보드로 리디렉트
```

### 🔑 **소셜 로그인 플로우**

```mermaid
graph LR
    A[사용자] --> B[소셜 로그인 버튼 클릭]
    B --> C[Supabase OAuth 리디렉트]
    C --> D[GitHub/Google 인증]
    D --> E[AuthCallback.vue]
    E --> F[사용자 정보 마이그레이션]
    F --> G[Dashboard 이동]
    
    style A fill:#ff6b6b
    style D fill:#4ecdc4
    style G fill:#45b7d1
```

---

## 📂 **파일 시스템 아키텍처**

### 📁 **프로젝트 디렉토리 구조**

```
📦 developer-showcase-frontend/
├── 📁 public/                     # 정적 파일
│   ├── 🌐 index.html              # SPA 진입점
│   └── 🖼️ favicon.ico             # 파비콘
├── 📁 src/                        # 소스 코드
│   ├── 📁 assets/                 # 정적 리소스
│   │   ├── 🖼️ github.png
│   │   ├── 🖼️ google.png
│   │   └── 🖼️ logo.png
│   ├── 📁 components/             # 재사용 컴포넌트
│   │   ├── ✅ SignupModal.vue
│   │   ├── ✅ SecuritySettings.vue
│   │   └── ❌ NavBar.vue (미사용)
│   ├── 📁 views/                  # 페이지 컴포넌트
│   │   ├── ✅ Login.vue           # 로그인 (완성)
│   │   ├── ✅ Signup.vue          # 회원가입 (완성)
│   │   ├── ✅ ForgotPassword.vue  # 비밀번호 찾기 (완성)
│   │   ├── ✅ ResetPassword.vue   # 비밀번호 재설정 (완성)
│   │   ├── ✅ AuthCallback.vue    # OAuth 콜백 (완성)
│   │   ├── 🔄 Dashboard.vue       # 대시보드 (API 연동 필요)
│   │   ├── 🔄 Profile.vue         # 프로필 (API 연동 필요)
│   │   ├── 🔄 CreatePost.vue      # 프로젝트 추가 (API 연동 필요)
│   │   ├── 🔄 PostList.vue        # 프로젝트 목록 (API 연동 필요)
│   │   ├── 🔄 TwoFactorAuth.vue   # 2FA (로직 구현 필요)
│   │   └── 📋 Projects.vue        # Coming Soon
│   ├── 📁 config/                 # 설정 파일
│   │   ├── ✅ supabase.js         # Supabase 설정
│   │   ├── ✅ environment.js      # 환경변수
│   │   └── ✅ auth.js             # 인증 설정
│   ├── 📁 services/               # API 서비스
│   │   ├── ✅ authService.js      # 인증 API (완성)
│   │   ├── 🔄 projectService.js   # 프로젝트 API (구현 필요)
│   │   └── 🔄 imageService.js     # 이미지 API (구현 필요)
│   ├── 📁 router/                 # 라우팅
│   │   └── ✅ index.js            # 라우트 설정 (완성)
│   ├── 📁 store/                  # 상태 관리 (향후 확장)
│   │   └── ✅ index.js            # Vuex 스토어
│   ├── ✅ App.vue                 # 루트 컴포넌트
│   └── ✅ main.js                 # 앱 진입점
├── 📄 package.json                # 의존성 관리
├── 📄 vue.config.js               # Vue CLI 설정
├── 📄 Dockerfile                  # Docker 배포
└── 📁 docs/                       # 프로젝트 문서
    ├── 📄 PROJECT_OVERVIEW.md
    ├── 📄 PROJECT_ARCHITECTURE.md
    ├── 📄 CURRENT_PROJECT_STATUS.md
    ├── 📄 TESTING_GUIDE.md
    ├── 📄 DEVELOPMENT_ROADMAP.md
    └── 📄 PROJECT_ARCHITECTURE_DIAGRAM.md (이 문서)
```

---

## 🌊 **데이터 플로우 아키텍처**

### 📊 **전체 데이터 흐름**

```mermaid
graph TD
    A[사용자 인터랙션] --> B[Vue Component]
    B --> C{로컬 상태?}
    C -->|Yes| D[Component State]
    C -->|No| E[Service Layer]
    
    E --> F[API 호출]
    F --> G[Supabase Backend]
    G --> H[Database/Storage/Auth]
    
    H --> I[응답 데이터]
    I --> J[Service Layer 처리]
    J --> K[Component 상태 업데이트]
    K --> L[UI 리렌더링]
    
    M[Error Handling] --> N[사용자 피드백]
    F --> M
    
    style A fill:#ff9999
    style B fill:#99ccff
    style E fill:#99ff99
    style G fill:#ffcc99
    style L fill:#cc99ff
    style M fill:#ffcccc
```

### 🔄 **실시간 데이터 동기화**

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Service
    participant SB as Supabase
    participant DB as Database
    
    C->>S: 데이터 요청
    S->>SB: API 호출
    SB->>DB: 쿼리 실행
    DB-->>SB: 결과 반환
    SB-->>S: 응답 데이터
    S-->>C: 가공된 데이터
    
    Note over SB,DB: 실시간 구독 (향후 구현)
    DB->>SB: 데이터 변경 감지
    SB->>C: 실시간 업데이트
    C->>C: 상태 자동 갱신
```

---

## 🔗 **API 아키텍처**

### 🛠️ **서비스 계층 구조**

```mermaid
graph TD
    A[Vue Components] --> B[Service Layer]
    
    B --> C[authService.js]
    B --> D[projectService.js]
    B --> E[imageService.js]
    B --> F[profileService.js]
    
    C --> G[Supabase Auth API]
    D --> H[Supabase Database API]
    E --> I[Supabase Storage API]
    F --> H
    
    G --> J[사용자 인증/권한]
    H --> K[데이터 CRUD]
    I --> L[파일 업로드/다운로드]
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#45b7d1
    style E fill:#45b7d1
    style F fill:#45b7d1
```

### 📡 **API 엔드포인트 매핑**

```mermaid
graph LR
    subgraph "Frontend API Calls"
        A[authService]
        B[projectService]
        C[imageService]
    end
    
    subgraph "Supabase APIs"
        D[Auth API]
        E[Database API]
        F[Storage API]
    end
    
    subgraph "Data Operations"
        G[사용자 인증]
        H[프로젝트 CRUD]
        I[이미지 업로드]
    end
    
    A --> D --> G
    B --> E --> H
    C --> F --> I
```

---

## 🚀 **배포 아키텍처**

### 🐳 **Docker 컨테이너 구조**

```mermaid
graph TD
    A[Source Code] --> B[Docker Build]
    B --> C[Multi-stage Build]
    
    C --> D[Build Stage]
    C --> E[Runtime Stage]
    
    D --> F[Node.js 18<br/>npm ci<br/>npm run build]
    E --> G[Node.js Alpine<br/>serve package<br/>dist 폴더]
    
    F --> H[dist/ 빌드 결과]
    H --> E
    
    G --> I[Railway 배포]
    I --> J[Production URL]
    
    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style G fill:#e8f5e8
    style J fill:#fff3e0
```

### 🌐 **배포 환경 구성**

```mermaid
graph TD
    A[개발자 로컬] --> B[Git Push]
    B --> C[GitHub Repository]
    C --> D[Railway Auto Deploy]
    D --> E[Docker Build]
    E --> F[Container Registry]
    F --> G[Production Deployment]
    
    H[Environment Variables] --> D
    I[Supabase Config] --> D
    
    G --> J[Live Application]
    J --> K[Supabase Backend]
    
    style A fill:#e1f5fe
    style G fill:#c8e6c9
    style J fill:#a5d6a7
    style K fill:#81c784
```

---

## 🔒 **보안 아키텍처**

### 🛡️ **보안 계층 구조**

```mermaid
graph TD
    A[Client Request] --> B[HTTPS/SSL]
    B --> C[Vue.js App]
    C --> D[Authentication Check]
    D --> E{Authenticated?}
    
    E -->|Yes| F[JWT Token]
    E -->|No| G[Redirect to Login]
    
    F --> H[Supabase API]
    H --> I[Row Level Security]
    I --> J{Owner Check}
    
    J -->|Authorized| K[Database Access]
    J -->|Unauthorized| L[Access Denied]
    
    K --> M[Data Response]
    M --> N[Encrypted Response]
    N --> C
    
    style A fill:#ffebee
    style D fill:#e3f2fd
    style F fill:#e8f5e8
    style I fill:#fff3e0
    style K fill:#f3e5f5
```

### 🔐 **인증 토큰 흐름**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase
    participant D as Database
    
    U->>F: 로그인 요청
    F->>S: 인증 정보 전송
    S-->>F: JWT 토큰 발급
    F->>F: 토큰 저장 (localStorage)
    
    Note over F,D: API 요청 시
    F->>S: API 요청 + JWT 토큰
    S->>S: 토큰 검증
    S->>D: RLS 정책 적용
    D-->>S: 인가된 데이터만 반환
    S-->>F: 응답 데이터
```

---

## 📊 **성능 아키텍처**

### ⚡ **최적화 전략**

```mermaid
graph TD
    A[사용자 요청] --> B[Vue Router]
    B --> C{페이지 유형}
    
    C -->|정적 페이지| D[즉시 로드]
    C -->|동적 페이지| E[Lazy Loading]
    
    E --> F[컴포넌트 분할]
    F --> G[코드 스플리팅]
    
    H[이미지 최적화] --> I[Lazy Loading]
    J[API 캐싱] --> K[응답 속도 향상]
    
    L[Service Worker] --> M[오프라인 지원]
    
    style A fill:#e1f5fe
    style D fill:#c8e6c9
    style E fill:#fff3e0
    style G fill:#f3e5f5
```

### 📈 **로딩 성능 최적화**

```mermaid
graph LR
    A[Initial Load] --> B[Critical CSS]
    A --> C[Core JS Bundle]
    A --> D[Essential Components]
    
    E[Secondary Load] --> F[Route Components]
    E --> G[Non-critical CSS]
    E --> H[Additional Features]
    
    I[Lazy Load] --> J[Images]
    I --> K[Heavy Components]
    I --> L[Third-party Scripts]
    
    style A fill:#ffcdd2
    style E fill:#fff9c4
    style I fill:#c8e6c9
```

---

## 🎯 **현재 구현 상태 시각화**

### 📊 **기능별 완성도**

```mermaid
pie title 전체 기능 완성도 (75%)
    "완성된 기능" : 75
    "미완성 기능" : 25
```

### 🔄 **컴포넌트별 상태**

```mermaid
graph TD
    A[전체 컴포넌트] --> B[완성 ✅]
    A --> C[부분 완성 🔄]
    A --> D[미구현 ❌]
    
    B --> B1[Login.vue]
    B --> B2[Signup.vue]
    B --> B3[ForgotPassword.vue]
    B --> B4[ResetPassword.vue]
    B --> B5[AuthCallback.vue]
    B --> B6[App.vue]
    B --> B7[SignupModal.vue]
    B --> B8[SecuritySettings.vue]
    
    C --> C1[Dashboard.vue - UI완성, API연동필요]
    C --> C2[Profile.vue - UI완성, API연동필요]
    C --> C3[CreatePost.vue - UI완성, API연동필요]
    C --> C4[PostList.vue - UI완성, API연동필요]
    C --> C5[TwoFactorAuth.vue - UI완성, 로직필요]
    
    D --> D1[Projects.vue - Coming Soon]
    D --> D2[projectService.js - 미구현]
    D --> D3[imageService.js - 미구현]
    
    style B fill:#c8e6c9
    style C fill:#fff3e0
    style D fill:#ffcdd2
```

---

## 🚀 **향후 확장 아키텍처**

### 🔮 **예정된 기능 확장**

```mermaid
graph TD
    A[현재 시스템 75%] --> B[핵심 기능 완성 95%]
    B --> C[고급 기능 추가 98%]
    C --> D[완전한 시스템 100%]
    
    E[Phase 1: API 연동] --> F[프로젝트 CRUD]
    E --> G[이미지 업로드]
    E --> H[프로필 관리]
    
    I[Phase 2: 기능 강화] --> J[다크모드]
    I --> K[드래그앤드롭]
    I --> L[GitHub 연동]
    
    M[Phase 3: 고급 기능] --> N[협업 도구]
    M --> O[통계 분석]
    M --> P[AI 기능]
    
    style A fill:#ffcdd2
    style B fill:#fff3e0
    style C fill:#c8e6c9
    style D fill:#a5d6a7
```

---

## 📋 **아키텍처 체크리스트**

### ✅ **현재 완성된 아키텍처**
- [x] Vue.js SPA 기본 구조
- [x] 컴포넌트 기반 아키텍처
- [x] Vue Router 라우팅 시스템
- [x] Supabase 인증 시스템
- [x] Row Level Security 적용
- [x] 반응형 UI 아키텍처
- [x] 모바일 우선 디자인
- [x] Docker 기반 배포 구조

### 🔄 **구현 중인 아키텍처**
- [ ] 완전한 API 서비스 계층
- [ ] 이미지 업로드 아키텍처
- [ ] 실시간 데이터 동기화
- [ ] 성능 최적화 구조

### 🎯 **향후 구현 예정**
- [ ] 상태 관리 아키텍처 (Vuex 활용)
- [ ] 캐싱 전략 구현
- [ ] 오프라인 지원 아키텍처
- [ ] 마이크로서비스 확장 구조

---

*📅 최종 업데이트: 2025년 7월 14일*  
*🏗️ 아키텍처 버전: v1.0*  
*📊 현재 완성도: 75%*  
*🎯 목표: 완전한 포트폴리오 관리 시스템 아키텍처*