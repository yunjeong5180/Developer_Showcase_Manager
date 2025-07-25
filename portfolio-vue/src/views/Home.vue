<template>
  <div>
    <!-- 히어로 섹션 -->
    <section class="hero" id="home">
      <div class="hero-content">
        <h1>안녕하세요, 양윤정입니다</h1>
        <p>웹 개발을 배우고 있는 열정적인 개발자입니다</p>
        <router-link to="/projects" class="cta-button">프로젝트 보기</router-link>
      </div>
    </section>

    <!-- 간단한 소개 섹션 -->
    <section class="intro-section">
      <div class="container">
        <h2 class="section-title fade-in">Welcome</h2>
        <div class="intro-content fade-in">
          <p>안녕하세요! 저는 웹 개발에 열정을 가진 비전공자 개발자입니다.</p>
          <p>HTML, CSS, JavaScript부터 시작해서 Java, Spring Boot까지 차근차근 배워나가고 있습니다.</p>
          <div class="intro-buttons">
            <router-link to="/about" class="btn btn-primary">더 알아보기</router-link>
            <router-link to="/contact" class="btn btn-secondary">연락하기</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    // 스크롤 애니메이션 초기화
    this.observeElements()
  },
  methods: {
    observeElements() {
      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, options)

      const fadeElements = document.querySelectorAll('.fade-in')
      fadeElements.forEach(el => observer.observe(el))
    }
  }
}
</script>

<style scoped>
/* 히어로 섹션 */
.hero {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  margin-top: -60px; /* 네비게이션 높이만큼 올림 */
  padding-top: 60px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.05"/><circle cx="10" cy="60" r="1" fill="white" opacity="0.05"/><circle cx="90" cy="40" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.hero-content {
  z-index: 2;
  position: relative;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeInUp 1s ease 0.5s both;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeInUp 1s ease 0.7s both;
}

.hero .cta-button {
  opacity: 0;
  animation: fadeInUp 1s ease 0.9s both;
}

/* 인트로 섹션 */
.intro-section {
  background: #f8f9fa;
  text-align: center;
}

.intro-content {
  max-width: 800px;
  margin: 0 auto;
}

.intro-content p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #666;
  line-height: 1.8;
}

.intro-buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 반응형 */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .intro-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
}
</style>