<template>
  <div id="app">
    <!-- 알림 컴포넌트 -->
    <transition name="notification">
      <div v-if="notification.show" :class="['notification', `notification-${notification.type}`]">
        {{ notification.message }}
      </div>
    </transition>

    <!-- 네비게이션 바 (조건부 렌더링) -->
    <nav v-if="showNavigation" class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          🚀 Codit
        </router-link>

        <div class="nav-right-group">
          <div class="nav-menu">
            <template v-if="isAuthenticated">
              <router-link to="/admin/dashboard" class="nav-link">대시보드</router-link>
              <router-link to="/admin/projects" class="nav-link">프로젝트</router-link>
              <router-link to="/admin/profile" class="nav-link">프로필</router-link>
              <router-link :to="`/portfolio/${userProfile?.nickname || 'demo'}`" class="nav-link">내 포트폴리오</router-link>
            </template>
            <template v-else>
              <router-link to="/portfolio" class="nav-link">포트폴리오</router-link>
              <router-link to="/about" class="nav-link">소개</router-link>
              <router-link to="/contact" class="nav-link">문의</router-link>
            </template>
          </div>

          <div class="user-menu">
            <template v-if="isAuthenticated">
              <span class="username">{{ userProfile?.name || currentUser?.email }}</span>
              <button @click="handleLogout" class="logout-btn">로그아웃</button>
            </template>
            <template v-else>
              <router-link to="/login" class="login-btn">로그인</router-link>
              <router-link to="/signup" class="signup-btn">회원가입</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 라우터 뷰 -->
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getSupabaseStatus } from '@/shared/services/authService'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['notification']),
    ...mapGetters('auth', ['currentUser', 'userProfile', 'isAuthenticated']),
    
    showNavigation() {
      const hideNavRoutes = [
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/auth/callback'
      ]
      return !hideNavRoutes.includes(this.$route.path)
    }
  },
  methods: {
    ...mapActions('auth', ['initAuth', 'signOut']),
    
    async handleLogout() {
      await this.signOut()
      this.$router.push('/login')
    }
  },
  created() {
    // 앱 시작시 인증 상태 초기화
    this.initAuth()
  },
  mounted() {
    // Supabase 연결 상태 확인
    const supabaseStatus = getSupabaseStatus()
    if (!supabaseStatus.isConfigured) {
      console.warn('⚠️ Supabase 설정 안내:')
      console.warn('1. .env.development 파일을 생성하세요')
      console.warn('2. .env.example 파일을 참고하여 Supabase URL과 익명 키를 설정하세요')
      console.warn('3. 로컬 모드로 실행 중입니다 (데이터는 브라우저에만 저장됩니다)')
    } else {
      console.log('✅ Supabase 연결 설정 완료:', supabaseStatus.url)
    }
  }
}
</script>

<style lang="scss">
@import '@/shared/styles/variables.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: $font-family-base;
  background-color: $gray-100;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

// 알림 스타일
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: $spacing-md $spacing-lg;
  border-radius: $border-radius;
  box-shadow: $shadow;
  z-index: 2000;
  transition: all 0.3s ease;
  
  &-success {
    background: $success-color;
    color: white;
  }
  
  &-error {
    background: $danger-color;
    color: white;
  }
  
  &-warning {
    background: $warning-color;
    color: $gray-900;
  }
  
  &-info {
    background: $info-color;
    color: white;
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

// 네비게이션 바 스타일
.navbar {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  color: white;
  padding: 0;
  box-shadow: $shadow;
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
  padding: 0 $spacing-lg;
  height: 60px;
}

.nav-brand {
  font-size: $font-size-lg;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
}

.nav-right-group {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-lg;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &.router-link-active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.username {
  font-weight: 500;
  opacity: 0.9;
}

.logout-btn,
.login-btn,
.signup-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-lg;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: $shadow-sm;
  }
}

.signup-btn {
  background: rgba(255, 255, 255, 0.9);
  color: $primary-dark;
  
  &:hover {
    background: white;
  }
}

// 반응형 디자인
@media (max-width: $breakpoint-lg) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: $spacing-sm $spacing-md;
  }
  
  .nav-right-group {
    flex-direction: column;
    gap: $spacing-sm;
    margin-top: $spacing-sm;
  }
}

@media (max-width: $breakpoint-md) {
  .nav-menu {
    gap: $spacing-xs;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-sm;
  }
  
  .user-menu {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: $spacing-sm;
    margin-top: $spacing-xs;
    width: 100%;
    justify-content: center;
  }
}
</style>