<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>🚀 Developer Showcase 관리자</h1>
      <p>포트폴리오를 효율적으로 관리하세요</p>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">5</div>
        <div class="stat-label">총 프로젝트</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">12</div>
        <div class="stat-label">이번 달 조회수</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">3</div>
        <div class="stat-label">최근 업데이트</div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>빠른 작업</h2>
      <div class="action-buttons">
        <router-link to="/projects" class="action-btn primary">
          ✏️ 새 프로젝트 추가
        </router-link>
        <router-link to="/project-list" class="action-btn">
          📋 프로젝트 관리
        </router-link>
        <router-link to="/profile" class="action-btn">
          👤 프로필 설정
        </router-link>
      </div>
    </div>

    <div class="recent-activities">
      <h2>최근 활동</h2>
      <div class="activity-list">
        <div class="activity-item">
          <span class="activity-time">2시간 전</span>
          <span class="activity-text">"Todo App" 프로젝트를 업데이트했습니다.</span>
        </div>
        <div class="activity-item">
          <span class="activity-time">1일 전</span>
          <span class="activity-text">"Vue Portfolio" 프로젝트를 추가했습니다.</span>
        </div>
        <div class="activity-item">
          <span class="activity-time">3일 전</span>
          <span class="activity-text">프로필 정보를 수정했습니다.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardPage",
  data() {
    return {
      // 추후 API에서 가져올 데이터
    };
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