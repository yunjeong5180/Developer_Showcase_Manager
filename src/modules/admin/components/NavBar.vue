<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- 로고/브랜드 -->
      <div class="nav-brand">
        <router-link to="/admin/dashboard" class="brand-link">
          🚀 My Codit
        </router-link>
      </div>

      <!-- 메뉴 토글 버튼 (모바일용) -->
      <button
        class="nav-toggle"
        @click="toggleMobileMenu"
        :class="{ active: isMobileMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- 네비게이션 메뉴 -->
      <ul class="nav-menu" :class="{ active: isMobileMenuOpen }">
        <li class="nav-item">
          <router-link
            to="/admin/dashboard"
            class="nav-link"
            @click="closeMobileMenu"
          >
            🏠 대시보드
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/admin/create-post"
            class="nav-link"
            @click="closeMobileMenu"
          >
            ✏️ 프로젝트 작성
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/admin/post-list"
            class="nav-link"
            @click="closeMobileMenu"
          >
            📋 프로젝트 목록
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/profile" class="nav-link" @click="closeMobileMenu">
            👤 프로필 관리
          </router-link>
        </li>
        <li class="nav-item">
          <button class="nav-link logout-btn" @click="handleLogout">
            🚪 로그아웃
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      isMobileMenuOpen: false,
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    handleLogout() {
      // 임시 로그아웃 로직
      if (confirm("로그아웃 하시겠습니까?")) {
        this.closeMobileMenu();
        this.$router.push("/admin/login");
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 2px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.brand-link {
  color: #42b883;
  text-decoration: none;
  transition: color 0.3s ease;
}

.brand-link:hover {
  color: #369870;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
  align-items: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #495057;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #42b883;
}

.nav-link.router-link-active {
  background: #42b883;
  color: white;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.logout-btn:hover {
  background: #dc3545;
  color: white;
}

/* 모바일 메뉴 토글 버튼 */
.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: #495057;
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 3px;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    gap: 10px;
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    width: 100%;
    justify-content: center;
    padding: 15px;
  }

  /* 햄버거 메뉴 애니메이션 */
  .nav-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .nav-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}

/* 큰 화면에서 네비게이션 스타일 개선 */
@media (min-width: 1200px) {
  .nav-container {
    padding: 0 40px;
  }

  .nav-menu {
    gap: 30px;
  }
}
</style>
