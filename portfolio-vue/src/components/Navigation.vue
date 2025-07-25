<template>
  <nav id="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <router-link to="/" class="logo">Portfolio</router-link>
      <ul class="nav-links">
        <li>
          <router-link to="/" :class="{ 'active': $route.path === '/' }">
            홈
          </router-link>
        </li>
        <li>
          <router-link to="/about" :class="{ 'active': $route.path === '/about' }">
            소개
          </router-link>
        </li>
        <li>
          <router-link to="/projects" :class="{ 'active': $route.path === '/projects' }">
            프로젝트
          </router-link>
        </li>
        <li>
          <router-link to="/contact" :class="{ 'active': $route.path === '/contact' }">
            연락처
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Navigation',
  setup() {
    const isScrolled = ref(false)

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 10
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isScrolled
    }
  }
}
</script>

<style scoped>
/* 네비게이션 */
nav {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

nav.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  color: #3498db;
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background: #3498db;
  transition: width 0.3s ease;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.nav-links a.active {
  color: #3498db;
}

/* 반응형 */
@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
  }
  
  .nav-container {
    padding: 0 1rem;
  }
}
</style>