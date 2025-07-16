<template>
  <div class="post-list">
    <div class="page-header">
      <div class="header-content">
        <h1>📋 프로젝트 관리</h1>
        <p>등록된 프로젝트를 관리하고 편집하세요</p>
      </div>
      <router-link to="/create-post" class="btn-add-project">
        ✏️ 새 프로젝트 추가
      </router-link>
    </div>

    <!-- 검색 및 필터 영역 -->
    <div class="search-filter-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="프로젝트 제목, 설명, 기술 스택으로 검색..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
            ✕
          </button>
        </div>
        <button @click="refreshProjects" class="refresh-btn" :disabled="loading">
          🔄 새로고침
        </button>
      </div>

      <div class="filter-container">
        <div class="tech-filter">
          <label>기술 스택 필터:</label>
          <select v-model="selectedTechFilter" class="tech-select">
            <option value="">전체 기술 스택</option>
            <option v-for="tech in availableTechStacks" :key="tech" :value="tech">
              {{ tech }}
            </option>
          </select>
        </div>
        
        <div class="results-info">
          <span v-if="searchQuery || selectedTechFilter">
            {{ displayedProjects.length }}개의 프로젝트 찾음
          </span>
          <span v-else>
            총 {{ totalProjects }}개의 프로젝트
          </span>
        </div>
      </div>
    </div>

    <!-- 공통 토스트 메시지 -->
    <ToastMessage :message="message" @close="clearMessage" />

    <!-- 공통 로딩 스피너 -->
    <LoadingSpinner v-if="loading" :message="loadingMessage" />

    <!-- 프로젝트 그리드 -->
    <div v-if="displayedProjects.length > 0" class="projects-grid">
      <div
        v-for="project in displayedProjects"
        :key="project.id"
        class="project-card"
        @click="openProjectModal(project)"
      >
        <div class="project-image">
          <img
            :data-src="project.image"
            :src="project.image || 'https://placehold.co/400x250/e9ecef/6c757d?text=No+Image'"
            :alt="project.title"
            @error="handleImageError"
            class="lazy-image"
          />
          <div class="project-status" :class="project.status">
            {{ project.status === 'active' ? '진행중' : '완료' }}
          </div>
          <div class="project-views">
            👁️ {{ project.viewCount || 0 }}
          </div>
        </div>

        <div class="project-info">
          <h3>{{ project.title }}</h3>
          <p class="project-description">{{ project.description }}</p>

          <div class="project-tech">
            <span
              v-for="tech in project.techStack"
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </span>
          </div>

          <div class="project-meta">
            <span class="date">{{ formatDate(project.startDate) }}</span>
            <div class="project-actions" @click.stop>
              <button @click="editProject(project)" class="btn-edit">
                수정
              </button>
              <button @click="confirmDelete(project)" class="btn-delete">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 더 보기 버튼 -->
    <div v-if="hasMore" class="load-more-container">
      <button @click="loadMore" class="btn-load-more" :disabled="isLoadingMore">
        <span v-if="isLoadingMore">
          <div class="loading-spinner small"></div>
          로딩 중...
        </span>
        <span v-else>더 보기 ({{ totalProjects - displayedProjects.length }}개 더)</span>
      </button>
    </div>

    <!-- 빈 상태 -->
    <div v-else-if="!isLoading && displayedProjects.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3 v-if="searchQuery || selectedTechFilter">검색 결과가 없습니다</h3>
      <h3 v-else>아직 등록된 프로젝트가 없습니다</h3>
      <p v-if="searchQuery || selectedTechFilter">
        다른 검색어나 필터를 시도해보세요.
      </p>
      <p v-else>첫 번째 프로젝트를 추가해보세요!</p>
      
      <div class="empty-actions">
        <button v-if="searchQuery || selectedTechFilter" @click="clearSearch" class="btn-empty-clear">
          필터 초기화
        </button>
        <router-link to="/create-post" class="btn-empty-add">
          프로젝트 추가하기
        </router-link>
      </div>
    </div>

    <div v-if="selectedProject" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedProject.title }}</h2>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>

        <div class="modal-body">
          <img
            :src="selectedProject.image || '/placeholder-image.jpg'"
            :alt="selectedProject.title"
            class="modal-image"
          />

          <div class="modal-info">
            <p class="modal-description">{{ selectedProject.description }}</p>

            <div class="modal-links">
              <a
                v-if="selectedProject.projectUrl"
                :href="selectedProject.projectUrl"
                target="_blank"
                class="project-link"
              >
                🌐 프로젝트 보기
              </a>
              <a
                v-if="selectedProject.githubUrl"
                :href="selectedProject.githubUrl"
                target="_blank"
                class="github-link"
              >
                📱 GitHub 보기
              </a>
            </div>

            <div class="modal-tech">
              <h4>사용 기술</h4>
              <div class="tech-list">
                <span
                  v-for="tech in selectedProject.techStack"
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <div class="modal-period">
              <h4>프로젝트 기간</h4>
              <p>
                {{ formatDate(selectedProject.startDate) }} ~
                {{ selectedProject.endDate ? formatDate(selectedProject.endDate) : '진행중' }}
              </p>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="editProject(selectedProject)" class="btn-modal-edit">
            수정하기
          </button>
          <button @click="confirmDelete(selectedProject)" class="btn-modal-delete">
            삭제하기
          </button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h2>프로젝트 삭제</h2>
        </div>
        
        <div class="modal-body">
          <div class="delete-warning">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <p><strong>"{{ projectToDelete?.title }}"</strong> 프로젝트를 정말로 삭제하시겠습니까?</p>
              <p class="warning-sub">이 작업은 되돌릴 수 없습니다.</p>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-modal-cancel">
            취소
          </button>
          <button @click="deleteProject" class="btn-modal-delete-confirm">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectAPI } from '@/services/projectService'
import { messageMixin, loadingMixin } from "@/utils/messageUtils";
import ToastMessage from "@/components/ToastMessage.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "PostListPage",
  mixins: [messageMixin, loadingMixin],
  components: {
    ToastMessage,
    LoadingSpinner
  },
  data() {
    return {
      selectedProject: null,
      
      // 프로젝트 데이터
      projects: [],
      filteredProjects: [],
      
      // 검색 및 필터링
      searchQuery: '',
      selectedTechFilter: '',
      availableTechStacks: [],
      
      // 페이지네이션
      currentPage: 1,
      itemsPerPage: 12,
      totalProjects: 0,
      hasMore: false,
      
      // 로딩 및 에러 상태
      isLoadingMore: false,
      
      // 모달 상태
      showDeleteModal: false,
      projectToDelete: null,
      
      // Lazy loading
      lazyLoadObserver: null,
      
      // 검색 디바운스
      debounceSearch: null
    };
  },
  mounted() {
    this.loadProjects();
    this.initializeLazyLoading();
  },

  beforeUnmount() {
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.disconnect();
    }
  },

  computed: {
    displayedProjects() {
      return this.filteredProjects.length > 0 ? this.filteredProjects : this.projects;
    }
  },

  watch: {
    searchQuery(newQuery) {
      this.debounceSearch(newQuery);
    },
    selectedTechFilter(newTech) {
      this.applyFilters();
    }
  },

  methods: {
    // 프로젝트 목록 로드
    async loadProjects(append = false) {
      try {
        if (!append) {
          this.startLoading('프로젝트 목록을 불러오는 중...');
          this.currentPage = 1;
        } else {
          this.isLoadingMore = true;
        }

        const filters = {
          page: this.currentPage,
          limit: this.itemsPerPage,
          search: this.searchQuery,
          techStack: this.selectedTechFilter ? [this.selectedTechFilter] : [],
          sortBy: 'created_at',
          sortOrder: 'desc'
        };

        const result = await projectAPI.getProjects(filters);

        if (result.success) {
          const newProjects = result.data.projects.map(this.normalizeProject);
          
          if (append) {
            this.projects.push(...newProjects);
          } else {
            this.projects = newProjects;
          }

          this.totalProjects = result.data.pagination.total;
          this.hasMore = result.data.pagination.page < result.data.pagination.totalPages;
          
          this.extractTechStacks();
          this.applyFilters();

        } else {
          this.showErrorMessage(result.error || '프로젝트 목록을 불러오는데 실패했습니다.');
        }

      } catch (error) {
        console.error('프로젝트 목록 로드 오류:', error);
        this.showErrorMessage('프로젝트 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        this.stopLoading();
        this.isLoadingMore = false;
      }
    },

    // 더 많은 프로젝트 로드
    async loadMore() {
      if (this.hasMore && !this.isLoadingMore) {
        this.currentPage++;
        await this.loadProjects(true);
      }
    },

    // 데이터 정규화 (API 응답 → 화면 표시 형식)
    normalizeProject(project) {
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image_urls && project.image_urls.length > 0 ? project.image_urls[0] : null,
        projectUrl: project.demo_url,
        githubUrl: project.github_url,
        startDate: project.start_date,
        endDate: project.end_date,
        status: project.end_date ? 'completed' : 'active',
        techStack: project.tech_stack || [],
        viewCount: project.view_count || 0,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      };
    },

    // 기술 스택 목록 추출
    extractTechStacks() {
      const techSet = new Set();
      this.projects.forEach(project => {
        if (project.techStack) {
          project.techStack.forEach(tech => techSet.add(tech));
        }
      });
      this.availableTechStacks = Array.from(techSet).sort();
    },

    
    // 필터 적용
    applyFilters() {
      let filtered = [...this.projects];

      // 검색 필터
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.techStack.some(tech => tech.toLowerCase().includes(query))
        );
      }

      // 기술 스택 필터
      if (this.selectedTechFilter) {
        filtered = filtered.filter(project => 
          project.techStack.includes(this.selectedTechFilter)
        );
      }

      this.filteredProjects = filtered;
    },

    // 검색 초기화
    clearSearch() {
      this.searchQuery = '';
      this.selectedTechFilter = '';
      this.applyFilters();
    },

    // 모달 관련
    openProjectModal(project) {
      this.selectedProject = project;
    },

    closeModal() {
      this.selectedProject = null;
    },

    // 프로젝트 편집
    editProject(project) {
      this.closeModal();
      // 편집 페이지로 이동 (나중에 구현)
      this.$router.push(`/edit-post/${project.id}`);
    },

    // 프로젝트 삭제 확인
    confirmDelete(project) {
      this.projectToDelete = project;
      this.showDeleteModal = true;
      this.closeModal();
    },

    // 프로젝트 삭제 취소
    cancelDelete() {
      this.showDeleteModal = false;
      this.projectToDelete = null;
    },

    // 프로젝트 삭제 실행
    async deleteProject() {
      if (!this.projectToDelete) return;

      try {
        const result = await projectAPI.deleteProject(this.projectToDelete.id);
        
        if (result.success) {
          // 목록에서 제거
          this.projects = this.projects.filter(p => p.id !== this.projectToDelete.id);
          this.applyFilters();
          
          this.showDeleteModal = false;
          this.projectToDelete = null;
          
          // 성공 메시지
          this.showSuccessMessage('프로젝트가 성공적으로 삭제되었습니다.');
          
        } else {
          throw new Error(result.error || '프로젝트 삭제에 실패했습니다.');
        }

      } catch (error) {
        console.error('프로젝트 삭제 오류:', error);
        this.showErrorMessage('프로젝트 삭제 중 오류가 발생했습니다.');
      }
    },

    // 날짜 포맷팅
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    },

    // 이미지 에러 처리
    handleImageError(event) {
      event.target.src = "https://placehold.co/400x250/e9ecef/6c757d?text=No+Image";
    },

    // Lazy Loading 초기화
    initializeLazyLoading() {
      this.lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              this.lazyLoadObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });
    },

    // 이미지 Lazy Loading 적용
    applyLazyLoading() {
      this.$nextTick(() => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          this.lazyLoadObserver.observe(img);
        });
      });
    },

    // 새로고침
    async refreshProjects() {
      this.currentPage = 1;
      await this.loadProjects();
    },

    // 디바운스 헬퍼 함수
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  },

  // 검색 디바운스 생성
  created() {
    this.debounceSearch = this.debounce((query) => {
      this.applyFilters();
    }, 300);
  }
};
</script>

<style scoped>
.post-list {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header-content h1 {
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 5px;
}

.header-content p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.btn-add-project {
  background: #42b883;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-add-project:hover {
  background: #369870;
}

/* 검색 및 필터 섹션 */
.search-filter-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.search-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b883;
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.clear-search-btn:hover {
  background: #f8f9fa;
}

.refresh-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e9ecef;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.refresh-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.tech-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tech-filter label {
  font-weight: 600;
  color: #495057;
}

.tech-select {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  min-width: 150px;
}

.tech-select:focus {
  outline: none;
  border-color: #42b883;
}

.results-info {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 에러 메시지 */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-icon {
  font-size: 1.2rem;
}

.retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: auto;
}

.retry-btn:hover {
  background: #c82333;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin-bottom: 0;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #6c757d;
  margin: 0;
}

/* 프로젝트 그리드 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.project-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.project-status.active {
  background: #28a745;
  color: white;
}

.project-status.completed {
  background: #6c757d;
  color: white;
}

.project-views {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.lazy-image {
  transition: opacity 0.3s ease;
}

.lazy-image[data-src] {
  opacity: 0.7;
}

.project-info {
  padding: 20px;
}

.project-info h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.project-description {
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tech-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  color: #6c757d;
  font-size: 0.9rem;
}

.project-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-edit:hover {
  background: #0056b3;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

/* 더 보기 버튼 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px;
}

.btn-load-more {
  background: #42b883;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-load-more:hover:not(:disabled) {
  background: #369870;
  transform: translateY(-2px);
}

.btn-load-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 빈 상태 개선 */
.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-empty-clear {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #dee2e6;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-empty-clear:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 30px;
}

.btn-empty-add {
  background: #42b883;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-empty-add:hover {
  background: #369870;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f8f9fa;
  border-radius: 50%;
}

.modal-body {
  padding: 20px;
}

.modal-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.modal-description {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 20px;
}

.modal-links {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.project-link, .github-link {
  padding: 10px 15px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease;
}

.project-link {
  background: #007bff;
  color: white;
}

.github-link {
  background: #6c757d;
  color: white;
}

.project-link:hover, .github-link:hover {
  opacity: 0.8;
}

.modal-tech h4, .modal-period h4 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tech-list .tech-tag {
  background: #42b883;
  color: white;
}

.modal-period p {
  color: #495057;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 15px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-modal-edit, .btn-modal-delete {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-modal-edit {
  background: #007bff;
  color: white;
}

.btn-modal-delete {
  background: #dc3545;
  color: white;
}

.btn-modal-edit:hover, .btn-modal-delete:hover {
  opacity: 0.8;
}

/* 삭제 확인 모달 */
.delete-modal {
  max-width: 500px;
}

.delete-warning {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin-bottom: 20px;
}

.warning-icon {
  font-size: 2rem;
  color: #856404;
}

.warning-text p {
  margin: 0 0 10px 0;
  color: #856404;
}

.warning-text .warning-sub {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.btn-modal-cancel {
  flex: 1;
  padding: 12px;
  border: 2px solid #6c757d;
  background: white;
  color: #6c757d;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-modal-cancel:hover {
  background: #6c757d;
  color: white;
}

.btn-modal-delete-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-modal-delete-confirm:hover {
  background: #c82333;
}

/* 반응형 */
@media (max-width: 768px) {
  .post-list {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .search-container {
    flex-direction: column;
  }

  .filter-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-meta {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-links {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }

  .empty-actions {
    flex-direction: column;
  }

  .btn-load-more {
    font-size: 0.9rem;
    padding: 12px 24px;
  }
}
</style>