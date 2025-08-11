<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>🚀 My Codit 관리자</h1>
      <p>포트폴리오를 효율적으로 관리하세요</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>대시보드를 불러오는 중...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>오류가 발생했습니다</h3>
      <p>{{ error }}</p>
      <button @click="loadDashboardData" class="btn-retry">다시 시도</button>
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ stats.totalProjects }}</div>
        <div class="stat-label">총 프로젝트</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.totalViews }}</div>
        <div class="stat-label">총 조회수</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.monthlyUpdates }}</div>
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
        <a href="/portfolio/demo" class="action-btn portfolio-preview" target="_blank">
          🌐 포트폴리오 미리보기
        </a>
        <button @click="goToMyPortfolio" class="action-btn my-portfolio">
          👨‍💻 내 포트폴리오 보기
        </button>
      </div>
    </div>

    <div v-if="!loading" class="recent-activities">
      <h2>최근 활동</h2>
      <div class="activity-list">
        <div 
          v-if="recentActivities.length > 0" 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <span class="activity-time">{{ activity.timeAgo }}</span>
          <span class="activity-text">{{ activity.description }}</span>
        </div>
        <div v-else class="no-activities">
          <p>아직 활동 내역이 없습니다.</p>
          <p>프로젝트를 추가하거나 프로필을 수정해보세요!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsService, supabase } from '@/shared/services';

export default {
  name: "DashboardPage",
  data() {
    return {
      stats: {
        totalProjects: 0,
        totalViews: 0,
        monthlyUpdates: 0
      },
      recentActivities: [],
      loading: true,
      error: null
    };
  },
  async created() {
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      this.loading = true;
      this.error = null;
      
      try {
        // 대시보드 통계 데이터 가져오기
        const [statsResponse, activitiesResponse] = await Promise.all([
          statisticsService.getDashboardStats(),
          statisticsService.getRecentActivities(5)
        ]);
        
        if (statsResponse.success) {
          this.stats = {
            totalProjects: statsResponse.data.totalProjects,
            totalViews: statsResponse.data.totalViews,
            monthlyUpdates: statsResponse.data.monthlyUpdates
          };
        } else {
          console.error('통계 데이터 로드 실패:', statsResponse.error);
        }
        
        if (activitiesResponse.success) {
          this.recentActivities = activitiesResponse.data.slice(0, 3);
        } else {
          console.error('최근 활동 로드 실패:', activitiesResponse.error);
        }
        
      } catch (error) {
        this.error = '대시보드 데이터를 불러오는 중 오류가 발생했습니다.';
        console.error('대시보드 데이터 로드 예외:', error);
      } finally {
        this.loading = false;
      }
    },

    async goToMyPortfolio() {
      try {
        // 현재 사용자 정보 가져오기
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          alert('로그인이 필요합니다.');
          return;
        }

        // users 테이블에서 사용자 정보 조회
        const { data: userData, error: userDataError } = await supabase
          .from('users')
          .select('id, name')
          .eq('auth_user_id', user.id)
          .single();

        if (userDataError || !userData) {
          alert('사용자 정보를 찾을 수 없습니다.');
          console.error('사용자 정보 조회 오류:', userDataError);
          return;
        }

        // 사용자별 포트폴리오 페이지로 이동
        const portfolioUrl = `/portfolio/${encodeURIComponent(userData.name)}/${userData.id}`;
        window.open(portfolioUrl, '_blank');
        
      } catch (error) {
        console.error('포트폴리오 이동 오류:', error);
        alert('포트폴리오 페이지로 이동하는 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
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

.action-btn.portfolio-preview {
  background: #6f42c1;
  color: white;
  border-color: #6f42c1;
}

.action-btn.portfolio-preview:hover {
  background: #5a359a;
  border-color: #5a359a;
}

.action-btn.my-portfolio {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.action-btn.my-portfolio:hover {
  background: #c0392b;
  border-color: #c0392b;
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

.no-activities {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.no-activities p {
  margin: 0 0 10px 0;
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

/* 반응형 */
@media (max-width: 768px) {
  .dashboard {
    padding: 20px 15px;
  }

  .dashboard-header h1 {
    font-size: 2rem;
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
}
</style>