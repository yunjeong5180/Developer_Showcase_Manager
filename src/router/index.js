import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Projects from "../views/Projects.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue"; // ✅ Register → Signup 변경
import AuthCallback from "../views/AuthCallback.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import TwoFactorAuth from "../views/TwoFactorAuth.vue";
// 새로 추가되는 컴포넌트들
import CreatePost from "../views/CreatePost.vue";
import PostList from "../views/PostList.vue";
import { supabase } from '@/config/supabase';

// 인증 확인 함수
async function requireAuth(to, from, next) {
  console.log('인증 가드 실행:', to.path);

  try {
    // Supabase 세션 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (session && session.user) {
      console.log('세션 유효:', session.user.email);
      next(); // 인증됨, 계속 진행
    } else {
      console.log('세션 없음, 로그인 페이지로 리디렉션');
      // 로컬 스토리지 정리
      localStorage.removeItem('user');
      localStorage.removeItem('rememberUser');
      localStorage.removeItem('userEmail');

      next('/login'); // 로그인 페이지로 리디렉션
    }
  } catch (error) {
    console.error('인증 확인 오류:', error);
    next('/login');
  }
}

// 이미 로그인된 사용자가 로그인 페이지 접근 시 처리
async function redirectIfAuthenticated(to, from, next) {
  console.log('로그인 페이지 접근 확인:', to.path);

  try {
    // 비밀번호 재설정에서 온 경우 세션 체크 무시
    if (from.path === '/reset-password') {
      console.log('비밀번호 재설정에서 온 접근, 세션 체크 무시하고 로그인 페이지 표시');
      next();
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session && session.user) {
      console.log('이미 로그인됨, 대시보드로 리디렉션');
      next('/dashboard');
    } else {
      console.log('로그인 안됨, 로그인 페이지 표시');
      next();
    }
  } catch (error) {
    console.error('로그인 상태 확인 오류:', error);
    next();
  }
}

const routes = [
  {
    path: "/",
    redirect: "/login", // 기본 경로를 로그인으로 변경
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: redirectIfAuthenticated, // 이미 로그인된 경우 대시보드로
  },
  {
    path: "/signup", // ✅ register → signup 변경
    name: "Signup",
    component: Signup, // ✅ Register → Signup 변경
    beforeEnter: redirectIfAuthenticated,
  },
  // ✅ 하위 호환성을 위한 register 경로 추가 (선택사항)
  {
    path: "/register",
    redirect: "/signup"
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    beforeEnter: redirectIfAuthenticated,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
    // 비밀번호 재설정은 로그인하지 않은 상태에서도 접근 가능
  },
  {
    path: "/two-factor-auth",
    name: "TwoFactorAuth",
    component: TwoFactorAuth,
    // 2FA는 부분적으로 인증된 상태이므로 별도 처리
  },
  {
    path: "/auth/callback",
    name: "AuthCallback",
    component: AuthCallback,
    // OAuth 콜백은 인증 가드 없음
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: requireAuth, // 인증 필요
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    beforeEnter: requireAuth,
  },
  // 새로 추가된 라우트들
  {
    path: "/create-post",
    name: "CreatePost",
    component: CreatePost,
    beforeEnter: requireAuth,
  },
  {
    path: "/post-list",
    name: "PostList",
    component: PostList,
    beforeEnter: requireAuth,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: requireAuth,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/login", // 잘못된 경로는 로그인으로
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드
router.beforeEach((to, from, next) => {
  console.log(`라우터: ${from.path} → ${to.path}`);
  next();
});

export default router;