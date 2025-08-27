<template>
  <div class="admin-page post-list">
    <div class="admin-container">
      <!-- 페이지 헤더 -->
      <div class="page-header">
        <h1>프로젝트 목록</h1>
        <p>작성한 모든 프로젝트를 관리하고 편집하세요</p>
      </div>

      <!-- 액션 바 -->
      <div class="action-bar">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="프로젝트 검색..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- 필터 태그 -->
      <div class="filter-tags">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectedCategory = category.value"
          :class="[
            'filter-tag',
            { active: selectedCategory === category.value },
          ]"
        >
          {{ category.icon }} {{ category.label }}
        </button>
      </div>

      <!-- 프로젝트 그리드 -->
      <div
        v-if="!loading && filteredProjects.length > 0"
        class="projects-grid"
      >
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
        >
          <!-- 프로젝트 이미지 -->
          <div class="project-image">
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              @error="handleImageError"
            />
            <div v-else class="image-placeholder">
              <span>📂</span>
            </div>
            <div v-if="project.isFeatured" class="featured-badge">
              ⭐ 주요 프로젝트
            </div>
          </div>

          <!-- 프로젝트 내용 -->
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">
              {{ truncateText(project.description, 100) }}
            </p>

            <!-- 기술 스택 -->
            <div
              v-if="project.techStack && project.techStack.length > 0"
              class="project-tech"
            >
              <span
                v-for="(tech, index) in project.techStack.slice(0, 3)"
                :key="index"
                class="tech-badge"
              >
                {{ tech }}
              </span>
              <span v-if="project.techStack.length > 3" class="tech-more">
                +{{ project.techStack.length - 3 }}
              </span>
            </div>

            <!-- 프로젝트 메타 정보 -->
            <div class="project-meta">
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ formatDate(project.startDate) }}
              </span>
              <span v-if="project.viewCount" class="meta-item">
                <span class="meta-icon">👁️</span>
                {{ project.viewCount }}
              </span>
            </div>

            <!-- 액션 버튼 -->
            <div class="project-actions">
              <button @click="editProject(project)" class="action-btn edit">
                ✏️ 수정
              </button>
              <button @click="viewProject(project)" class="action-btn view">
                👁️ 보기
              </button>
              <button
                @click="deleteProject(project.id)"
                class="action-btn delete"
              >
                🗑️ 삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div
        v-else-if="!loading && filteredProjects.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">📭</div>
        <h3>프로젝트가 없습니다</h3>
        <p v-if="searchQuery">검색 결과가 없습니다</p>
        <p v-else>첫 번째 프로젝트를 만들어보세요!</p>
        <router-link to="/admin/create-post" class="btn btn-primary">
          프로젝트 만들기
        </router-link>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>프로젝트를 불러오는 중...</p>
      </div>
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
                {{
                  selectedProject.endDate
                    ? formatDate(selectedProject.endDate)
                    : "진행중"
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="editProject(selectedProject)" class="btn-modal-edit">
            수정하기
          </button>
          <button
            @click="deleteProject(selectedProject.id)"
            class="btn-modal-delete"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectService } from "@/shared/services";

export default {
  name: "PostList",
  data() {
    return {
      selectedProject: null,
      projects: [],
      loading: false,
      deleting: false,
      error: null,
      searchQuery: "",
      selectedCategory: "all",
      categories: [
        { value: "all", label: "전체", icon: "📋" },
        { value: "featured", label: "주요", icon: "⭐" },
        { value: "web", label: "웹", icon: "🌐" },
        { value: "mobile", label: "모바일", icon: "📱" },
        { value: "ai", label: "AI", icon: "🤖" },
        { value: "other", label: "기타", icon: "📦" },
      ],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    };
  },
  computed: {
    filteredProjects() {
      if (!Array.isArray(this.projects)) {
        return [];
      }

      let filtered = [...this.projects];

      // 카테고리 필터
      if (this.selectedCategory !== "all") {
        if (this.selectedCategory === "featured") {
          filtered = filtered.filter((p) => p.isFeatured);
        } else {
          filtered = filtered.filter(
            (p) => p.category === this.selectedCategory
          );
        }
      }

      // 검색 필터
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query) ||
            (p.techStack &&
              Array.isArray(p.techStack) &&
              p.techStack.some((t) => t.toLowerCase().includes(query)))
        );
      }

      return filtered;
    },
  },
  async created() {
    await this.loadProjects();
  },
  methods: {
    async loadProjects() {
      this.loading = true;
      this.error = null;

      try {
        const response = await projectService.getProjects({
          page: this.pagination.page,
          limit: this.pagination.limit,
          sortBy: "created_at",
          sortOrder: "desc",
        });

        if (response.success) {
          // API 응답 데이터를 UI에 맞게 변환
          this.projects = response.data.projects.map((project) => {
            console.log('프로젝트 이미지 URL:', project.image_urls);
            return {
              id: project.id,
              title: project.title,
              description: project.description,
              image: (project.image_urls && project.image_urls[0]) || null,
              projectUrl: project.demo_url,
              githubUrl: project.github_url,
              startDate: project.start_date,
              endDate: project.end_date,
              status: project.end_date ? "completed" : "active",
              techStack: project.tech_stack || [],
              isFeatured: project.is_featured,
              viewCount: project.view_count,
              category: project.category || "other",
            };
          });

          this.pagination = response.data.pagination;
        } else {
          this.error = response.error;
          console.error("프로젝트 로드 실패:", response.error);
        }
      } catch (error) {
        this.error = "프로젝트를 불러오는 중 오류가 발생했습니다.";
        console.error("프로젝트 로드 예외:", error);
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
      // project가 객체인지 ID인지 확인
      const projectId = typeof project === 'object' ? project.id : project;
      this.$router.push(`/admin/edit-post/${projectId}`);
      this.closeModal();
    },
    viewProject(project) {
      if (project.projectUrl) {
        window.open(project.projectUrl, "_blank");
      } else if (project.githubUrl) {
        window.open(project.githubUrl, "_blank");
      } else {
        this.openProjectModal(project);
      }
    },
    async deleteProject(projectId) {
      if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
        this.deleting = true;

        try {
          const response = await projectService.deleteProject(projectId);

          if (response.success) {
            this.projects = this.projects.filter((p) => p.id !== projectId);
            this.closeModal();
            alert("프로젝트가 삭제되었습니다.");
            // loadProjects를 다시 호출하지 않음 (이미 로컬에서 제거됨)
          } else {
            alert(`프로젝트 삭제 실패: ${response.error}`);
          }
        } catch (error) {
          console.error("프로젝트 삭제 예외:", error);
          alert("프로젝트 삭제 중 오류가 발생했습니다.");
        } finally {
          this.deleting = false;
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    truncateText(text, maxLength) {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    },
    handleImageError(event) {
      event.target.src =
        "https://placehold.co/400x250/e9ecef/6c757d?text=No+Image";
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;
@use "@/shared/styles/admin-common";

.post-list {
  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      align-items: stretch;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;

      .search-input {
        width: 100%;
        padding: 12px 45px 12px 16px;
        border: 2px solid #e9ecef;
        border-radius: $border-radius-lg;
        font-size: 1rem;
        background: #f8f9fa;
        color: #212529;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: $accent-color;
          box-shadow: 0 0 0 3px rgba($accent-color, 0.1);
        }
      }

      .search-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.2rem;
      }
    }
  }

  .filter-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 30px;

    .filter-tag {
      padding: 8px 16px;
      background: white;
      border: 2px solid #e9ecef;
      border-radius: $border-radius-lg;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #6c757d;
      font-weight: 500;

      &:hover {
        background: #f8f9fa;
        border-color: #0a0a0a;
        color: #0a0a0a;
        transform: translateY(-1px);
      }

      &.active {
        background: #0a0a0a;
        color: white;
        border-color: #0a0a0a;
        box-shadow: 0 2px 10px rgba(10, 10, 10, 0.2);
      }
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
    }
  }

  .project-card {
    background: white;
    border-radius: $border-radius-xl;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
      border-color: $accent-color;
    }

    .project-image {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: $gray-100;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 3rem;
        opacity: 0.5;
      }

      .featured-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: white;
        padding: 6px 12px;
        border-radius: $border-radius;
        font-size: 0.85rem;
        font-weight: 600;
      }
    }

    .project-content {
      padding: 25px;

      .project-title {
        font-size: 1.3rem;
        color: #212529;
        margin-bottom: 10px;
        font-weight: 600;
      }

      .project-description {
        color: #6c757d;
        line-height: 1.6;
        margin-bottom: 15px;
      }

      .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;

        .tech-badge {
          background: #f8f9fa;
          color: #6c757d;
          padding: 4px 10px;
          border-radius: $border-radius;
          font-size: 0.85rem;
          border: 1px solid #e9ecef;
        }

        .tech-more {
          background: linear-gradient(
            135deg,
            $accent-color 0%,
            $accent-hover 100%
          );
          color: white;
          padding: 4px 10px;
          border-radius: $border-radius;
          font-size: 0.85rem;
        }
      }

      .project-meta {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: $gray-500;
          font-size: 0.9rem;

          .meta-icon {
            font-size: 1rem;
          }
        }
      }

      .project-actions {
        display: flex;
        gap: 10px;

        .action-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: $border-radius;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;

          &.edit {
            background: #0a0a0a;
            color: white;
            border: 1px solid #1a1a1a;

            &:hover {
              background: #1a1a1a;
              border-color: #2a2a2a;
              transform: translateY(-2px);
            }
          }

          &.view {
            background: white;
            color: #0a0a0a;
            border: 1px solid #0a0a0a;

            &:hover {
              background: #0a0a0a;
              color: white;
              transform: translateY(-2px);
            }
          }

          &.delete {
            background: white;
            color: $danger-color;
            border: 1px solid $danger-color;

            &:hover {
              background: $danger-color;
              color: white;
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    h3 {
      color: #212529;
      margin-bottom: 10px;
      font-size: 1.8rem;
    }

    p {
      color: #6c757d;
      margin-bottom: 30px;
      font-size: 1.1rem;
    }

    .btn {
      display: inline-block;
      padding: 12px 25px;
      background: #0a0a0a;
      color: white;
      text-decoration: none;
      border-radius: $border-radius-lg;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: #1a1a1a;
        transform: translateY(-2px);
      }
    }
  }

  .loading-container {
    text-align: center;
    padding: 80px 20px;

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #0a0a0a;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    p {
      color: #6c757d;
      font-size: 1.1rem;
    }
  }

  // 모달 스타일
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

    h2 {
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

      &:hover {
        background: #f8f9fa;
        border-radius: 50%;
      }
    }
  }

  .modal-body {
    padding: 20px;

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

      a {
        padding: 10px 15px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: background 0.3s ease;

        &.project-link {
          background: #007bff;
          color: white;

          &:hover {
            opacity: 0.8;
          }
        }

        &.github-link {
          background: #6c757d;
          color: white;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .modal-tech {
      margin-bottom: 20px;

      h4 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }

      .tech-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .tech-tag {
          background: #42b883;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }
      }
    }

    .modal-period {
      h4 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }

      p {
        color: #495057;
        margin: 0;
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: 15px;
    padding: 20px;
    border-top: 1px solid #e9ecef;

    button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;

      &.btn-modal-edit {
        background: #007bff;
        color: white;

        &:hover {
          opacity: 0.8;
        }
      }

      &.btn-modal-delete {
        background: #dc3545;
        color: white;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>