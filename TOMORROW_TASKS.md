# 🚀 내일 할 작업 (2025-07-16)

## 🎯 내일의 목표
페이지 API 연동 구현 - Dashboard, CreatePost, PostList 완성

---

## 📋 작업 우선순위

### 🔥 1순위: Dashboard.vue 업데이트
**예상 소요시간**: 1-2시간  
**난이도**: ⭐⭐☆☆☆ (쉬움)

### 🔥 2순위: CreatePost.vue 완성
**예상 소요시간**: 2-3시간  
**난이도**: ⭐⭐⭐☆☆ (보통)

### 🔥 3순위: PostList.vue 완성
**예상 소요시간**: 2-3시간  
**난이도**: ⭐⭐⭐⭐☆ (어려움)

---

## 🔧 1. Dashboard.vue 업데이트

### 📊 구현할 기능
- [ ] **실시간 통계 데이터 로딩**
- [ ] **통계 카드 동적 데이터 바인딩**
- [ ] **최근 활동 목록 실시간 업데이트**
- [ ] **로딩 상태 및 에러 처리**
- [ ] **새로고침 기능 추가**

### 💻 구현 코드
```vue
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
        
        await this.loadDashboardStats()
        await this.loadRecentActivities()
        
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async loadDashboardStats() {
      const result = await statisticsAPI.getDashboardStats()
      if (result.success) {
        this.stats = result.data
      }
    },
    
    async loadRecentActivities() {
      const result = await statisticsAPI.getRecentActivities()
      if (result.success) {
        this.recentActivities = result.data
      }
    },
    
    async refreshData() {
      await this.loadDashboardData()
    }
  }
}
</script>
```

### 🎨 UI 수정사항
- 하드코딩된 숫자들을 `stats` 객체의 데이터로 변경
- 로딩 스피너 추가
- 에러 메시지 표시 영역 추가
- 새로고침 버튼 추가

---

## 📝 2. CreatePost.vue 완성

### 🔧 구현할 기능
- [ ] **프로젝트 생성 API 연동**
- [ ] **이미지 업로드 기능 구현**
- [ ] **폼 검증 강화**
- [ ] **진행률 표시**
- [ ] **임시 저장 기능**

### 💻 구현 코드
```vue
<script>
import { projectAPI } from '@/services/projectService'
import { imageAPI } from '@/services/imageService'
import { authAPI } from '@/config/supabase'

export default {
  name: "CreatePostPage",
  data() {
    return {
      projectForm: {
        title: "",
        description: "",
        demo_url: "",
        github_url: "",
        start_date: "",
        end_date: "",
        tech_stack: [],
        images: []
      },
      isSubmitting: false,
      uploadProgress: 0,
      errors: {}
    }
  },
  
  methods: {
    async submitProject() {
      if (!this.validateForm()) return
      
      this.isSubmitting = true
      
      try {
        const currentUser = await authAPI.getCurrentUser()
        if (!currentUser) {
          this.$router.push('/login')
          return
        }
        
        // 프로젝트 데이터 준비
        const projectData = {
          title: this.projectForm.title,
          description: this.projectForm.description,
          demo_url: this.projectForm.demo_url,
          github_url: this.projectForm.github_url,
          start_date: this.projectForm.start_date,
          end_date: this.projectForm.end_date,
          tech_stack: this.projectForm.tech_stack,
          user_id: currentUser.id
        }
        
        // 프로젝트 생성
        const result = await projectAPI.createProject(projectData)
        
        if (result.success) {
          // 이미지 업로드 (있는 경우)
          if (this.projectForm.images && this.projectForm.images.length > 0) {
            await this.uploadImages(result.data.id)
          }
          
          // 성공 모달 표시
          this.showSuccessModal('프로젝트 생성 완료', '프로젝트가 성공적으로 생성되었습니다!', '/post-list')
        } else {
          throw new Error(result.error)
        }
        
      } catch (error) {
        console.error('프로젝트 생성 실패:', error)
        this.showErrorMessage('프로젝트 생성 중 오류가 발생했습니다.')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async uploadImages(projectId) {
      const uploadResult = await imageAPI.uploadProjectImages(
        projectId,
        this.projectForm.images,
        (progress) => {
          this.uploadProgress = progress
        }
      )
      
      if (!uploadResult.success) {
        console.error('이미지 업로드 실패:', uploadResult.error)
      }
    },
    
    validateForm() {
      this.errors = {}
      
      if (!this.projectForm.title.trim()) {
        this.errors.title = '프로젝트 제목은 필수입니다.'
      }
      
      if (!this.projectForm.description.trim()) {
        this.errors.description = '프로젝트 설명은 필수입니다.'
      }
      
      if (!this.projectForm.start_date) {
        this.errors.start_date = '시작일은 필수입니다.'
      }
      
      // URL 유효성 검사
      if (this.projectForm.github_url && !this.isValidUrl(this.projectForm.github_url)) {
        this.errors.github_url = '올바른 GitHub URL을 입력해주세요.'
      }
      
      if (this.projectForm.demo_url && !this.isValidUrl(this.projectForm.demo_url)) {
        this.errors.demo_url = '올바른 데모 URL을 입력해주세요.'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidUrl(url) {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    },
    
    // 임시 저장 기능
    saveToLocal() {
      localStorage.setItem('draft_project', JSON.stringify(this.projectForm))
    },
    
    loadFromLocal() {
      const draft = localStorage.getItem('draft_project')
      if (draft) {
        this.projectForm = JSON.parse(draft)
      }
    }
  },
  
  mounted() {
    this.loadFromLocal()
  }
}
</script>
```

### 🎨 UI 수정사항
- 에러 메시지 표시 영역 추가
- 진행률 바 추가
- 임시 저장 버튼 추가
- 로딩 상태 표시 개선

---

## 📋 3. PostList.vue 완성

### 🔧 구현할 기능
- [ ] **프로젝트 목록 API 연동**
- [ ] **검색 및 필터링 기능**
- [ ] **무한 스크롤 또는 페이지네이션**
- [ ] **프로젝트 편집/삭제 기능**
- [ ] **이미지 lazy loading**

### 💻 구현 코드
```vue
<script>
import { projectAPI } from '@/services/projectService'
import { authAPI } from '@/config/supabase'

export default {
  name: "PostListPage",
  data() {
    return {
      projects: [],
      loading: true,
      currentPage: 1,
      pageSize: 10,
      searchQuery: '',
      selectedTechFilter: '',
      hasMore: true,
      error: null
    }
  },
  
  async mounted() {
    await this.loadProjects()
  },
  
  methods: {
    async loadProjects() {
      try {
        this.loading = true
        this.error = null
        
        const currentUser = await authAPI.getCurrentUser()
        if (!currentUser) {
          this.$router.push('/login')
          return
        }
        
        const result = await projectAPI.getProjects(currentUser.id, {
          page: this.currentPage,
          limit: this.pageSize,
          search: this.searchQuery,
          techStack: this.selectedTechFilter
        })
        
        if (result.success) {
          if (this.currentPage === 1) {
            this.projects = result.data.projects
          } else {
            this.projects = [...this.projects, ...result.data.projects]
          }
          this.hasMore = result.data.hasMore
        } else {
          this.error = result.error
        }
        
      } catch (error) {
        console.error('프로젝트 로드 실패:', error)
        this.error = '프로젝트 목록을 불러오는 중 오류가 발생했습니다.'
      } finally {
        this.loading = false
      }
    },
    
    async editProject(project) {
      // 편집 페이지로 이동 (쿼리 파라미터로 프로젝트 ID 전달)
      this.$router.push(`/create-post?edit=${project.id}`)
    },
    
    async deleteProject(projectId) {
      if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return
      
      try {
        const result = await projectAPI.deleteProject(projectId)
        if (result.success) {
          // 목록에서 제거
          this.projects = this.projects.filter(p => p.id !== projectId)
          this.showSuccessMessage('프로젝트가 삭제되었습니다.')
        } else {
          this.showErrorMessage('프로젝트 삭제 중 오류가 발생했습니다.')
        }
      } catch (error) {
        console.error('프로젝트 삭제 실패:', error)
        this.showErrorMessage('프로젝트 삭제 중 오류가 발생했습니다.')
      }
    },
    
    // 검색 및 필터링
    async searchProjects() {
      this.currentPage = 1
      await this.loadProjects()
    },
    
    async filterByTech(techName) {
      this.selectedTechFilter = techName
      this.currentPage = 1
      await this.loadProjects()
    },
    
    // 무한 스크롤
    async loadMore() {
      if (!this.hasMore || this.loading) return
      
      this.currentPage++
      await this.loadProjects()
    },
    
    // 이미지 lazy loading
    handleImageError(event) {
      event.target.src = '/placeholder-image.jpg'
    }
  }
}
</script>
```

### 🎨 UI 수정사항
- 검색 입력창 추가
- 기술 스택 필터 버튼 추가
- 무한 스크롤 또는 "더 보기" 버튼 추가
- 편집/삭제 확인 모달 추가

---

## 🛠️ 공통 작업사항

### 1. 에러 처리 표준화
```javascript
// 모든 페이지에서 사용할 공통 에러 처리
showErrorMessage(message) {
  // 토스트 메시지 또는 모달로 에러 표시
  this.message = {
    text: message,
    type: 'error'
  }
  
  // 3초 후 자동 제거
  setTimeout(() => {
    this.message = { text: '', type: '' }
  }, 3000)
}

showSuccessMessage(message) {
  this.message = {
    text: message,
    type: 'success'
  }
  
  setTimeout(() => {
    this.message = { text: '', type: '' }
  }, 3000)
}
```

### 2. 로딩 상태 표준화
```vue
<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>데이터를 불러오는 중...</p>
  </div>
</template>

<style>
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

---

## 🧪 테스트 계획

### 각 페이지별 테스트
1. **Dashboard.vue**
   - [ ] 로그인 후 통계 데이터 정상 표시
   - [ ] 새로고침 버튼 동작 확인
   - [ ] 에러 상황 처리 확인

2. **CreatePost.vue**
   - [ ] 프로젝트 생성 전체 플로우 테스트
   - [ ] 이미지 업로드 테스트
   - [ ] 폼 검증 테스트
   - [ ] 임시 저장 기능 테스트

3. **PostList.vue**
   - [ ] 프로젝트 목록 로드 테스트
   - [ ] 검색 및 필터링 테스트
   - [ ] 편집/삭제 기능 테스트
   - [ ] 무한 스크롤 테스트

---

## 🚀 작업 순서

### 오전 (09:00-12:00)
1. **Dashboard.vue 업데이트** (1-2시간)
   - API 연동 및 테스트
   - 로딩 상태 및 에러 처리 추가

### 오후 (13:00-18:00)
2. **CreatePost.vue 완성** (2-3시간)
   - 프로젝트 생성 API 연동
   - 이미지 업로드 기능 구현
   - 폼 검증 강화

3. **PostList.vue 완성** (2-3시간)
   - 프로젝트 목록 API 연동
   - 검색 및 CRUD 기능 구현

### 마무리 (18:00-19:00)
4. **전체 테스트 및 디버깅**
   - 모든 페이지 통합 테스트
   - 버그 수정 및 최적화

---

## 📋 완료 체크리스트

### Dashboard.vue
- [ ] 실시간 통계 데이터 로딩
- [ ] 최근 활동 목록 표시
- [ ] 로딩 상태 표시
- [ ] 에러 처리
- [ ] 새로고침 기능

### CreatePost.vue
- [ ] 프로젝트 생성 API 연동
- [ ] 이미지 업로드 기능
- [ ] 폼 검증 강화
- [ ] 진행률 표시
- [ ] 임시 저장 기능

### PostList.vue
- [ ] 프로젝트 목록 API 연동
- [ ] 검색 및 필터링
- [ ] 페이지네이션
- [ ] 편집/삭제 기능
- [ ] 이미지 lazy loading

### 공통 작업
- [ ] 에러 처리 표준화
- [ ] 로딩 상태 표준화
- [ ] 전체 테스트 완료
- [ ] Git 커밋 및 푸시

---

## 📝 주의사항

### 개발 시 유의점
1. **인증 확인**: 모든 API 호출 전에 사용자 인증 상태 확인
2. **에러 처리**: 네트워크 오류, API 오류 등 모든 경우 처리
3. **사용자 경험**: 로딩 상태, 피드백 메시지 필수 제공
4. **코드 품질**: 기존 코드 스타일 및 패턴 유지

### 참고 자료
- `src/views/Profile.vue` - 완성된 API 연동 예시
- `src/services/` - 모든 API 서비스 파일들
- `API_INTEGRATION_PROGRESS.md` - 상세한 구현 가이드

---

**작업 예정일**: 2025-07-16  
**목표 완성 시간**: 오후 7시  
**브랜치**: `feature/page-api-connect`