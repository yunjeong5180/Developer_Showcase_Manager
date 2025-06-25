<template>
  <div id="app">
    <!-- 네비게이션 바 (로그인된 경우만 표시) -->
    <nav v-if="showNavigation" class="navbar">
      <div class="nav-container">
        <router-link to="/dashboard" class="nav-brand">
          🚀 Developer Showcase
        </router-link>

        <div class="nav-menu">
          <router-link to="/dashboard" class="nav-link">대시보드</router-link>
          <router-link to="/projects" class="nav-link">프로젝트 작성</router-link>
          <router-link to="/project-list" class="nav-link">프로젝트 목록</router-link>
          <router-link to="/profile" class="nav-link">프로필 관리</router-link>

          <div class="user-menu">
            <span class="username">{{ currentUser?.name || currentUser?.email }}</span>
            <button @click="handleLogout" class="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 메인 컨텐츠 -->
    <router-view />
  </div>
</template>

<script>
import { supabase } from '@/config/supabase'

export default {
  name: 'App',
  data() {
    return {
      currentUser: null,
      showNavigation: false
    }
  },
  async mounted() {
    // 초기 세션 확인
    await this.checkAuthState()

    // 라우트 변경 감지
    this.$router.beforeEach((to, from, next) => {
      this.updateNavigationVisibility(to.path)
      next()
    })

    // 현재 라우트에 따른 네비게이션 표시 설정
    this.updateNavigationVisibility(this.$route.path)
  },
  methods: {
    async checkAuthState() {
      try {
        // Supabase 세션 확인
        const { data: { session } } = await supabase.auth.getSession()

        if (session && session.user) {
          // 세션이 있는 경우
          this.currentUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email.split('@')[0]
          }

          // 로컬스토리지에도 저장
          localStorage.setItem('user', JSON.stringify(this.currentUser))

          console.log('세션 있음:', this.currentUser)
        } else {
          // 세션이 없는 경우
          const localUser = localStorage.getItem('user')

          if (localUser) {
            console.log('로컬 사용자 정보 삭제')
            localStorage.removeItem('user')
            localStorage.removeItem('rememberUser')
            localStorage.removeItem('userEmail')
          }

          this.currentUser = null
          console.log('세션 없음, 로그인 필요')

          // 로그인이 필요한 페이지에 있다면 로그인 페이지로 리디렉션
          if (this.requiresAuth(this.$route.path)) {
            this.$router.push('/login')
          }
        }
      } catch (error) {
        console.error('인증 상태 확인 오류:', error)
        this.currentUser = null
        this.clearUserData()
      }
    },

    requiresAuth(path) {
      // 인증이 필요한 페이지들
      const protectedRoutes = ['/dashboard', '/projects', '/profile', '/settings', '/project-list']
      return protectedRoutes.some(route => path.startsWith(route))
    },

    updateNavigationVisibility(currentPath) {
      // 네비게이션을 숨길 페이지들
      const hideNavRoutes = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/auth/callback',
        '/two-factor-auth'
      ]

      this.showNavigation = !hideNavRoutes.includes(currentPath) && this.currentUser !== null

      console.log(`경로: ${currentPath}, 네비게이션 표시: ${this.showNavigation}, 사용자: ${this.currentUser?.email}`)
    },

    async handleLogout() {
      try {
        console.log('로그아웃 시작')

        // Supabase 로그아웃
        const { error } = await supabase.auth.signOut()

        if (error) {
          console.error('Supabase 로그아웃 오류:', error)
        }

        // 로컬 데이터 완전 삭제
        this.clearUserData()

        // 상태 초기화
        this.currentUser = null
        this.showNavigation = false

        console.log('로그아웃 완료')

        // 로그인 페이지로 리디렉션
        this.$router.push('/login')

      } catch (error) {
        console.error('로그아웃 처리 오류:', error)

        // 오류가 발생해도 로컬 데이터는 삭제
        this.clearUserData()
        this.currentUser = null
        this.showNavigation = false
        this.$router.push('/login')
      }
    },

    clearUserData() {
      // 모든 로컬 저장소 데이터 삭제
      localStorage.removeItem('user')
      localStorage.removeItem('rememberUser')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('sb-gjuwbcfuadlwvxrxbgui-auth-token')

      // 세션 스토리지도 정리
      sessionStorage.clear()

      console.log('사용자 데이터 삭제 완료')
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* 네비게이션 바 */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.nav-brand {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.nav-brand:hover {
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.username {
  font-weight: 500;
  opacity: 0.9;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 반응형 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
    flex-wrap: wrap;
    height: auto;
    min-height: 60px;
  }

  .nav-menu {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .user-menu {
    padding-left: 15px;
    gap: 10px;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 10px;
    margin-top: 10px;
    width: 100%;
    justify-content: center;
  }

  .username {
    display: block;
  }

  .logout-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    flex-direction: column;
    gap: 8px;
  }

  .nav-link {
    padding: 4px 8px;
    font-size: 0.8rem;
  }

  .username {
    display: none; /* 모바일에서 사용자명 숨김 */
  }
}

/* 전역 스타일 */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #c33;
  margin-bottom: 15px;
}

.success-message {
  background-color: #efe;
  color: #3c763d;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  margin-bottom: 15px;
}
</style>