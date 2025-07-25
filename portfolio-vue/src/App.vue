<template>
  <div id="app">
    <Navigation v-if="showNavigation" />
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    Footer
  },
  computed: {
    showNavigation() {
      // AdminLogin 페이지에서는 네비게이션 숨기기
      return this.$route.path !== '/admin'
    },
    showFooter() {
      // AdminLogin 페이지에서는 푸터 숨기기
      return this.$route.path !== '/admin'
    }
  }
}
</script>

<style>
/* 기본 리셋 및 공통 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
}

/* 컨테이너 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 버튼 스타일 */
.cta-button, .btn {
  display: inline-block;
  padding: 12px 30px;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.cta-button {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.cta-button:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: #3498db;
  color: white;
  border: 2px solid #3498db;
}

.btn-primary:hover {
  background: transparent;
  color: #3498db;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-secondary:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
}

/* 섹션 공통 스타일 */
section {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
}

.section-title::after {
  content: '';
  width: 50px;
  height: 3px;
  background: #3498db;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

/* 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>