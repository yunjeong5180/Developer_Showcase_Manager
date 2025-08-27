<template>
  <div class="admin-page dashboard">
    <div class="admin-container">
      <!-- 페이지 헤더 -->
      <div class="page-header fade-in">
        <div class="header-content">
          <div>
            <h1>대시보드</h1>
          </div>
          <div class="header-actions">
            <span class="date-badge">{{ getCurrentDate() }}</span>
          </div>
        </div>
      </div>


      <!-- 통계 카드들 -->
      <div class="stats-grid fade-in">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-wrapper blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
              </svg>
            </div>
            <span class="stat-badge" v-if="statistics.projectsThisMonth > 0">+{{ statistics.projectsThisMonth }}</span>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ statistics.totalProjects || 0 }}</div>
            <div class="stat-label">전체 프로젝트</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-wrapper green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span class="stat-badge" v-if="statistics.viewsToday > 0">+{{ statistics.viewsToday }}</span>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ statistics.totalViews || 0 }}</div>
            <div class="stat-label">전체 조회수</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-wrapper orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ statistics.featuredProjects || 0 }}</div>
            <div class="stat-label">주요 프로젝트</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-wrapper purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ statistics.monthlyUpdates || 0 }}</div>
            <div class="stat-label">이번 달 업데이트</div>
          </div>
        </div>
      </div>

      <!-- 최근 활동 & 프로젝트 개요 -->
      <div class="content-grid">
        <!-- 최근 활동 -->
        <div class="card">
          <div class="card-header">
            <h3>최근 활동</h3>
            <span class="card-subtitle">최근 7일</span>
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
            <h3>프로젝트 개요</h3>
            <span class="card-subtitle">카테고리별</span>
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
          <h3>빠른 링크</h3>
        </div>
        <div class="quick-links">
          <a href="https://github.com" target="_blank" class="link-item">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <span>GitHub</span>
          </a>
          <a href="https://vercel.com" target="_blank" class="link-item">
            <div class="link-icon vercel">▲</div>
            <span>Vercel</span>
          </a>
          <a href="https://supabase.com" target="_blank" class="link-item">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <span>Supabase</span>
          </a>
          <a href="/portfolio" target="_blank" class="link-item">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <span>포트폴리오</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsAPI } from "@/shared/services/statisticsService";

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
    getCurrentDate() {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      };
      return new Date().toLocaleDateString('ko-KR', options);
    },
    
    async loadDashboardData() {
      this.isLoading = true;
      try {
        const result = await statisticsAPI.getDashboardStats();
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

// 관리자 페이지 공통 스타일
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 30px 20px;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .date-badge {
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #495057;
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
}

.card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  .card-header {
    margin-bottom: 20px;
    
    h3 {
      color: #212529;
      font-size: 1.3rem;
      margin: 0;
      font-weight: 600;
    }
  }
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(10, 10, 10, 0.1);
  }
  
  .stat-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #212529;
    margin-bottom: 5px;
  }
  
  .stat-label {
    color: #6c757d;
    font-size: 0.95rem;
  }
  
  .stat-change {
    margin-top: 10px;
    font-size: 0.85rem;
    
    &.positive {
      color: #28a745;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 15px;
    opacity: 0.5;
  }
  
  p {
    color: #6c757d;
    margin-bottom: 20px;
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard {
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
