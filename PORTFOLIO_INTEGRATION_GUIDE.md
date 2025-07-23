# 🌟 포트폴리오 연동 가이드

> **Developer Showcase Manager**와 공개 포트폴리오를 연결하는 완전한 가이드

## ✅ **현재 완료 상태 (2025-07-23)**

### **완료된 작업:**
1. **Next.js 포트폴리오 프로젝트 생성** (`/portfolio-nextjs`)
   - TypeScript + Tailwind CSS 설정
   - 프로젝트 구조 완성
   
2. **기본 페이지 구현:**
   - ✅ **홈페이지**: 히어로 섹션, Welcome 섹션, 애니메이션 효과
   - ✅ **About 페이지**: 프로필, 스킬 태그, 학습 여정 타임라인, 관심사 카드
   - ✅ **Projects 페이지**: 프로젝트 목록, 필터링 기능, 상세 정보 표시
   - ✅ **Contact 페이지**: 연락처 정보, 메시지 폼, FAQ 섹션
   
3. **UI/UX 기능:**
   - ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
   - ✅ 스크롤 애니메이션 (Intersection Observer)
   - ✅ 부드러운 페이지 전환
   - ✅ 네비게이션 스크롤 효과
   
4. **기술 스택:**
   - ✅ Next.js 15.4.3 (App Router)
   - ✅ TypeScript
   - ✅ Tailwind CSS
   - ✅ Supabase 클라이언트 준비

### **다음 단계:**

---

## 📋 **목차**

1. [현재 상황 분석](#-현재-상황-분석)
2. [포트폴리오 연동 아키텍처](#-포트폴리오-연동-아키텍처)
3. [연결 방법 옵션](#-연결-방법-옵션)
4. [즉시 적용 가능한 방법](#-즉시-적용-가능한-방법)
5. [단계별 구현 방법](#-단계별-구현-방법)
6. [최신 디자인 트렌드 적용](#-최신-디자인-트렌드-적용)
7. [보안 고려사항](#-보안-고려사항)
8. [배포 및 도메인 설정](#-배포-및-도메인-설정)

---

## 🎯 **현재 상황 분석**

### **관리자 페이지**: Developer Showcase Manager
- **완성도**: 약 90% (인증 시스템, UI 완료)
- **기술 스택**: Vue 3 + Supabase
- **주요 기능**: 로그인, 회원가입, 대시보드, 프로젝트 관리 UI
- **완성된 기능 ✅**
  - 인증 시스템: 이메일/비밀번호 로그인, 소셜 로그인 (GitHub, Google), 회원가입, 비밀번호 재설정
  - 보안: 2단계 인증 UI, Row Level Security, 입력 검증
  - UI/UX: 반응형 디자인, 모던 그라디언트 UI, 모바일 최적화
  - 라우팅: 인증 가드, 보호된 라우트, 자동 리디렉션

### **공개 포트폴리오**: 양윤정 포트폴리오 웹사이트
- **완성도**: 약 85% (UI 완료, 일부 기능 구현 필요)
- **기술 스택**: Spring Boot + HTML/CSS/JavaScript
- **주요 기능**: 프로젝트 전시, 개인 소개, 연락처 폼
- **완성된 기능 ✅**
  - 반응형 디자인: 모든 디바이스 대응
  - 애니메이션 효과: 스크롤 애니메이션, 페이드인 효과  
  - 모던 UI: 그라디언트, 글라스모피즘, 백드롭 필터
  - 페이지 구조: 홈, 소개, 프로젝트, 연락처 분리
  - 필터링 기능: 프로젝트 카테고리 필터

### **현재 구현된 프로젝트들**
1. 포트폴리오 웹사이트 (HTML/CSS/JavaScript)
2. 할일 관리 앱 (Spring Boot + Supabase)
3. 아이디어 노트 (Spring Boot + PostgreSQL)
4. 북마크 관리 사이트 (Spring Boot + Supabase)
5. 간단한 쇼핑몰 (Spring Boot + JPA)
6. 날씨 앱 (JavaScript + API)

---

## 🏗️ **포트폴리오 연동 아키텍처**

### **현재 상황 기반 아키텍처**

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   공개 포트폴리오    │    │   관리자 대시보드    │    │    공통 데이터      │
│   (현재 Spring)     │    │   (Vue + Supabase)  │    │   (Supabase)       │
├─────────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│ yourname.dev        │◄──►│ admin.yourname.dev  │◄──►│ PostgreSQL         │
│                     │    │                     │    │                     │
│ • 프로젝트 조회      │    │ • 프로젝트 관리      │    │ • 사용자 데이터     │
│ • 정적 콘텐츠       │    │ • 콘텐츠 편집       │    │ • 프로젝트 데이터   │
│ • Spring Boot API   │    │ • 통계 대시보드      │    │ • 이미지 저장소     │
│ • 반응형 HTML/CSS   │    │ • 실시간 업데이트    │    │ • 인증 시스템      │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### **데이터 흐름**
1. **관리자 페이지**에서 프로젝트 및 프로필 데이터 입력/수정
2. **Supabase 데이터베이스**에 저장
3. **공개 포트폴리오**에서 Supabase API를 통해 데이터 조회
4. **실시간 동기화** (선택사항: Supabase 실시간 기능 활용)

---

## 🔗 **연결 방법 옵션**

### **옵션 1: 현재 구조 유지 + API 연결** (권장)
**현재 Spring Boot 포트폴리오 + Supabase API 연동**

**장점:**
- ✅ 기존 포트폴리오 디자인 및 기능 100% 유지
- ✅ 빠른 구현 가능 (1-2주)
- ✅ 안정적인 Spring Boot 백엔드 활용
- ✅ 점진적 기능 추가 가능

**단점:**
- ⚠️ 두 개의 백엔드 기술 스택 관리
- ⚠️ 실시간 동기화 구현 복잡성

**구현 방법:**
```java
// Spring Boot Controller에 Supabase 연동 추가
@RestController
public class PortfolioController {
    
    @Autowired
    private SupabaseService supabaseService;
    
    @GetMapping("/api/projects")
    public ResponseEntity<List<Project>> getProjects() {
        List<Project> projects = supabaseService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
}
```

### **옵션 2: 포트폴리오를 Supabase로 마이그레이션**
**Spring Boot → Supabase 백엔드로 변경**

**장점:**
- ✅ 단일 데이터베이스로 관리
- ✅ 실시간 동기화 간편
- ✅ 관리자 페이지와 완전 통합

**단점:**
- ❌ 기존 Spring Boot 코드 폐기
- ❌ 백엔드 로직 재구현 필요
- ❌ 구현 시간 오래 소요 (3-4주)

### **옵션 3: 포트폴리오를 Next.js로 재구축**
**HTML/CSS/JS → Next.js + Supabase**

**장점:**
- ✅ 최신 기술 스택 적용
- ✅ SEO 최적화
- ✅ 관리자 페이지와 완전 통합
- ✅ 실시간 동기화

**단점:**
- ❌ 전체 프론트엔드 재구축 필요
- ❌ 기존 디자인 재구현 필요
- ❌ 구현 시간 매우 오래 소요 (4-6주)

---

## 🚀 **즉시 적용 가능한 방법**

### **1. 관리자 페이지 연결 버튼 추가**

현재 포트폴리오에 숨겨진 관리자 접근 기능을 추가할 수 있습니다:

#### **HTML 추가** (`index.html`)
```html
<!-- 관리자 접근 트리거 (페이지 하단) -->
<div id="admin-access" class="admin-trigger">
    <div class="admin-icon">⚙️</div>
</div>
```

#### **CSS 추가** (`style.css`)
```css
/* 관리자 접근 버튼 스타일 */
.admin-trigger {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.3;
    transition: all 0.3s ease;
    z-index: 1000;
}

.admin-trigger:hover {
    opacity: 1;
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
}

.admin-icon {
    font-size: 1.2rem;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
```

#### **JavaScript 추가** (`main.js`)
```javascript
// 관리자 접근 기능
let adminClicks = 0;
const adminTrigger = document.getElementById('admin-access');

if (adminTrigger) {
    adminTrigger.addEventListener('click', () => {
        adminClicks++;
        
        // 5번 클릭 시 관리자 페이지로 이동
        if (adminClicks >= 5) {
            const confirmed = confirm('관리자 페이지로 이동하시겠습니까?');
            if (confirmed) {
                window.open('https://admin.yourname.dev', '_blank');
            }
            adminClicks = 0;
        }
        
        // 클릭 시 시각적 피드백
        adminTrigger.style.transform = 'scale(0.9)';
        setTimeout(() => {
            adminTrigger.style.transform = 'scale(1)';
        }, 150);
    });
}

// 키보드 단축키 (Ctrl + Shift + A)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const confirmed = confirm('관리자 페이지로 이동하시겠습니까?');
        if (confirmed) {
            window.open('https://admin.yourname.dev', '_blank');
        }
    }
});
```

### **2. Supabase API 연동 준비**

#### **Spring Boot에 Supabase 의존성 추가** (`pom.xml`)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
<dependency>
    <groupId>io.github.supabase</groupId>
    <artifactId>supabase-java</artifactId>
    <version>0.1.0</version>
</dependency>
```

#### **Supabase 설정 클래스**
```java
// src/main/java/com/nd_portfolio/portfolio/config/SupabaseConfig.java
@Configuration
public class SupabaseConfig {
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.key}")
    private String supabaseKey;
    
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
            .baseUrl(supabaseUrl)
            .defaultHeader("apikey", supabaseKey)
            .defaultHeader("Content-Type", "application/json")
            .build();
    }
}
```

#### **환경 변수 설정** (`application.properties`)
```properties
# Supabase 설정
supabase.url=your_supabase_url
supabase.key=your_supabase_anon_key
```

### **3. 프로젝트 데이터 동적 로딩**

#### **JavaScript에서 API 호출** (`projects.js`)
```javascript
// 프로젝트 데이터 동적 로딩
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = ''; // 기존 정적 데이터 제거
        
        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
        
        // 애니메이션 재적용
        initializeAnimations();
        
    } catch (error) {
        console.error('프로젝트 로딩 실패:', error);
        // 폴백: 기존 정적 데이터 유지
    }
}

// 프로젝트 카드 생성 함수
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.setAttribute('data-delay', (index + 1) * 100);
    card.setAttribute('data-category', project.category);
    
    card.innerHTML = `
        <div class="project-image" style="background: ${project.gradient};">
            ${project.icon}
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-details">
                <h4>주요 기능</h4>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="project-links">
                <a href="${project.demoUrl}" class="project-link">Live Demo</a>
                <a href="${project.githubUrl}" class="project-link">GitHub</a>
            </div>
        </div>
    `;
    
    return card;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', loadProjects);
```

---

## 📊 **구현 난이도 및 소요 시간**

### **옵션별 비교**

| 구분 | 옵션 1 (현재 구조 유지) | 옵션 2 (Supabase 마이그레이션) | 옵션 3 (Next.js 재구축) |
|------|------------------------|--------------------------------|-------------------------|
| **소요 시간** | 1-2주 | 3-4주 | 4-6주 |
| **난이도** | ⭐⭐☆☆☆ | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐☆ |
| **기존 코드 활용** | 100% 유지 | 프론트엔드 50% 유지 | 0% (전체 재구축) |
| **실시간 동기화** | 복잡함 | 간단함 | 간단함 |
| **유지보수성** | 보통 | 좋음 | 매우 좋음 |
| **확장성** | 보통 | 좋음 | 매우 좋음 |

### **권장 순서**
1. **1단계**: 옵션 1로 빠른 연결 구현
2. **2단계**: 필요 시 옵션 2 또는 3으로 점진적 마이그레이션

---

## 🛠️ **세부 구현 가이드**

### **Phase 1: 기본 연결 (1주)**

#### **1일차: 환경 설정**
- [ ] Spring Boot에 Supabase 의존성 추가
- [ ] 환경 변수 설정 (`application.properties`)
- [ ] Supabase 설정 클래스 생성

#### **2일차: 관리자 접근 기능**
- [ ] 관리자 버튼 HTML/CSS 추가
- [ ] JavaScript 이벤트 핸들러 구현
- [ ] 키보드 단축키 구현

#### **3일차: API 엔드포인트**
- [ ] SupabaseService 클래스 생성
- [ ] 프로젝트 조회 API 구현
- [ ] 프로필 정보 조회 API 구현

#### **4일차: 프론트엔드 연동**
- [ ] 프로젝트 데이터 동적 로딩
- [ ] 기존 정적 데이터 대체
- [ ] 애니메이션 재적용

#### **5일차: 테스트 및 디버깅**
- [ ] 전체 기능 테스트
- [ ] 버그 수정 및 최적화
- [ ] 배포 및 도메인 연결

### **Phase 2: 고급 기능 (1주)**

#### **1일차: 실시간 동기화**
- [ ] WebSocket 연결 구현
- [ ] 실시간 업데이트 기능

#### **2일차: 이미지 관리**
- [ ] Supabase Storage 연동
- [ ] 이미지 업로드/삭제 기능

#### **3일차: 검색 및 필터링**
- [ ] 프로젝트 검색 기능
- [ ] 고급 필터링 옵션

#### **4일차: 분석 및 통계**
- [ ] 방문자 추적
- [ ] 프로젝트 조회수 기능

#### **5일차: 성능 최적화**
- [ ] 캐싱 구현
- [ ] 이미지 최적화
- [ ] 로딩 성능 개선

---

## 🔧 **코드 템플릿**

### **Supabase Service 클래스**
```java
// src/main/java/com/nd_portfolio/portfolio/service/SupabaseService.java
@Service
public class SupabaseService {
    
    @Autowired
    private WebClient webClient;
    
    public List<Project> getAllProjects() {
        try {
            String response = webClient.get()
                .uri("/rest/v1/projects?select=*")
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response, new TypeReference<List<Project>>() {});
            
        } catch (Exception e) {
            log.error("프로젝트 조회 실패", e);
            return Collections.emptyList();
        }
    }
    
    public UserProfile getUserProfile(Long userId) {
        try {
            String response = webClient.get()
                .uri("/rest/v1/users?id=eq.{userId}&select=*", userId)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            ObjectMapper mapper = new ObjectMapper();
            List<UserProfile> profiles = mapper.readValue(response, new TypeReference<List<UserProfile>>() {});
            
            return profiles.isEmpty() ? null : profiles.get(0);
            
        } catch (Exception e) {
            log.error("사용자 프로필 조회 실패", e);
            return null;
        }
    }
}
```

### **프로젝트 데이터 모델**
```java
// src/main/java/com/nd_portfolio/portfolio/model/Project.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    private Long id;
    private String title;
    private String description;
    private List<String> techStack;
    private String githubUrl;
    private String demoUrl;
    private List<String> imageUrls;
    private String category;
    private String gradient;
    private String icon;
    private List<String> features;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### **컨트롤러 구현**
```java
// src/main/java/com/nd_portfolio/portfolio/controller/ApiController.java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {
    
    @Autowired
    private SupabaseService supabaseService;
    
    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjects() {
        List<Project> projects = supabaseService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long userId) {
        UserProfile profile = supabaseService.getUserProfile(userId);
        if (profile != null) {
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/projects/{id}/view")
    public ResponseEntity<Void> incrementProjectView(@PathVariable Long id) {
        supabaseService.incrementProjectView(id);
        return ResponseEntity.ok().build();
    }
}
```

---

## 💡 **권장 구현 방법**

### **즉시 시작 가능한 단계**

1. **오늘 할 수 있는 것**:
   - 관리자 접근 버튼 추가 (HTML/CSS/JS)
   - 키보드 단축키 구현
   - 환경 변수 설정

2. **이번 주 내로 완성**:
   - Spring Boot + Supabase 연동
   - 기본 API 엔드포인트 구현
   - 프로젝트 데이터 동적 로딩

3. **다음 주 목표**:
   - 실시간 동기화 구현
   - 이미지 관리 기능
   - 성능 최적화

---

## 🎯 **결론 및 추천**

### **권장 옵션**: 옵션 1 (현재 구조 유지 + API 연결)

**이유:**
- ✅ **빠른 구현**: 1-2주 내 완성 가능
- ✅ **기존 코드 활용**: 현재 포트폴리오 디자인 100% 유지
- ✅ **점진적 개선**: 나중에 필요 시 다른 옵션으로 마이그레이션 가능
- ✅ **안정성**: 검증된 Spring Boot + 새로운 Supabase 조합

### **구현 우선순위**
1. **1순위**: 관리자 접근 버튼 (즉시 가능)
2. **2순위**: Supabase API 연동 (1주)
3. **3순위**: 프로젝트 데이터 동적 로딩 (1주)
4. **4순위**: 실시간 동기화 (추후 확장)

---

## 📞 **다음 단계 제안**

어떤 방향으로 진행하고 싶으신지 알려주세요:

1. **즉시 시작**: 관리자 버튼부터 구현
2. **전체 계획**: 2주 완성 계획 수립
3. **기술 검토**: 다른 옵션 상세 검토
4. **코드 구현**: 실제 코드 작성 시작

이 문서를 참고하여 원하는 방향을 선택해주세요! 🚀

---

## 📋 **체크리스트**

### **즉시 적용 가능한 작업**
- [ ] 관리자 접근 버튼 HTML 추가
- [ ] 관리자 접근 버튼 CSS 스타일링
- [ ] JavaScript 이벤트 핸들러 구현
- [ ] 키보드 단축키 구현

### **1주차 목표**
- [ ] Spring Boot Supabase 의존성 추가
- [ ] 환경 변수 설정
- [ ] SupabaseService 클래스 생성
- [ ] 기본 API 엔드포인트 구현

### **2주차 목표**
- [ ] 프로젝트 데이터 동적 로딩
- [ ] 기존 정적 데이터 대체
- [ ] 애니메이션 재적용
- [ ] 전체 기능 테스트

### **추후 확장 (선택사항)**
- [ ] 실시간 동기화 구현
- [ ] 이미지 관리 기능
- [ ] 검색 및 필터링 고도화
- [ ] 성능 최적화 및 캐싱

---

*작성일: 2025-07-17*  
*버전: 2.0*  
*상태: 검토 대기*

#### 1.1 데이터베이스 완성

```sql
-- 프로젝트 테이블 생성
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  tech_stack JSONB DEFAULT '[]',
  github_url VARCHAR,
  demo_url VARCHAR,
  image_urls JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 기술 스택 테이블
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR NOT NULL,
  level INTEGER CHECK (level >= 1 AND level <= 5),
  category VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 경력 정보 테이블
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  company VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 1.2 Row Level Security 정책 설정

```sql
-- 프로젝트 테이블 RLS 설정
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON projects
FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert own projects" ON projects
FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update own projects" ON projects
FOR UPDATE USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete own projects" ON projects
FOR DELETE USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

-- 공개 읽기 정책 (포트폴리오용)
CREATE POLICY "Public can view published projects" ON projects
FOR SELECT USING (true);
```

#### 1.3 공개 API 엔드포인트 추가

```javascript
// src/services/publicAPI.js
import { supabase } from '@/config/supabase'

export const publicAPI = {
  // 공개 프로필 조회
  async getPublicProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        nickname,
        bio,
        one_liner,
        github_url,
        linkedin_url,
        personal_blog_url,
        profile_image_url,
        created_at
      `)
      .eq('id', userId)
      .single()
    
    return { data, error }
  },
  
  // 공개 프로젝트 목록 조회
  async getPublicProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        tech_stack,
        github_url,
        demo_url,
        image_urls,
        is_featured,
        view_count,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },
  
  // 추천 프로젝트 조회
  async getFeaturedProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('is_featured', true)
      .order('view_count', { ascending: false })
      .limit(3)
    
    return { data, error }
  },
  
  // 기술 스택 조회
  async getPublicSkills(userId) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('level', { ascending: false })
    
    return { data, error }
  }
}
```

#### 1.4 기존 페이지 API 연동 완성

```javascript
// src/views/Dashboard.vue - 실제 데이터 연동
<script>
import { statisticsAPI } from '@/services/statisticsService'
import { authAPI } from '@/config/supabase'

export default {
  name: "DashboardPage",
  data() {
    return {
      stats: {
        totalProjects: 0,
        monthlyViews: 0,
        recentUpdates: 0
      },
      recentActivities: [],
      loading: true,
      error: null
    }
  },
  
  async mounted() {
    await this.loadDashboardData()
  },
  
  methods: {
    async loadDashboardData() {
      try {
        this.loading = true
        
        const currentUser = await authAPI.getCurrentUser()
        if (!currentUser) {
          this.$router.push('/login')
          return
        }
        
        const [statsResult, activitiesResult] = await Promise.all([
          statisticsAPI.getDashboardStats(),
          statisticsAPI.getRecentActivities()
        ])
        
        if (statsResult.success) {
          this.stats = statsResult.data
        }
        
        if (activitiesResult.success) {
          this.recentActivities = activitiesResult.data
        }
        
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

---

### **Phase 2: 공개 포트폴리오 구축 (2-3주)**

#### 2.1 Next.js 프로젝트 생성

```bash
# 프로젝트 생성
npx create-next-app@latest portfolio --typescript --tailwind --app
cd portfolio

# 필수 패키지 설치
npm install framer-motion lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @supabase/supabase-js next-themes
npm install class-variance-authority clsx tailwind-merge
```

#### 2.2 프로젝트 구조

```
portfolio/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── Hero.tsx
│   ├── ProjectCard.tsx
│   ├── SkillsSection.tsx
│   └── AdminAccess.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── types/
    └── index.ts
```

#### 2.3 Hero 섹션 구현

```tsx
// components/Hero.tsx
'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  profile: {
    name: string
    nickname: string
    bio: string
    one_liner: string
    github_url: string
    linkedin_url: string
    profile_image_url: string
  }
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.img 
            src={profile.profile_image_url || '/placeholder-avatar.jpg'} 
            alt={profile.name}
            className="w-32 h-32 rounded-full mx-auto mb-6 shadow-2xl ring-4 ring-blue-200 dark:ring-blue-800"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {profile.name}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {profile.one_liner}
          </motion.p>
          
          <motion.p 
            className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {profile.bio}
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </a>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <a href="#contact">
              <Mail className="w-5 h-5 mr-2" />
              연락하기
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
```

#### 2.4 프로젝트 카드 컴포넌트

```tsx
// components/ProjectCard.tsx
'use client'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
  project: {
    id: number
    title: string
    description: string
    tech_stack: string[]
    github_url: string
    demo_url: string
    image_urls: string[]
    view_count: number
    created_at: string
  }
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="relative overflow-hidden h-48">
          <img 
            src={project.image_urls[0] || '/placeholder-project.jpg'} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{project.view_count}</span>
          </div>
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {project.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech_stack.map((tech, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            {project.github_url && (
              <Button asChild variant="outline" size="sm">
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-1" />
                  코드
                </a>
              </Button>
            )}
            {project.demo_url && (
              <Button asChild size="sm">
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  데모
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

#### 2.5 관리자 접근 컴포넌트

```tsx
// components/AdminAccess.tsx
'use client'
import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function AdminAccess() {
  const [clicks, setClicks] = useState(0)
  const [showDialog, setShowDialog] = useState(false)
  
  const handleSecretClick = () => {
    setClicks(prev => prev + 1)
    if (clicks >= 4) { // 5번 클릭 시
      setShowDialog(true)
      setClicks(0)
    }
  }
  
  const goToAdmin = () => {
    window.open('https://admin.yourname.dev', '_blank')
  }
  
  return (
    <>
      {/* 숨겨진 트리거 */}
      <div 
        className="fixed bottom-4 right-4 w-12 h-12 cursor-pointer opacity-20 hover:opacity-100 transition-opacity"
        onClick={handleSecretClick}
      >
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Settings className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      
      {/* 관리자 접근 다이얼로그 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>관리자 접근</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              포트폴리오 관리 페이지로 이동하시겠습니까?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                취소
              </Button>
              <Button onClick={goToAdmin}>
                관리자 페이지로 이동
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

---

### **Phase 3: 연동 및 최적화 (1-2주)**

#### 3.1 환경 변수 설정

```bash
# 공개 포트폴리오 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_URL=https://admin.yourname.dev

# 관리자 페이지 (기존 설정 유지)
VUE_APP_SUPABASE_URL=your_supabase_url
VUE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 3.2 실시간 동기화 구현

```typescript
// lib/realtime.ts
import { supabase } from './supabase'
import { useEffect } from 'react'

export function useRealtimeProjects(userId: number, onUpdate: (projects: any[]) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel(`projects:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // 프로젝트 업데이트 시 실시간 반영
          console.log('Project updated:', payload)
          // onUpdate 콜백 호출
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, onUpdate])
}
```

---

## 🎨 **최신 디자인 트렌드 적용**

### **1. 마이크로 인터랙션**

```tsx
// 호버 효과 및 애니메이션
<motion.div
  whileHover={{ scale: 1.05, rotate: 1 }}
  whileTap={{ scale: 0.95 }}
  className="project-card"
>
  {/* 카드 내용 */}
</motion.div>

// 스크롤 애니메이션
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  {/* 컨텐츠 */}
</motion.div>
```

### **2. 글라스모피즘**

```css
/* globals.css */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-card-dark {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### **3. 그라디언트 및 네온 효과**

```css
/* 그라디언트 텍스트 */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 네온 효과 */
.neon-glow {
  box-shadow: 
    0 0 5px #00f,
    0 0 10px #00f,
    0 0 15px #00f,
    0 0 20px #00f;
}
```

### **4. 다크 모드 지원**

```tsx
// components/ThemeToggle.tsx
'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

---

## 🔐 **보안 고려사항**

### **1. 관리자 접근 방법**

#### A. 숨겨진 버튼 방식 (권장)
```tsx
// 로고나 특정 영역을 5번 클릭 시 관리자 페이지로 이동
const [clickCount, setClickCount] = useState(0)

const handleSecretClick = () => {
  const newCount = clickCount + 1
  setClickCount(newCount)
  
  if (newCount >= 5) {
    window.open('https://admin.yourname.dev', '_blank')
    setClickCount(0)
  }
}
```

#### B. 키보드 단축키 방식
```tsx
// Ctrl + Shift + A 키 조합으로 관리자 페이지 접근
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault()
      window.open('https://admin.yourname.dev', '_blank')
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [])
```

#### C. URL 직접 접근
```typescript
// 관리자 페이지에서 직접 접근 제어
// src/router/index.js (Vue Router)
const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: Dashboard,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      // 인증 확인 로직
      const isAuthenticated = checkAuthStatus()
      if (isAuthenticated) {
        next()
      } else {
        next('/login')
      }
    }
  }
]
```

### **2. 인증 보안 강화**

```javascript
// JWT 토큰 만료 시간 설정
const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// 2FA 활성화 확인
const check2FA = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.app_metadata?.mfa_enabled) {
    // 2FA 인증 필요
    return true
  }
  return false
}
```

### **3. 데이터 보호**

```sql
-- 민감한 데이터 접근 제한
CREATE POLICY "Admins only can access sensitive data" ON users
FOR ALL USING (auth.uid() = auth_user_id);

-- 공개 포트폴리오에서는 필요한 데이터만 조회
CREATE VIEW public_profile AS
SELECT 
  id,
  name,
  nickname,
  bio,
  one_liner,
  github_url,
  linkedin_url,
  profile_image_url,
  created_at
FROM users
WHERE is_public = true;
```

---

## 🌐 **배포 및 도메인 설정**

### **1. 도메인 구매 및 설정**

```bash
# 도메인 구매 (권장 도메인)
yourname.dev
yourname.io
yourname.me
```

### **2. Vercel 배포 (공개 포트폴리오)**

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel

# 도메인 연결
vercel domains add yourname.dev
```

### **3. Railway 배포 (관리자 페이지)**

```bash
# Railway 서브도메인 설정
admin.yourname.dev → Railway 앱 연결
```

### **4. HTTPS 및 보안 설정**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-storage.supabase.co'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## 📊 **성능 최적화**

### **1. 이미지 최적화**

```tsx
// Next.js Image 컴포넌트 사용
import Image from 'next/image'

<Image
  src={project.image_urls[0]}
  alt={project.title}
  width={400}
  height={300}
  className="rounded-lg"
  priority={index < 3} // 첫 3개 이미지만 우선 로드
/>
```

### **2. 정적 생성 및 캐싱**

```tsx
// app/page.tsx
import { publicAPI } from '@/lib/supabase'

export async function generateStaticParams() {
  // 빌드 시 정적 생성
  return []
}

export default async function HomePage() {
  const { data: profile } = await publicAPI.getPublicProfile(1)
  const { data: projects } = await publicAPI.getPublicProjects(1)
  
  return (
    <div>
      <Hero profile={profile} />
      <ProjectsSection projects={projects} />
    </div>
  )
}
```

### **3. 번들 크기 최적화**

```javascript
// Dynamic imports 사용
const AdminAccess = dynamic(() => import('@/components/AdminAccess'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})
```

---

## 🎯 **완성 체크리스트**

### **Phase 1: 관리자 페이지 완성**
- [ ] 데이터베이스 테이블 생성
- [ ] Row Level Security 설정
- [ ] 공개 API 엔드포인트 구현
- [ ] 대시보드 실제 데이터 연동
- [ ] 프로젝트 CRUD 기능 완성
- [ ] 이미지 업로드 UI 연동

### **Phase 2: 공개 포트폴리오 구축**
- [ ] Next.js 프로젝트 생성
- [ ] 기본 컴포넌트 구현
- [ ] Supabase 연동
- [ ] 반응형 디자인 적용
- [ ] 다크 모드 지원
- [ ] 애니메이션 및 인터랙션 구현

### **Phase 3: 연동 및 배포**
- [ ] 도메인 구매 및 설정
- [ ] Vercel 배포 (공개 포트폴리오)
- [ ] Railway 도메인 연결 (관리자 페이지)
- [ ] HTTPS 설정
- [ ] 성능 최적화
- [ ] SEO 최적화

---

## 📞 **다음 단계**

1. **즉시 시작 가능한 작업**: 데이터베이스 테이블 생성 및 API 완성
2. **우선순위**: 현재 관리자 페이지 API 연동 완성
3. **병렬 작업**: 공개 포트폴리오 구조 설계 및 프로토타입 제작

이 가이드를 따라 구현하면 현대적이고 전문적인 포트폴리오 시스템을 구축할 수 있습니다! 🚀

---

*작성일: 2025-07-17*  
*버전: 1.0*  
*상태: 구현 대기*