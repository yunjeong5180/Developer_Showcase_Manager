<template>
  <div class="projects-container">
    <div class="page-container">
      <div class="page-header">
        <h1>🚀 프로젝트 관리</h1>
        <p>개발 프로젝트들을 관리하고 포트폴리오에 추가하세요</p>
      </div>

      <div class="projects-content">
        <div class="coming-soon">
          <div class="icon">🔧</div>
          <h2>프로젝트 관리 기능</h2>
          <p>곧 업데이트될 예정입니다!</p>

          <div class="features-preview">
            <div class="feature-item">
              <span class="feature-icon">📁</span>
              <span>프로젝트 생성 및 관리</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔗</span>
              <span>GitHub 연동</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span>프로젝트 분석</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎨</span>
              <span>포트폴리오 테마</span>
            </div>
          </div>

          <router-link to="/dashboard" class="back-btn">
            ← 대시보드로 돌아가기
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectsPage",
  data() {
    return {
      // 임시 데이터
    };
  },
  mounted() {
    console.log("프로젝트 페이지 로드됨");
  },
};
</script>

<style scoped>
.projects-container {
  min-height: calc(100vh - 60px);
  background: #f8f9fa;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.page-header p {
  color: #6c757d;
  font-size: 1.1rem;
}

.projects-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.coming-soon {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.coming-soon h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.coming-soon p {
  color: #6c757d;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.features-preview {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  color: #2c3e50;
}

.feature-icon {
  font-size: 1.2rem;
}

.back-btn {
  display: inline-block;
  padding: 12px 25px;
  background: #0a0a0a;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  border: 1px solid #1a1a1a;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.back-btn:hover {
  background: #1a1a1a;
  border-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

/* 반응형 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .coming-soon {
    padding: 40px 20px;
    margin: 0 20px;
  }

  .coming-soon h2 {
    font-size: 1.5rem;
  }

  .feature-item {
    padding: 10px 15px;
  }
}
</style>
