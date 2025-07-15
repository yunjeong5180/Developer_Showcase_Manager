<template>
  <div id="app">
    <nav v-if="showNavigation" class="navbar">
      <div class="nav-container">
        <router-link to="/dashboard" class="nav-brand">
          🚀 Developer Showcase
        </router-link>

        <div class="nav-right-group">
          <div class="nav-menu">
            <router-link to="/dashboard" class="nav-link">대시보드</router-link>
            <router-link to="/create-post" class="nav-link">프로젝트 작성</router-link>
            <router-link to="/projects" class="nav-link">프로젝트 관리</router-link>
            <router-link to="/post-list" class="nav-link">프로젝트 목록</router-link>
          </div>

          <div class="user-menu">
            <router-link to="/profile" class="username-link">
              <span class="username">{{ currentUser?.name || currentUser?.email }}</span>
            </router-link>
            <button @click="handleLogout" class="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>

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
      showNavigation: false,
      authListener: null, // 인증 리스너를 저장할 변수
      isSignupInProgress: false, // 🆕 회원가입 진행 중 플래그
      isPasswordResetInProgress: false, // 🆕 비밀번호 재설정 진행 중 플래그
    }
  },
  created() {
    // 앱 생성 시, 가장 먼저 현재 세션을 확인합니다.
    supabase.auth.getSession().then(({ data: { session } }) => {
      // 세션이 있는 경우 (브라우저를 새로 켠 경우)
      if (session) {
        // 🆕 비밀번호 재설정 중인 경우 자동 로그아웃 방지
        const currentPath = window.location.pathname;
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const isPasswordRecovery = hashParams.get('type') === 'recovery' || 
                                   currentPath === '/reset-password';
        
        if (isPasswordRecovery) {
          console.log('비밀번호 재설정 세션 감지, 세션 유지')
          this.isPasswordResetInProgress = true;
          this.setUser(session);
          return;
        }
        
        // 세션이 있으면 바로 사용자 설정 (강제 로그아웃 로직 제거)
        this.setUser(session);
      }
    });

    // 인증 상태 변경을 실시간으로 감지하는 리스너 설정
    this.authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase Auth Event:', event, 'Route:', this.$route?.path);

      // 🚨 회원가입 이벤트인 경우 자동 로그인 방지
      if (event === 'SIGNED_UP') {
        console.log('회원가입 이벤트 감지, 자동 로그인 방지')
        this.isSignupInProgress = true
        // 즉시 로그아웃하여 자동 로그인 방지
        setTimeout(() => {
          supabase.auth.signOut()
          this.isSignupInProgress = false
        }, 100)
        return
      }

      // 🚨 회원가입 진행 중이면 세션 설정하지 않음
      if (this.isSignupInProgress) {
        console.log('회원가입 진행 중, 세션 설정 무시')
        return
      }

      // 회원가입 페이지에서 오는 세션 변경은 무시
      if (this.$route?.path === '/signup') {
        console.log('회원가입 페이지에서 오는 세션 변경 무시')
        return
      }

      // 🆕 비밀번호 재설정 프로세스 중에는 자동 로그아웃 방지
      if (event === 'PASSWORD_RECOVERY' || 
          (this.$route?.path === '/reset-password' && event !== 'SIGNED_OUT')) {
        console.log('비밀번호 재설정 중, 세션 유지')
        this.isPasswordResetInProgress = true;
        this.setUser(session);
        return
      }

      // 🆕 비밀번호 재설정 완료 후 SIGNED_OUT 이벤트 처리
      if (event === 'SIGNED_OUT' && this.isPasswordResetInProgress) {
        console.log('비밀번호 재설정 완료, 플래그 초기화')
        this.isPasswordResetInProgress = false;
        this.setUser(session);
        return
      }

      // 일반적인 로그인/로그아웃 처리
      this.setUser(session);
    });
  },
  beforeUnmount() {
    // 컴포넌트가 파괴될 때 리스너를 정리합니다.
    if (this.authListener) {
      this.authListener.data.subscription.unsubscribe();
    }
  },
  methods: {
    setUser(session) {
      if (session && session.user) {
        console.log('사용자 세션 설정:', session.user.email)
        
        // 🆕 비밀번호 재설정 중에는 currentUser를 설정하지 않음
        if (this.isPasswordResetInProgress) {
          console.log('비밀번호 재설정 중, currentUser 설정 건너뛰기')
          return;
        }
        
        this.currentUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.nickname ||
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email.split('@')[0]
        };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      } else {
        console.log('사용자 세션 해제')
        this.currentUser = null;
        this.clearUserData();
      }
      this.updateNavigationVisibility(this.$route.path);
    },
    updateNavigationVisibility(currentPath) {
      const hideNavRoutes = [
        '/login',
        '/register',
        '/signup', // 🆕 추가
        '/forgot-password',
        '/reset-password',
        '/auth/callback',
        '/two-factor-auth'
      ];
      this.showNavigation = !hideNavRoutes.includes(currentPath) && this.currentUser !== null;
    },
    async handleLogout() {
      console.log('수동 로그아웃 시도')
      // 로그아웃은 단순히 signOut을 호출하면 onAuthStateChange 리스너가 나머지를 처리합니다.
      await supabase.auth.signOut();
      // 로그인 페이지로 이동
      this.$router.push('/login')
    },
    clearUserData() {
      localStorage.removeItem('user');
      localStorage.removeItem('rememberUser');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('sb-gjuwbcfuadlwvxrxbgui-auth-token');
    }
  },
  watch: {
    // 라우트가 변경될 때마다 네비게이션 바 표시 여부를 다시 계산
    '$route'(to, from) {
      this.updateNavigationVisibility(to.path);

      // 🆕 회원가입 페이지를 떠날 때 플래그 초기화
      if (from.path === '/signup') {
        this.isSignupInProgress = false
      }

      // 🆕 비밀번호 재설정 페이지를 떠날 때 플래그 초기화
      if (from.path === '/reset-password') {
        this.isPasswordResetInProgress = false
      }
    }
  }
}
</script>

<style>
/* 스타일 코드는 기존과 동일합니다. */
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

.nav-right-group {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 15px;
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
}

.username-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}
.username-link:hover {
  background: rgba(255, 255, 255, 0.1);
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

@media (max-width: 992px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 10px 15px;
  }
  .nav-right-group {
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
  .nav-menu {
    margin-bottom: 5px;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    gap: 5px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .nav-link, .username-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .user-menu {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 10px;
    margin-top: 5px;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
    text-align: center;
  }
}
</style>