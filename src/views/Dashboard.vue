<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <div>
          <h1>🚀 Developer Showcase 관리자</h1>
          <p>포트폴리오를 효율적으로 관리하세요</p>
        </div>
        <button @click="refreshData" class="refresh-btn" :disabled="loading">
          <span v-if="!loading">🔄</span>
          <span v-else class="spinning">⏳</span>
          새로고침
        </button>
      </div>
    </header>

    <!-- 공통 토스트 메시지 -->
    <ToastMessage :message="message" @close="clearMessage" />

    <!-- 공통 로딩 스피너 -->
    <LoadingSpinner v-if="loading" :message="loadingMessage" />

    <!-- 통계 카드 -->
    <div v-else-if="stats" class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ stats?.totalProjects || 0 }}</div>
        <div class="stat-label">총 프로젝트</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats?.totalViews || 0 }}</div>
        <div class="stat-label">총 조회수</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats?.monthlyUpdates || 0 }}</div>
        <div class="stat-label">이번 달 업데이트</div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>빠른 작업</h2>
      <div class="action-buttons">
        <router-link to="/create-post" class="action-btn primary">
          ✏️ 새 프로젝트 추가
        </router-link>
        <router-link to="/post-list" class="action-btn">
          📋 프로젝트 관리
        </router-link>
        <router-link to="/profile" class="action-btn">
          👤 프로필 설정
        </router-link>
      </div>
    </div>

    <div class="recent-activities">
      <h2>최근 활동</h2>
      <div v-if="isLoadingActivities" class="activity-loading">
        <div class="loading-spinner small"></div>
        <span>활동 내역을 불러오는 중...</span>
      </div>
      <div v-else-if="activities.length === 0" class="no-activities">
        <p>아직 기록된 활동이 없습니다.</p>
      </div>
      <div v-else class="activity-list">
        <div v-for="activity in activities" :key="activity.id" class="activity-item">
          <span class="activity-time">{{ activity.timeAgo }}</span>
          <span class="activity-text">{{ formatActivityDescription(activity) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsAPI } from "@/services/statisticsService";
import { messageMixin, loadingMixin } from "@/utils/messageUtils";
import ToastMessage from "@/components/ToastMessage.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "DashboardPage",
  mixins: [messageMixin, loadingMixin],
  components: {
    ToastMessage,
    LoadingSpinner
  },
  data() {
    return {
      // 통계 데이터
      stats: null,
      // 최근 활동 목록
      activities: [],
      // 로딩 상태
      isLoadingActivities: false,
    };
  },
  mounted() {
    // 초기 데이터 로드
    this.loadDashboardData();
  },
  methods: {
    // 대시보드 데이터 로드
    async loadDashboardData() {
      this.startLoading('대시보드 데이터를 불러오는 중...');

      try {
        // 통계 데이터와 활동 목록을 병렬로 로드
        const [statsResult, activitiesResult] = await Promise.all([
          this.loadStatistics(),
          this.loadRecentActivities(),
        ]);

        // 에러 처리
        if (!statsResult || !activitiesResult) {
          this.showErrorMessage("데이터를 불러오는 중 문제가 발생했습니다.");
        }
      } catch (error) {
        console.error("대시보드 데이터 로드 오류:", error);
        this.showErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        this.stopLoading();
      }
    },

    // 통계 데이터 로드
    async loadStatistics() {
      try {
        const result = await statisticsAPI.getDashboardStats();

        if (result.success) {
          this.stats = result.data || {
            totalProjects: 0,
            totalViews: 0,
            monthlyUpdates: 0,
            featuredProjects: 0,
            recentActivities: 0,
            topTechStacks: [],
            monthlyStats: [],
          };
          return true;
        } else {
          console.error("통계 데이터 로드 실패:", result.error);
          return false;
        }
      } catch (error) {
        console.error("통계 데이터 로드 예외:", error);
        return false;
      }
    },

    // 최근 활동 목록 로드
    async loadRecentActivities() {
      this.isLoadingActivities = true;

      try {
        const result = await statisticsAPI.getRecentActivities(10);

        if (result.success) {
          this.activities = result.data || [];
          return true;
        } else {
          console.error("활동 목록 로드 실패:", result.error);
          this.activities = [];
          return false;
        }
      } catch (error) {
        console.error("활동 목록 로드 예외:", error);
        this.activities = [];
        return false;
      } finally {
        this.isLoadingActivities = false;
      }
    },

    // 데이터 새로고침
    async refreshData() {
      if (this.loading) return;
      await this.loadDashboardData();
    },

    // 활동 설명 포맷팅
    formatActivityDescription(activity) {
      const actionTypeMap = {
        CREATE: "생성",
        UPDATE: "업데이트",
        DELETE: "삭제",
      };

      const action = actionTypeMap[activity.action_type] || activity.action_type;

      if (activity.description) {
        return activity.description;
      }

      // 기본 설명 생성
      if (activity.target_type === "project") {
        return `프로젝트를 ${action}했습니다.`;
      }

      return `${activity.target_type}을(를) ${action}했습니다.`;
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.dashboard-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.dashboard-header p {
  color: #7f8c8d;
  font-size: 1.2rem;
}

/* 새로고침 버튼 */
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #369870;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 기존 에러 메시지 및 로딩 스타일 제거 - 공통 컴포넌트 사용 */

/* 활동 로딩 */
.activity-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #7f8c8d;
}

/* 빈 활동 목록 */
.no-activities {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #7f8c8d;
}

.no-activities p {
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b883;
  margin-bottom: 10px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 1rem;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 15px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
  color: #495057;
}

.action-btn.primary {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.action-btn.primary:hover {
  background: #369870;
}

.recent-activities h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.activity-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f8f9fa;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  color: #7f8c8d;
  font-size: 0.9rem;
  min-width: 80px;
}

.activity-text {
  color: #495057;
}

/* 반응형 */
@media (max-width: 768px) {
  .dashboard {
    padding: 20px 15px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .dashboard-header h1 {
    font-size: 2rem;
  }

  .refresh-btn {
    align-self: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .activity-item {
    flex-direction: column;
    gap: 5px;
  }

  .activity-time {
    min-width: auto;
    font-weight: 600;
  }

  /* 반응형 스타일 유지 */
}
</style>