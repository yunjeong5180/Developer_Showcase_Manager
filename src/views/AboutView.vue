<template>
  <div class="about-page">
    <div class="hero-section">
      <h1 class="hero-title">MyCodit에 대하여</h1>
      <p class="hero-subtitle">개발자를 위한 종합 포트폴리오 플랫폼</p>
    </div>

    <div class="content-container">
      <section class="mission-section">
        <div class="section-content">
          <h2>🎯 우리의 미션</h2>
          <p>
            MyCodit은 개발자들이 자신의 프로젝트와 기술을 효과적으로 관리하고 
            공유할 수 있는 플랫폼을 제공합니다. 개발자의 성장과 네트워킹을 
            지원하며, 최고의 포트폴리오 경험을 만들어갑니다.
          </p>
        </div>
      </section>

      <section class="features-section">
        <h2>✨ 주요 기능</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📂</div>
            <h3>프로젝트 관리</h3>
            <p>모든 프로젝트를 한 곳에서 체계적으로 관리하세요</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>맞춤형 포트폴리오</h3>
            <p>나만의 개성있는 포트폴리오를 만들어보세요</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>성장 추적</h3>
            <p>개발자로서의 성장 과정을 기록하고 분석하세요</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>네트워킹</h3>
            <p>다른 개발자들과 연결하고 협업하세요</p>
          </div>
        </div>
      </section>

      <section class="team-section">
        <h2>👥 팀 소개</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">👨‍💻</div>
            <h3>김개발</h3>
            <p class="role">풀스택 개발자</p>
            <p class="bio">5년 경력의 풀스택 개발자로 사용자 경험을 최우선으로 생각합니다</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">👩‍💻</div>
            <h3>이코딩</h3>
            <p class="role">프론트엔드 개발자</p>
            <p class="bio">Vue.js와 React를 사랑하는 프론트엔드 개발자입니다</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">👨‍🎨</div>
            <h3>박디자인</h3>
            <p class="role">UI/UX 디자이너</p>
            <p class="bio">사용자 중심의 직관적인 디자인을 추구합니다</p>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <h2>📈 현재까지의 성과</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">1,000+</div>
            <div class="stat-label">활성 사용자</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">5,000+</div>
            <div class="stat-label">등록된 프로젝트</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">10,000+</div>
            <div class="stat-label">코드 커밋</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">50+</div>
            <div class="stat-label">기술 스택</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style lang="scss" scoped>
@import '@/shared/styles/variables.scss';

.about-page {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero-section {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  
  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 16px;
    animation: fadeInDown 0.8s ease;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    animation: fadeInUp 0.8s ease;
  }
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

section {
  margin-bottom: 80px;
  
  h2 {
    font-size: 2rem;
    color: $gray-900;
    margin-bottom: 40px;
    text-align: center;
  }
}

.mission-section {
  .section-content {
    background: white;
    padding: 40px;
    border-radius: $border-radius-lg;
    box-shadow: $shadow;
    max-width: 800px;
    margin: 0 auto;
    
    p {
      font-size: 1.125rem;
      line-height: 1.8;
      color: $gray-700;
    }
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  
  .feature-card {
    background: white;
    padding: 30px;
    border-radius: $border-radius-lg;
    box-shadow: $shadow;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: $shadow-lg;
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 1.25rem;
      color: $gray-900;
      margin-bottom: 12px;
    }
    
    p {
      color: $gray-600;
      line-height: 1.6;
    }
  }
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  
  .team-member {
    background: white;
    padding: 40px;
    border-radius: $border-radius-lg;
    box-shadow: $shadow;
    text-align: center;
    
    .member-avatar {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 1.5rem;
      color: $gray-900;
      margin-bottom: 8px;
    }
    
    .role {
      color: $primary-color;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .bio {
      color: $gray-600;
      line-height: 1.6;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  
  .stat-card {
    background: white;
    padding: 30px;
    border-radius: $border-radius-lg;
    box-shadow: $shadow;
    text-align: center;
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: $primary-color;
      margin-bottom: 8px;
    }
    
    .stat-label {
      color: $gray-600;
      font-size: 1rem;
    }
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: $breakpoint-md) {
  .hero-section {
    padding: 60px 20px;
    
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
  }
  
  .content-container {
    padding: 40px 20px;
  }
  
  section {
    margin-bottom: 60px;
    
    h2 {
      font-size: 1.5rem;
      margin-bottom: 30px;
    }
  }
}
</style>