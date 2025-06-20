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

    <!-- 프로젝트 목록 -->
    <div v-if="projects.length > 0" class="projects-grid">
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

    <!-- 빈 상태 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>아직 등록된 프로젝트가 없습니다</h3>
      <p>첫 번째 프로젝트를 추가해보세요!</p>
      <router-link to="/create-post" class="btn-empty-add">
        프로젝트 추가하기
      </router-link>
    </div>

    <!-- 프로젝트 상세 모달 -->
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
export default {
  name: "PostListPage",
  data() {
    return {
      selectedProject: null,
      // 임시 데이터 (나중에 API에서 가져올 데이터)
      projects: [
        {
          id: 1,
          title: "Todo List App",
          description: "Vue.js와 Firebase를 사용한 실시간 할 일 관리 애플리케이션입니다. 사용자가 쉽게 할 일을 추가, 수정, 삭제할 수 있으며 실시간으로 동기화됩니다.",
          image: "https://via.placeholder.com/400x250/42b883/ffffff?text=Todo+App",
          projectUrl: "https://todo-app-demo.com",
          githubUrl: "https://github.com/user/todo-app",
          startDate: "2024-01-15",
          endDate: "2024-03-20",
          status: "completed",
          techStack: ["Vue.js", "Firebase", "CSS3", "JavaScript"]
        },
        {
          id: 2,
          title: "E-Commerce Platform",
          description: "React와 Node.js로 구현한 풀스택 온라인 쇼핑몰 플랫폼입니다. 상품 관리, 주문 처리, 결제 시스템을 포함합니다.",
          image: "https://via.placeholder.com/400x250/764ba2/ffffff?text=E-Commerce",
          projectUrl: "https://shop-demo.com",
          githubUrl: "https://github.com/user/ecommerce",
          startDate: "2024-04-01",
          endDate: null,
          status: "active",
          techStack: ["React", "Node.js", "MongoDB", "Express"]
        },
        {
          id: 3,
          title: "Weather Dashboard",
          description: "OpenWeather API를 활용한 실시간 날씨 정보 대시보드입니다. 차트와 그래프로 날씨 데이터를 시각화합니다.",
          image: "https://via.placeholder.com/400x250/667eea/ffffff?text=Weather",
          projectUrl: "https://weather-dashboard.com",
          githubUrl: "https://github.com/user/weather-app",
          startDate: "2023-11-10",
          endDate: "2023-12-15",
          status: "completed",
          techStack: ["JavaScript", "Chart.js", "Weather API", "CSS Grid"]
        },
        {
          id: 4,
          title: "Portfolio Website",
          description: "개인 포트폴리오 웹사이트입니다. 반응형 디자인과 다크모드를 지원하며, 애니메이션 효과가 적용되어 있습니다.",
          image: "https://via.placeholder.com/400x250/f093fb/ffffff?text=Portfolio",
          projectUrl: "https://my-portfolio.com",
          githubUrl: "https://github.com/user/portfolio",
          startDate: "2023-08-01",
          endDate: "2023-09-30",
          status: "completed",
          techStack: ["HTML5", "SCSS", "JavaScript", "AOS"]
        },
        {
          id: 5,
          title: "Task Management Tool",
          description: "팀 협업을 위한 태스크 관리 도구입니다. 칸반 보드 스타일의 UI와 실시간 협업 기능을 제공합니다.",
          image: "https://via.placeholder.com/400x250/4ecdc4/ffffff?text=Task+Tool",
          projectUrl: "https://task-manager.com",
          githubUrl: "https://github.com/user/task-manager",
          startDate: "2024-02-01",
          endDate: null,
          status: "active",
          techStack: ["Vue.js", "Vuex", "Socket.io", "Node.js"]
        }
      ]
    };
  },
  methods: {
    openProjectModal(project) {
      this.selectedProject = project;
    },
    closeModal() {
      this.selectedProject = null;
    },
    editProject(project) {
      // 임시 편집 로직
      console.log("프로젝트 편집:", project);
      alert(`"${project.title}" 프로젝트를 편집합니다.`);
      this.closeModal();
    },
    deleteProject(projectId) {
      if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.closeModal();
        alert("프로젝트가 삭제되었습니다.");
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
      event.target.src = "https://via.placeholder.com/400x250/e9ecef/6c757d?text=No+Image";
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