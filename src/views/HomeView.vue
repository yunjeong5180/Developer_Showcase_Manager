<template>
  <div class="home">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">Welcome to Codit</span>
        </h1>
        <p class="hero-subtitle">개발자를 위한 포트폴리오 플랫폼</p>
        <p class="hero-description">
          나만의 포트폴리오를 만들고, 프로젝트를 관리하며, 성장을 기록하세요
        </p>
        <div class="hero-actions">
          <router-link to="/portfolio" class="btn btn-primary">
            포트폴리오 둘러보기
          </router-link>
          <router-link to="/signup" class="btn btn-secondary">
            시작하기
          </router-link>
        </div>
      </div>
      <div class="hero-visual">
        <div class="code-block">
          <div class="code-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <pre class="code-content">
<span class="keyword">const</span> <span class="variable">developer</span> = {
  <span class="property">name</span>: <span class="string">"Your Name"</span>,
  <span class="property">skills</span>: [<span class="string">"Vue.js"</span>, <span class="string">"React"</span>, <span class="string">"Node.js"</span>],
  <span class="property">portfolio</span>: <span class="string">"codit.dev/yourname"</span>,
  <span class="property">passion</span>: <span class="keyword">true</span>
};</pre>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Codit?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>프로젝트 관리</h3>
            <p>모든 프로젝트를 한 곳에서 체계적으로 관리하세요</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>커스텀 포트폴리오</h3>
            <p>나만의 스타일로 포트폴리오를 꾸며보세요</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>성장 추적</h3>
            <p>개발자로서의 성장 과정을 기록하고 분석하세요</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔗</div>
            <h3>간편한 공유</h3>
            <p>하나의 링크로 포트폴리오를 쉽게 공유하세요</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>지금 시작하세요</h2>
        <p>무료로 포트폴리오를 만들고 관리해보세요</p>
        <router-link to="/signup" class="btn btn-large">
          무료로 시작하기
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;

.home {
  background: $gray-100;
  min-height: calc(100vh - 60px);
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 60px;

  @media (max-width: $breakpoint-lg) {
    flex-direction: column;
    padding: 60px 20px;
  }
}

.hero-content {
  flex: 1;
  max-width: 500px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;

  @media (max-width: $breakpoint-md) {
    font-size: 2.5rem;
  }
}

.gradient-text {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: $gray-700;
  margin-bottom: 15px;
  font-weight: 600;
}

.hero-description {
  font-size: 1.1rem;
  color: $gray-600;
  line-height: 1.6;
  margin-bottom: 30px;
}

.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: $border-radius-lg;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;

  &-primary {
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: white;
    box-shadow: $shadow;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }
  }

  &-secondary {
    background: white;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover {
      background: $primary-color;
      color: white;
    }
  }

  &-large {
    padding: 16px 32px;
    font-size: 1.2rem;
  }
}

.hero-visual {
  flex: 1;
  max-width: 500px;
}

.code-block {
  background: $gray-900;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  overflow: hidden;
}

.code-header {
  background: $gray-800;
  padding: 10px 15px;
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.red {
    background: #ff5f56;
  }
  &.yellow {
    background: #ffbd2e;
  }
  &.green {
    background: #27c93f;
  }
}

.code-content {
  color: #abb2bf;
  padding: 20px;
  margin: 0;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 14px;
  line-height: 1.6;

  .keyword {
    color: #c678dd;
  }
  .variable {
    color: #e06c75;
  }
  .property {
    color: #e06c75;
  }
  .string {
    color: #98c379;
  }
}

.features-section {
  background: white;
  padding: 80px 40px;

  @media (max-width: $breakpoint-md) {
    padding: 60px 20px;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 50px;
  color: $gray-900;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  text-align: center;
  padding: 30px;
  border-radius: $border-radius-lg;
  background: $gray-50;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow;
    background: white;
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: $gray-900;
  }

  p {
    color: $gray-600;
    line-height: 1.6;
  }
}

.cta-section {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  color: white;
  text-align: center;
  padding: 80px 40px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
  }

  .btn {
    background: white;
    color: $primary-color;

    &:hover {
      background: $gray-100;
    }
  }
}
</style>
