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

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>프로젝트를 불러오는 중...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>오류가 발생했습니다</h3>
      <p>{{ error }}</p>
      <button @click="loadProjects" class="btn-retry">다시 시도</button>
    </div>

    <div v-else-if="projects.length > 0" class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        @click="openProjectModal(project)"
      >
        <div class="project-image">
          <img
            :src="project.image || '/placeholder-image.jpg'"
            :alt="project.title"
            @error="handleImageError"
          />
          <div class="project-status" :class="project.status">
            {{ project.status === 'active' ? '진행중' : '완료' }}
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
              <button @click="deleteProject(project.id)" class="btn-delete">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>아직 등록된 프로젝트가 없습니다</h3>
      <p>첫 번째 프로젝트를 추가해보세요!</p>
      <router-link to="/create-post" class="btn-empty-add">
        프로젝트 추가하기
      </router-link>
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
          <button @click="deleteProject(selectedProject.id)" class="btn-modal-delete">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectAPI } from '@/services/projectService';

export default {
  name: "PostListPage",
  data() {
    return {
      selectedProject: null,
      projects: [],
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      }
    };
  },
  async created() {
    await this.loadProjects();
  },
  methods: {
    async loadProjects() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await projectAPI.getProjects({
          page: this.pagination.page,
          limit: this.pagination.limit,
          sortBy: 'created_at',
          sortOrder: 'desc'
        });
        
        if (response.success) {
          // API 응답 데이터를 UI에 맞게 변환
          this.projects = response.data.projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image_urls && project.image_urls[0] || null,
            projectUrl: project.demo_url,
            githubUrl: project.github_url,
            startDate: project.start_date,
            endDate: project.end_date,
            status: project.end_date ? 'completed' : 'active',
            techStack: project.tech_stack || []
          }));
          
          this.pagination = response.data.pagination;
        } else {
          this.error = response.error;
          console.error('프로젝트 로드 실패:', response.error);
        }
      } catch (error) {
        this.error = '프로젝트를 불러오는 중 오류가 발생했습니다.';
        console.error('프로젝트 로드 예외:', error);
      } finally {
        this.loading = false;
      }
    },
    openProjectModal(project) {
      this.selectedProject = project;
    },
    closeModal() {
      this.selectedProject = null;
    },
    editProject(project) {
      // 편집 페이지로 이동
      this.$router.push({
        name: 'EditPost',
        params: { id: project.id }
      });
      this.closeModal();
    },
    async deleteProject(projectId) {
      if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
        this.loading = true;
        
        try {
          const response = await projectAPI.deleteProject(projectId);
          
          if (response.success) {
            // 로컬 상태에서 제거
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.closeModal();
            alert("프로젝트가 삭제되었습니다.");
            
            // 프로젝트 목록 새로고침
            await this.loadProjects();
          } else {
            alert(`프로젝트 삭제 실패: ${response.error}`);
          }
        } catch (error) {
          console.error('프로젝트 삭제 예외:', error);
          alert('프로젝트 삭제 중 오류가 발생했습니다.');
        } finally {
          this.loading = false;
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    },
    handleImageError(event) {
      event.target.src = "https://placehold.co/400x250/e9ecef/6c757d?text=No+Image";
    }
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

/* 로딩 상태 */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b883;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #6c757d;
  font-size: 1.1rem;
}

/* 오류 상태 */
.error-state {
  text-align: center;
  padding: 80px 20px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state h3 {
  color: #dc3545;
  margin-bottom: 10px;
}

.error-state p {
  color: #6c757d;
  margin-bottom: 30px;
}

.btn-retry {
  background: #42b883;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-retry:hover {
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
}
</style>