<template>
  <div class="admin-page dashboard">
    <div class="admin-container">
      <!-- 페이지 헤더 -->
      <div class="page-header fade-in">
        <h1>대시보드</h1>
        <p>프로젝트와 포트폴리오를 한눈에 관리하세요</p>
      </div>

      <!-- 빠른 액션 버튼들 -->
      <div class="quick-actions fade-in">
        <router-link to="/admin/create-post" class="action-card">
          <div class="action-icon">✏️</div>
          <div class="action-content">
            <h3>새 프로젝트</h3>
            <p>프로젝트 추가하기</p>
          </div>
        </router-link>
        <router-link to="/admin/profile" class="action-card">
          <div class="action-icon">👤</div>
          <div class="action-content">
            <h3>프로필 편집</h3>
            <p>내 정보 수정하기</p>
          </div>
        </router-link>
        <router-link to="/admin/post-list" class="action-card">
          <div class="action-icon">📋</div>
          <div class="action-content">
            <h3>프로젝트 목록</h3>
            <p>모든 프로젝트 보기</p>
          </div>
        </router-link>
        <a :href="portfolioUrl" target="_blank" class="action-card">
          <div class="action-icon">🌐</div>
          <div class="action-content">
            <h3>포트폴리오</h3>
            <p>내 포트폴리오 보기</p>
          </div>
        </a>
      </div>

      <!-- 통계 카드들 -->
      <div class="stats-grid fade-in">
        <div class="stat-card">
          <div class="stat-icon">📂</div>
          <div class="stat-value">{{ statistics.totalProjects || 0 }}</div>
          <div class="stat-label">전체 프로젝트</div>
          <div
            class="stat-change positive"
            v-if="statistics.projectsThisMonth > 0"
          >
            +{{ statistics.projectsThisMonth }} 이번 달
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👁️</div>
          <div class="stat-value">{{ statistics.totalViews || 0 }}</div>
          <div class="stat-label">전체 조회수</div>
          <div class="stat-change positive" v-if="statistics.viewsToday > 0">
            +{{ statistics.viewsToday }} 오늘
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">{{ statistics.featuredProjects || 0 }}</div>
          <div class="stat-label">주요 프로젝트</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-value">{{ statistics.monthlyUpdates || 0 }}</div>
          <div class="stat-label">이번 달 업데이트</div>
        </div>
      </div>

      <!-- 최근 활동 & 프로젝트 개요 -->
      <div class="content-grid">
        <!-- 최근 활동 -->
        <div class="card">
          <div class="card-header">
            <h3>🕐 최근 활동</h3>
          </div>
          <div v-if="recentActivities.length > 0" class="activity-list">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon">
                {{ getActivityIcon(activity.type) }}
              </div>
              <div class="activity-content">
                <p class="activity-description">{{ activity.description }}</p>
                <span class="activity-time">{{
                  formatDate(activity.created_at)
                }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon">📭</div>
            <p>아직 활동 내역이 없습니다</p>
          </div>
        </div>

        <!-- 프로젝트 개요 -->
        <div class="card">
          <div class="card-header">
            <h3>📊 프로젝트 개요</h3>
          </div>
          <div v-if="projectOverview.length > 0" class="project-overview">
            <div class="overview-chart">
              <div
                v-for="category in projectOverview"
                :key="category.name"
                class="chart-bar"
              >
                <div class="bar-label">{{ category.name }}</div>
                <div class="bar-container">
                  <div
                    class="bar-fill"
                    :style="{ width: getPercentage(category.count) + '%' }"
                  >
                    <span class="bar-value">{{ category.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon">📈</div>
            <p>프로젝트 데이터가 없습니다</p>
            <router-link to="/admin/create-post" class="btn btn-primary btn-sm">
              첫 프로젝트 만들기
            </router-link>
          </div>
        </div>
      </div>

      <!-- 빠른 링크 섹션 -->
      <div class="card quick-links-card">
        <div class="card-header">
          <h3>🔗 빠른 링크</h3>
        </div>
        <div class="quick-links">
          <a href="https://github.com" target="_blank" class="link-item">
            <span class="link-icon">🐙</span>
            <span>GitHub</span>
          </a>
          <a href="https://vercel.com" target="_blank" class="link-item">
            <span class="link-icon">▲</span>
            <span>Vercel</span>
          </a>
          <a href="https://supabase.com" target="_blank" class="link-item">
            <span class="link-icon">🗄️</span>
            <span>Supabase</span>
          </a>
          <a href="/portfolio" target="_blank" class="link-item">
            <span class="link-icon">🎨</span>
            <span>포트폴리오 데모</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDashboardStatistics } from "@/services/statisticsService";

export default {
  name: "Dashboard",
  data() {
    return {
      statistics: {
        totalProjects: 0,
        totalViews: 0,
        monthlyUpdates: 0,
        featuredProjects: 0,
        projectsThisMonth: 0,
        viewsToday: 0,
      },
      recentActivities: [],
      projectOverview: [],
      isLoading: false,
      portfolioUrl: "",
    };
  },
  async mounted() {
    await this.loadDashboardData();
    this.setPortfolioUrl();
  },
  methods: {
    async loadDashboardData() {
      this.isLoading = true;
      try {
        const result = await getDashboardStatistics();
        if (result.success) {
          this.statistics = result.data;
          this.recentActivities = result.data.recentActivities || [];
          this.projectOverview = result.data.projectCategories || [];
        }
      } catch (error) {
        console.error("대시보드 데이터 로드 실패:", error);
      } finally {
        this.isLoading = false;
      }
    },

    setPortfolioUrl() {
      const user = this.$store.state.auth.profile;
      if (user && user.nickname) {
        this.portfolioUrl = `/portfolio/${user.nickname}`;
      } else {
        this.portfolioUrl = "/portfolio";
      }
    },

    getActivityIcon(type) {
      const icons = {
        project_created: "🆕",
        project_updated: "✏️",
        project_deleted: "🗑️",
        profile_updated: "👤",
        login: "🔐",
      };
      return icons[type] || "📌";
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (hours < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}분 전`;
      } else if (hours < 24) {
        return `${hours}시간 전`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days}일 전`;
      }
    },

    getPercentage(count) {
      if (this.projectOverview.length === 0) return 0;
      const maxCount = Math.max(...this.projectOverview.map((c) => c.count));
      return maxCount > 0 ? (count / maxCount) * 100 : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;
@import "@/shared/styles/admin-common";

.dashboard {
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .action-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    display: flex;
    align-items: center;
    gap: 20px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(10, 10, 10, 0.1);

      .action-icon {
        transform: scale(1.1) rotate(5deg);
      }
    }

    .action-icon {
      font-size: 2.5rem;
      transition: transform 0.3s ease;
      color: #0a0a0a;
    }

    .action-content {
      h3 {
        color: #212529;
        font-size: 1.2rem;
        margin-bottom: 5px;
        font-weight: 600;
      }

      p {
        color: #6c757d;
        font-size: 0.9rem;
        margin: 0;
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-bottom: 30px;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }

  .activity-list {
    .activity-item {
      display: flex;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid $gray-100;

      &:last-child {
        border-bottom: none;
      }

      .activity-icon {
        font-size: 1.5rem;
      }

      .activity-content {
        flex: 1;

        .activity-description {
          color: #495057;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .activity-time {
          color: #adb5bd;
          font-size: 0.85rem;
        }
      }
    }
  }

  .project-overview {
    .overview-chart {
      .chart-bar {
        margin-bottom: 20px;

        .bar-label {
          color: #495057;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .bar-container {
          background: #f8f9fa;
          border-radius: 20px;
          height: 35px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);

          .bar-fill {
            background: #0a0a0a;
            height: 100%;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;

            &::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
              );
              animation: shimmer 2s infinite;
            }

            .bar-value {
              color: white;
              font-weight: 600;
              font-size: 0.9rem;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
              position: relative;
              z-index: 1;
            }
          }
        }
      }
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.dashboard {
  .quick-links-card {
    .quick-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;

      .link-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: #f8f9fa;
        border-radius: 8px;
        text-decoration: none;
        color: #6c757d;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
          background: white;
          color: #0a0a0a;
          border-color: #0a0a0a;
          transform: translateY(-2px);
          box-shadow: 0 2px 10px rgba(10, 10, 10, 0.1);
        }

        .link-icon {
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>
