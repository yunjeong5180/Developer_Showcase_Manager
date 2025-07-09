# Developer Showcase Manager - 프로젝트 구성 설계

## 1. 아키텍처 개요

### 1.1 시스템 아키텍처
```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 브라우저                          │
├─────────────────────────────────────────────────────────────┤
│                     Vue 3 SPA Application                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Vue Router │  │     Vuex     │  │   Components     │   │
│  │  (라우팅)    │  │  (상태관리)   │  │   (UI 렌더링)    │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                           │
│  ┌─────────────────────┐  ┌────────────────────────────┐   │
│  │   Auth Service      │  │    API Services         │   │
│  │   (인증 처리)        │  │    (데이터 CRUD)        │   │
│  └─────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                         Supabase                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │    Auth      │  │   Database   │  │   Realtime      │   │
│  │  (인증)      │  │  (PostgreSQL)│  │   (실시간)      │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 데이터 플로우
```
사용자 액션 → Vue Component → Service Layer → Supabase API
     ↑                                            │
     └────────────── State Update ◄───────────────┘
```

## 2. 디렉토리 구조 상세

### 2.1 프로젝트 루트 구조
```
developer-showcase-frontend/
├── public/                  # 정적 자산
│   └── index.html          # SPA 진입점
├── src/                    # 소스 코드
├── .env.production         # 프로덕션 환경변수
├── .env.staging            # 스테이징 환경변수
├── .eslintrc.js           # ESLint 설정
├── babel.config.js        # Babel 설정
├── Dockerfile             # Docker 배포 설정
├── package.json           # 프로젝트 의존성
└── vue.config.js          # Vue CLI 설정
```

### 2.2 소스 코드 구조 (/src)
```
src/
├── assets/                 # 정적 리소스
│   ├── images/            # 이미지 파일
│   ├── fonts/             # 폰트 파일
│   └── styles/            # 글로벌 스타일
├── components/            # 재사용 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   │   ├── NavBar.vue
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorMessage.vue
│   ├── auth/             # 인증 관련 컴포넌트
│   │   ├── LoginForm.vue
│   │   └── SignupModal.vue
│   └── security/         # 보안 설정 컴포넌트
│       └── SecuritySettings.vue
├── config/               # 설정 파일
│   ├── supabase.js      # Supabase 클라이언트 설정
│   ├── environment.js   # 환경변수 관리
│   └── auth.js          # 인증 설정
├── router/              # 라우팅 설정
│   └── index.js         # 라우트 정의 및 가드
├── services/            # API 서비스 레이어
│   ├── authService.js   # 인증 관련 API
│   ├── projectService.js # 프로젝트 CRUD
│   └── postService.js   # 포스트 CRUD
├── store/               # Vuex 상태 관리
│   ├── index.js         # 스토어 설정
│   ├── modules/         # 스토어 모듈
│   │   ├── auth.js      # 인증 상태
│   │   ├── projects.js  # 프로젝트 상태
│   │   └── posts.js     # 포스트 상태
│   └── types.js         # 액션/뮤테이션 타입
├── utils/               # 유틸리티 함수
│   ├── validators.js    # 입력 검증
│   ├── formatters.js    # 데이터 포맷팅
│   └── constants.js     # 상수 정의
├── views/               # 페이지 컴포넌트
│   ├── auth/           # 인증 페이지
│   │   ├── Login.vue
│   │   ├── Signup.vue
│   │   ├── ForgotPassword.vue
│   │   └── ResetPassword.vue
│   ├── dashboard/      # 대시보드
│   │   └── Dashboard.vue
│   ├── projects/       # 프로젝트 관리
│   │   ├── Projects.vue
│   │   └── ProjectDetail.vue
│   ├── posts/          # 포스트 관리
│   │   ├── CreatePost.vue
│   │   └── PostList.vue
│   └── profile/        # 프로필 관리
│       └── Profile.vue
├── App.vue             # 루트 컴포넌트
└── main.js             # 애플리케이션 진입점
```

## 3. 컴포넌트 아키텍처

### 3.1 컴포넌트 계층 구조
```
App.vue
├── NavBar.vue (조건부 렌더링)
└── router-view
    ├── 인증 페이지 (로그인 불필요)
    │   ├── Login.vue
    │   ├── Signup.vue
    │   └── ForgotPassword.vue
    └── 보호된 페이지 (로그인 필요)
        ├── Dashboard.vue
        ├── Projects.vue
        ├── CreatePost.vue
        ├── PostList.vue
        └── Profile.vue
```

### 3.2 컴포넌트 통신 패턴
- **Props & Events**: 부모-자식 컴포넌트 간 통신
- **Vuex Store**: 전역 상태 관리 (향후 구현)
- **Event Bus**: 형제 컴포넌트 간 통신 (필요시)
- **Provide/Inject**: 깊은 계층 구조에서의 데이터 전달

## 4. 라우팅 구조

### 4.1 라우트 정의
```javascript
routes = [
  // 공개 라우트
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/auth/callback', component: AuthCallback },
  
  // 보호된 라우트 (인증 필요)
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/projects', component: Projects, meta: { requiresAuth: true } },
  { path: '/create-post', component: CreatePost, meta: { requiresAuth: true } },
  { path: '/post-list', component: PostList, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } }
]
```

### 4.2 네비게이션 가드
- **전역 가드**: 인증 상태 확인
- **라우트별 가드**: 특정 페이지 접근 제어
- **컴포넌트 가드**: 페이지 이탈 시 확인

## 5. 상태 관리 설계

### 5.1 현재 상태
- 컴포넌트 로컬 상태 사용
- localStorage를 통한 간단한 상태 저장

### 5.2 향후 Vuex 구조 (계획)
```javascript
store = {
  modules: {
    auth: {
      state: { user, isAuthenticated, token },
      mutations: { SET_USER, SET_AUTH, LOGOUT },
      actions: { login, logout, checkAuth }
    },
    projects: {
      state: { projects, currentProject, loading },
      mutations: { SET_PROJECTS, SET_CURRENT, SET_LOADING },
      actions: { fetchProjects, createProject, updateProject, deleteProject }
    },
    posts: {
      state: { posts, currentPost, loading },
      mutations: { SET_POSTS, SET_CURRENT, SET_LOADING },
      actions: { fetchPosts, createPost, updatePost, deletePost }
    }
  }
}
```

## 6. API 통신 구조

### 6.1 Service Layer 패턴
```javascript
// services/baseService.js
class BaseService {
  async request(method, endpoint, data) {
    try {
      const response = await supabase[method](endpoint, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// services/projectService.js
class ProjectService extends BaseService {
  async getProjects() { ... }
  async createProject(data) { ... }
  async updateProject(id, data) { ... }
  async deleteProject(id) { ... }
}
```

### 6.2 에러 처리 전략
- 서비스 레벨: try-catch로 에러 캐치
- 컴포넌트 레벨: 에러 상태 관리 및 사용자 피드백
- 전역 레벨: 에러 바운더리 (향후 구현)

## 7. 보안 설계

### 7.1 인증 흐름
```
1. 로그인 요청 → Supabase Auth
2. JWT 토큰 발급 → 로컬 저장
3. API 요청 시 토큰 자동 첨부
4. 서버 측 토큰 검증
5. Row Level Security (RLS) 적용
```

### 7.2 보안 고려사항
- **XSS 방지**: Vue의 자동 이스케이핑
- **CSRF 방지**: Supabase의 토큰 기반 인증
- **환경변수 보호**: .env 파일로 민감 정보 분리
- **HTTPS 강제**: 프로덕션 환경에서 SSL 사용

## 8. 성능 최적화

### 8.1 현재 적용된 최적화
- 라우트 레벨 코드 스플리팅 (Vue Router)
- 이미지 최적화 및 lazy loading
- CSS 최소화

### 8.2 향후 최적화 계획
- 컴포넌트 lazy loading
- Virtual scrolling (긴 목록)
- Service Worker 캐싱
- Bundle 크기 최적화

## 9. 개발 워크플로우

### 9.1 브랜치 전략
```
main (프로덕션)
├── develop (개발)
└── feature/* (기능 개발)
    ├── feature/add-nickname-and-validation (현재)
    └── feature/implement-file-upload
```

### 9.2 커밋 규칙
- `feat:` 새로운 기능
- `fix:` 버그 수정
- `refactor:` 코드 리팩토링
- `style:` 스타일 변경
- `docs:` 문서 수정
- `test:` 테스트 추가/수정

## 10. 배포 아키텍처

### 10.1 Docker 기반 배포
```dockerfile
# 빌드 스테이지
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 실행 스테이지
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "$PORT"]
```

### 10.2 환경별 배포
- **개발**: `npm run serve` (로컬)
- **스테이징**: Railway 스테이징 환경
- **프로덕션**: Railway 프로덕션 환경

## 11. 모니터링 및 로깅

### 11.1 에러 추적
- Console 로깅 (개발)
- Sentry 통합 (향후 계획)

### 11.2 성능 모니터링
- Chrome DevTools (개발)
- Google Analytics (프로덕션)
- Web Vitals 측정 (향후 계획)