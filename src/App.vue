<template>
  <div id="app">
    <!-- 알림 컴포넌트 -->
    <transition name="notification">
      <div
        v-if="notification.show"
        :class="['notification', `notification-${notification.type}`]"
      >
        {{ notification.message }}
      </div>
    </transition>

    <!-- 초기 로딩 중일 때는 네비게이션 바 숨김 -->
    <nav v-if="showNavigation && !authLoading" class="navbar">
      <div class="nav-container">
        <!-- 로그인 전: Codit (홈으로), 로그인 후: My Codit (대시보드로) -->
        <template v-if="isAuthenticated">
          <router-link to="/admin/dashboard" class="nav-brand">
            🚀 My Codit
          </router-link>
        </template>
        <template v-else>
          <router-link to="/" class="nav-brand"> 🚀 Codit </router-link>
        </template>

        <div class="nav-right-group">
          <div class="nav-menu">
            <template v-if="isAuthenticated">
              <!-- 로그인 후 메뉴 -->
              <router-link to="/admin/create-post" class="nav-link"
                >프로젝트 작성</router-link
              >
              <router-link to="/admin/projects" class="nav-link"
                >프로젝트 관리</router-link
              >
              <router-link to="/admin/post-list" class="nav-link"
                >프로젝트 목록</router-link
              >
              <router-link to="/admin/profile" class="nav-link">
                {{ userProfile?.nickname || userProfile?.name || "프로필" }}
              </router-link>
              <button @click="handleLogout" class="logout-btn">로그아웃</button>
            </template>
            <template v-else>
              <!-- 로그인 전 메뉴 -->
              <router-link to="/portfolio" class="nav-link"
                >포트폴리오</router-link
              >
              <router-link to="/about" class="nav-link">소개</router-link>
              <router-link to="/contact" class="nav-link">문의</router-link>
              <router-link to="/login" class="login-btn">로그인</router-link>
              <router-link to="/signup" class="signup-btn"
                >회원가입</router-link
              >
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
import { mapGetters, mapActions } from "vuex";
import { getSupabaseStatus } from "@/shared/services/authService";

export default {
  name: "App",
  computed: {
    ...mapGetters(["notification"]),
    ...mapGetters("auth", [
      "currentUser",
      "userProfile",
      "isAuthenticated",
      "authLoading",
    ]),

    showNavigation() {
      const hideNavRoutes = [
        "/admin/login",
        "/admin/signup",
        "/admin/forgot-password",
        "/admin/reset-password",
        "/admin/auth/callback",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/auth/callback",
      ];
      return !hideNavRoutes.includes(this.$route.path);
    },
  },
  watch: {
    isAuthenticated(newVal) {
      console.log("인증 상태 변경:", newVal);
      console.log("현재 사용자:", this.currentUser);
      console.log("프로필 정보:", this.userProfile);
    },
  },
  methods: {
    ...mapActions("auth", ["initAuth", "signOut"]),

    async handleLogout() {
      // 로그아웃 시 모든 세션 데이터 강제 삭제
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("supabase") || key.includes("sb-"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // sessionStorage도 초기화
      sessionStorage.clear();

      await this.signOut();
      this.$router.push("/login");
    },
  },
  async created() {
    // Supabase 인증 리스너 설정
    const { supabase } = await import("@/config/supabase");
    if (supabase) {
      // sessionStorage를 사용해서 새로고침인지 확인
      const isPageRefresh = sessionStorage.getItem('isPageRefresh');
      
      // 세션 확인
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        
        if (error && error.message.includes("Invalid Refresh Token")) {
          // 유효하지 않은 refresh token 제거
          console.log("만료된 refresh token 제거 중...");
          await supabase.auth.signOut();
        } else if (session && isPageRefresh === 'true') {
          // 새로고침인 경우에만 세션 복원
          console.log("페이지 새로고침 - 세션 복원 중:", session.user.email);
          
          // 세션 만료 시간 확인
          const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
          const now = new Date();
          
          if (expiresAt && expiresAt <= now) {
            // 만료된 세션은 제거
            console.log("만료된 세션 제거");
            await supabase.auth.signOut();
          } else {
            // 유효한 세션이면 store에 저장하여 로그인 상태 유지
            console.log("유효한 세션 복원");
            this.$store.commit("auth/SET_USER", session.user);
            await this.$store.dispatch("auth/loadUserProfile");
          }
        } else if (session && !isPageRefresh) {
          // 첫 방문이나 서버 재시작 시 - 세션 제거
          console.log("서버 재시작 감지 - 자동 로그인 방지");
          await supabase.auth.signOut();
        }
        
        // 페이지 로드 완료 표시
        sessionStorage.setItem('isPageRefresh', 'true');
      } catch (err) {
        console.error("세션 확인 중 오류:", err);
      }

      // 이후 변경사항만 리스너로 처리
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        if (event === "SIGNED_IN" && session) {
          // 로그인 성공 시 store 업데이트
          this.$store.commit("auth/SET_USER", session.user);
          // 프로필 로드 완료까지 대기
          await this.$store.dispatch("auth/loadUserProfile");
          console.log("프로필 로드 완료, 현재 프로필:", this.userProfile);
        } else if (event === "SIGNED_OUT") {
          // 로그아웃 시 store 초기화
          this.$store.commit("auth/CLEAR_AUTH");
          // 세션 스토리지 초기화
          sessionStorage.removeItem('isPageRefresh');
        }
      });
    }

    console.log("초기 인증 상태 확인 완료");
  },
  async mounted() {
    // Supabase 연결 상태 확인
    const supabaseStatus = getSupabaseStatus();
    if (!supabaseStatus.isConfigured) {
      console.warn("⚠️ Supabase 설정 안내:");
      console.warn("1. .env.development 파일을 생성하세요");
      console.warn(
        "2. .env.example 파일을 참고하여 Supabase URL과 익명 키를 설정하세요"
      );
      console.warn(
        "3. 로컬 모드로 실행 중입니다 (데이터는 브라우저에만 저장됩니다)"
      );
    } else {
      console.log("✅ Supabase 연결 설정 완료:", supabaseStatus.url);
      // 인증 초기화 - 새로고침 시에도 세션 복원
      await this.initAuth();
    }
  },
};
</script>

<style lang="scss">
@use "@/shared/styles/variables" as *;

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
    color: white; // 호버 시에도 흰색 유지
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
    color: white; // 호버 시에도 흰색 유지
    transform: translateY(-1px);
  }

  &.router-link-active {
    background: rgba(255, 255, 255, 0.2);
    color: white; // 활성 상태에서도 흰색 유지
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
    color: white; // 호버 시에도 흰색 유지
    transform: translateY(-1px);
    box-shadow: $shadow-sm;
  }
}

.signup-btn {
  background: rgba(255, 255, 255, 0.9);
  color: $primary-dark;

  &:hover {
    background: white;
    color: $primary-dark; // 회원가입 버튼은 검정색 유지
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
