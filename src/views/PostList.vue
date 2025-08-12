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
        <!-- 새 프로젝트 버튼 - 프로젝트가 있을 때만 표시 -->
        <router-link
          v-if="!isLoading && projects.length > 0"
          to="/admin/create-post"
          class="btn btn-primary"
        >
          ➕ 새 프로젝트
        </router-link>
      </div>

      <!-- 필터 태그 - 항상 표시 -->
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
        v-if="!isLoading && filteredProjects.length > 0"
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
              v-if="project.thumbnail"
              :src="project.thumbnail"
              :alt="project.title"
            />
            <div v-else class="image-placeholder">
              <span>📂</span>
            </div>
            <div v-if="project.is_featured" class="featured-badge">
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
              v-if="project.technologies && project.technologies.length > 0"
              class="project-tech"
            >
              <span
                v-for="(tech, index) in project.technologies.slice(0, 3)"
                :key="index"
                class="tech-badge"
              >
                {{ tech }}
              </span>
              <span v-if="project.technologies.length > 3" class="tech-more">
                +{{ project.technologies.length - 3 }}
              </span>
            </div>

            <!-- 프로젝트 메타 정보 -->
            <div class="project-meta">
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ formatDate(project.created_at) }}
              </span>
              <span v-if="project.views" class="meta-item">
                <span class="meta-icon">👁️</span>
                {{ project.views }}
              </span>
            </div>

            <!-- 액션 버튼 -->
            <div class="project-actions">
              <button @click="editProject(project.id)" class="action-btn edit">
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
        v-else-if="!isLoading && filteredProjects.length === 0"
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
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>프로젝트를 불러오는 중...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjects, deleteProject } from "@/services/projectService";

export default {
  name: "PostList",
  data() {
    return {
      projects: [],
      searchQuery: "",
      selectedCategory: "all",
      isLoading: false,
      categories: [
        { value: "all", label: "전체", icon: "📋" },
        { value: "featured", label: "주요", icon: "⭐" },
        { value: "web", label: "웹", icon: "🌐" },
        { value: "mobile", label: "모바일", icon: "📱" },
        { value: "ai", label: "AI", icon: "🤖" },
        { value: "other", label: "기타", icon: "📦" },
      ],
    };
  },
  computed: {
    filteredProjects() {
      // projects가 배열인지 확인
      if (!Array.isArray(this.projects)) {
        return [];
      }

      let filtered = [...this.projects]; // 배열 복사

      // 카테고리 필터
      if (this.selectedCategory !== "all") {
        if (this.selectedCategory === "featured") {
          filtered = filtered.filter((p) => p.is_featured);
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
            (p.technologies &&
              Array.isArray(p.technologies) &&
              p.technologies.some((t) => t.toLowerCase().includes(query)))
        );
      }

      return filtered;
    },
  },
  async mounted() {
    await this.loadProjects();
  },
  methods: {
    async loadProjects() {
      this.isLoading = true;
      try {
        const result = await getProjects();
        if (result.success) {
          this.projects = result.data;
        }
      } catch (error) {
        console.error("프로젝트 목록 로드 실패:", error);
      } finally {
        this.isLoading = false;
      }
    },

    editProject(id) {
      this.$router.push(`/admin/edit-post/${id}`);
    },

    viewProject(project) {
      if (project.live_url) {
        window.open(project.live_url, "_blank");
      } else if (project.github_url) {
        window.open(project.github_url, "_blank");
      } else {
        alert("프로젝트 링크가 없습니다");
      }
    },

    async deleteProject(id) {
      if (!confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
        return;
      }

      try {
        const result = await deleteProject(id);
        if (result.success) {
          this.projects = this.projects.filter((p) => p.id !== id);
        } else {
          alert("프로젝트 삭제 실패");
        }
      } catch (error) {
        console.error("프로젝트 삭제 오류:", error);
        alert("프로젝트 삭제 중 오류가 발생했습니다");
      }
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR");
    },

    truncateText(text, maxLength) {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;
@import "@/shared/styles/admin-common";

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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.7);
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
}
</style>
