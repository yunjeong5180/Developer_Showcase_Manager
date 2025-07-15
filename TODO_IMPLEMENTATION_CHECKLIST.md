# 🔧 Developer Showcase Manager - 구현해야 할 기능 체크리스트

> 📅 **작성일**: 2025년 7월 15일  
> 🎯 **목표**: 프로젝트 완성도 75% → 100%  
> ⏰ **예상 완성 기간**: 2-3주

---

## 🚀 **Phase 1: 핵심 기능 완성** (우선순위: 높음)

### 📊 **1. 데이터베이스 테이블 생성**

#### 🗄️ **프로젝트 테이블 구현**
- [ ] **projects 테이블 생성**
  ```sql
  CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR NOT NULL,
    description TEXT,
    tech_stack JSONB DEFAULT '[]',
    github_url VARCHAR,
    demo_url VARCHAR,
    image_urls JSONB DEFAULT '[]',
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] **RLS 정책 설정**
  ```sql
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can only see their own projects" ON projects
    FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));
  ```
- [ ] **인덱스 최적화**
  ```sql
  CREATE INDEX idx_projects_user_id ON projects(user_id);
  CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
  ```

#### 🗄️ **활동 로그 테이블 구현**
- [ ] **activity_logs 테이블 생성**
  ```sql
  CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR NOT NULL,
    target_type VARCHAR,
    target_id INTEGER,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] **RLS 정책 설정**
  ```sql
  -- 활동 로그 테이블에 RLS 활성화
  ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
  
  -- 사용자는 자신의 활동 로그만 조회 가능
  CREATE POLICY "Users can only see their own activity logs" ON activity_logs
    FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));
  
  -- 사용자는 자신의 활동 로그만 생성 가능
  CREATE POLICY "Users can only create their own activity logs" ON activity_logs
    FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));
  
  -- 활동 로그는 수정/삭제 불가 (보안상 이유로 읽기 전용)
  CREATE POLICY "Activity logs are read-only" ON activity_logs
    FOR UPDATE USING (false);
  CREATE POLICY "Activity logs cannot be deleted" ON activity_logs
    FOR DELETE USING (false);
  ```
- [ ] **인덱스 최적화**
  ```sql
  -- 사용자별 활동 로그 조회 최적화
  CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
  
  -- 최신 활동 순 정렬 최적화
  CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
  
  -- 사용자별 + 시간순 복합 인덱스 (가장 자주 사용되는 쿼리)
  CREATE INDEX idx_activity_logs_user_created ON activity_logs(user_id, created_at DESC);
  
  -- 액션 타입별 검색 최적화
  CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
  
  -- 타겟 타입 및 ID별 검색 최적화 (특정 프로젝트의 활동 로그 조회용)
  CREATE INDEX idx_activity_logs_target ON activity_logs(target_type, target_id);
  
  -- JSONB 메타데이터 검색 최적화 (GIN 인덱스)
  CREATE INDEX idx_activity_logs_metadata ON activity_logs USING GIN (metadata);
  ```

---

### 🔧 **2. API 서비스 구현**

#### 📝 **projectService.js 생성**
- [ ] **파일 생성**: `src/services/projectService.js`
- [ ] **createProject 함수**
  ```javascript
  async createProject(projectData) {
    // 프로젝트 생성 로직
    // 이미지 업로드 처리
    // 활동 로그 기록
  }
  ```
- [ ] **getProjects 함수**
  ```javascript
  async getProjects(userId, filters = {}) {
    // 사용자별 프로젝트 목록 조회
    // 필터링 및 정렬 옵션
    // 페이지네이션 지원
  }
  ```
- [ ] **getProject 함수**
  ```javascript
  async getProject(projectId) {
    // 프로젝트 상세 정보 조회
    // 조회수 증가 로직
  }
  ```
- [ ] **updateProject 함수**
  ```javascript
  async updateProject(projectId, updateData) {
    // 프로젝트 정보 수정
    // 이미지 업데이트 처리
    // 활동 로그 기록
  }
  ```
- [ ] **deleteProject 함수**
  ```javascript
  async deleteProject(projectId) {
    // 프로젝트 삭제
    // 관련 이미지 삭제
    // 활동 로그 기록
  }
  ```

#### 📊 **statisticsService.js 생성**
- [ ] **파일 생성**: `src/services/statisticsService.js`
- [ ] **getDashboardStats 함수**
  ```javascript
  async getDashboardStats(userId) {
    // 총 프로젝트 수
    // 이번 달 조회수
    // 최근 업데이트 수
    // 기술 스택 통계
  }
  ```
- [ ] **getRecentActivities 함수**
  ```javascript
  async getRecentActivities(userId, limit = 10) {
    // 최근 활동 목록 조회
    // 시간순 정렬
  }
  ```

#### 🖼️ **imageService.js 생성**
- [ ] **파일 생성**: `src/services/imageService.js`
- [ ] **uploadProjectImages 함수**
  ```javascript
  async uploadProjectImages(files, projectId) {
    // Supabase Storage 업로드
    // 이미지 리사이징
    // URL 반환
  }
  ```
- [ ] **deleteProjectImages 함수**
- [ ] **uploadProfileImage 함수** (기존 기능 이관)

---

### 📱 **3. 페이지 API 연동**

#### 🏠 **Dashboard.vue 업데이트**
- [ ] **실시간 통계 데이터 로딩**
  ```javascript
  async mounted() {
    await this.loadDashboardStats();
    await this.loadRecentActivities();
  }
  ```
- [ ] **통계 카드 동적 데이터 바인딩**
- [ ] **최근 활동 목록 실시간 업데이트**
- [ ] **로딩 상태 및 에러 처리**
- [ ] **새로고침 기능 추가**

#### 📝 **CreatePost.vue 완성**
- [ ] **프로젝트 생성 API 연동**
  ```javascript
  async submitProject() {
    const projectData = {
      title: this.title,
      description: this.description,
      tech_stack: this.selectedTechStack,
      github_url: this.githubUrl,
      demo_url: this.demoUrl,
      start_date: this.startDate,
      end_date: this.endDate
    };
    
    const result = await projectAPI.createProject(projectData);
    if (result.success) {
      // 이미지 업로드 처리
      await this.uploadImages(result.data.id);
      this.$router.push('/post-list');
    }
  }
  ```
- [ ] **이미지 업로드 기능 구현**
- [ ] **폼 검증 강화**
- [ ] **진행률 표시**
- [ ] **임시 저장 기능**

#### 📋 **PostList.vue 완성**
- [ ] **프로젝트 목록 API 연동**
  ```javascript
  async loadProjects() {
    this.loading = true;
    const result = await projectAPI.getProjects(this.userId, {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchQuery,
      techStack: this.selectedTechFilter
    });
    this.projects = result.data;
    this.loading = false;
  }
  ```
- [ ] **검색 및 필터링 기능**
- [ ] **무한 스크롤 또는 페이지네이션**
- [ ] **프로젝트 편집/삭제 기능**
- [ ] **이미지 lazy loading**

#### 👤 **Profile.vue 완성**
- [ ] **프로필 데이터 로딩**
  ```javascript
  async loadUserProfile() {
    const result = await profileAPI.getUserProfile(this.authUserId);
    if (result.success) {
      this.profile = result.data;
    }
  }
  ```
- [ ] **프로필 업데이트 API 연동**
- [ ] **프로필 이미지 업로드 완성**
- [ ] **기술 스택 관리 기능**
- [ ] **소셜 링크 검증**

---

## 🔧 **Phase 2: 고급 기능 구현** (우선순위: 중간)

### 🔒 **4. 2단계 인증 완성**

#### 📱 **TwoFactorAuth.vue 로직 구현**
- [ ] **TOTP 라이브러리 설치**
  ```bash
  npm install qrcode speakeasy
  ```
- [ ] **시크릿 생성 및 QR 코드 생성**
  ```javascript
  async generateSecret() {
    const secret = speakeasy.generateSecret({
      name: `Developer Showcase (${this.userEmail})`,
      length: 32
    });
    
    this.secret = secret.base32;
    this.qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  }
  ```
- [ ] **인증 코드 검증 API**
- [ ] **백업 코드 생성 및 저장**
- [ ] **2FA 활성화/비활성화 기능**

---

### 🎨 **5. 사용자 경험 개선**

#### 🌙 **다크 모드 구현**
- [ ] **전역 테마 관리 시스템**
  ```javascript
  // src/composables/useTheme.js
  export function useTheme() {
    const isDark = ref(false);
    
    const toggleTheme = () => {
      isDark.value = !isDark.value;
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDark.value);
    };
    
    return { isDark, toggleTheme };
  }
  ```
- [ ] **CSS 변수 활용 테마 시스템**
- [ ] **모든 컴포넌트 다크 모드 대응**
- [ ] **테마 토글 버튼 추가**

#### 🔔 **알림 토스트 시스템**
- [ ] **Toast 컴포넌트 생성**
  ```javascript
  // src/components/Toast.vue
  // 성공, 에러, 정보, 경고 타입 지원
  // 자동 사라짐 기능
  // 스택 관리
  ```
- [ ] **전역 토스트 서비스**
- [ ] **API 응답에 토스트 연동**

#### 🔍 **검색 및 필터링 고도화**
- [ ] **전체 텍스트 검색**
- [ ] **고급 필터 옵션**
  - 기술 스택별 필터
  - 날짜 범위 필터
  - 프로젝트 상태 필터
- [ ] **검색 결과 하이라이트**
- [ ] **검색 히스토리 저장**

---

## 🚀 **Phase 3: 성능 최적화 및 확장** (우선순위: 낮음)

### ⚡ **6. 성능 최적화**

#### 🏎️ **코드 스플리팅 및 Lazy Loading**
- [ ] **라우트 기반 코드 스플리팅**
  ```javascript
  const Dashboard = () => import('@/views/Dashboard.vue');
  const Profile = () => import('@/views/Profile.vue');
  ```
- [ ] **컴포넌트 Lazy Loading**
- [ ] **이미지 Lazy Loading 구현**
- [ ] **무한 스크롤 최적화**

#### 🗄️ **캐싱 시스템**
- [ ] **API 응답 캐싱**
- [ ] **이미지 캐싱 최적화**
- [ ] **브라우저 캐시 활용**

### 🌐 **7. 국제화 (i18n)**
- [ ] **vue-i18n 설정**
- [ ] **다국어 파일 구성**
  - 한국어 (기본)
  - 영어
- [ ] **언어 전환 기능**
- [ ] **날짜/시간 로케일 처리**

### 📊 **8. 고급 분석 기능**

#### 📈 **상세 통계 대시보드**
- [ ] **차트 라이브러리 도입** (Chart.js 또는 D3.js)
- [ ] **프로젝트 조회수 추적**
- [ ] **기술 스택 트렌드 분석**
- [ ] **월별/연도별 활동 통계**

#### 🔍 **SEO 최적화**
- [ ] **메타 태그 동적 설정**
- [ ] **Open Graph 태그**
- [ ] **구조화된 데이터 추가**

---

## 🗂️ **추가 확장 기능** (선택사항)

### 💼 **경력 관리 시스템**
- [ ] **experiences 테이블 구현**
- [ ] **경력 CRUD API**
- [ ] **경력 관리 페이지**
- [ ] **이력서 자동 생성**

### 🎓 **교육/자격증 관리**
- [ ] **educations 테이블**
- [ ] **certifications 테이블**
- [ ] **관련 CRUD 기능**

### 📝 **블로그 기능**
- [ ] **posts 테이블**
- [ ] **마크다운 에디터**
- [ ] **태그 시스템**
- [ ] **댓글 시스템**

### 🔗 **API 외부 연동**
- [ ] **GitHub API 연동** (레포지토리 자동 가져오기)
- [ ] **LinkedIn API 연동**
- [ ] **Google Analytics 연동**

---

## 📝 **구현 우선순위 가이드**

### 🔥 **즉시 시작 (1주차)**
1. **projects 테이블 생성** - 가장 핵심적인 기능
2. **projectService.js 구현** - API 레이어 완성
3. **Dashboard.vue 데이터 연동** - 사용자가 가장 먼저 보는 페이지

### ⚡ **빠른 시일 내 (2주차)**
4. **CreatePost.vue 완성** - 프로젝트 생성 기능
5. **PostList.vue 완성** - 프로젝트 관리 기능
6. **Profile.vue 완성** - 사용자 정보 관리

### 🔧 **점진적 개선 (3주차)**
7. **이미지 업로드 서비스** - 사용자 경험 개선
8. **검색 및 필터링** - 데이터 관리 효율성
9. **2FA 완성** - 보안 강화

### 🎨 **장기 개선 (4주차 이후)**
10. **다크 모드** - UI/UX 개선
11. **성능 최적화** - 사용자 경험 향상
12. **고급 분석 기능** - 부가 기능

---

## 🏁 **완성 기준**

### ✅ **Phase 1 완성 시 (85% 완료)**
- 모든 CRUD 기능 동작
- 대시보드 실시간 데이터 표시
- 이미지 업로드 기능 완성
- 기본적인 검색/필터링

### ✅ **Phase 2 완성 시 (95% 완료)**
- 2FA 완전 구현
- 다크 모드 지원
- 알림 시스템 구현
- 성능 최적화 완료

### ✅ **Phase 3 완성 시 (100% 완료)**
- 모든 고급 기능 구현
- 국제화 지원
- 완전한 반응형 디자인
- 프로덕션 준비 완료

---

## 💡 **개발 팁**

### 🔄 **개발 순서 권장사항**
1. **백엔드부터** (테이블 → API → 연동)
2. **핵심 기능 우선** (CRUD → 부가 기능)
3. **사용자 관점에서** (자주 사용하는 기능 우선)
4. **점진적 개선** (완벽보다는 동작하는 것 우선)

### 🧪 **테스트 전략**
- 각 API 함수별 단위 테스트
- 페이지별 통합 테스트
- 사용자 시나리오 기반 E2E 테스트

### 📋 **진행 상황 추적**
- 매일 체크리스트 업데이트
- 주간 진행률 리뷰
- 문제 발생 시 즉시 문서화

---

*📅 마지막 업데이트: 2025년 7월 15일*  
*🎯 목표 완성일: 2025년 8월 5일*  
*📊 현재 진행률: 75% → 목표: 100%*