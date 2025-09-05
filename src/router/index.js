import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Projects from "../views/Projects.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import AuthCallback from "../views/AuthCallback.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import TwoFactorAuth from "../views/TwoFactorAuth.vue";
// 새로 추가되는 컴포넌트들
import CreatePost from "../views/CreatePost.vue";
import PostList from "../modules/admin/views/PostList.vue";
import ClearSession from "../views/ClearSession.vue";
import { supabase } from "@/config/supabase";

// 메인 페이지 컴포넌트들
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import PortfolioDemo from "../modules/portfolio/views/PortfolioDemo.vue";
import PortfolioUser from "../modules/portfolio/views/PortfolioUser.vue";

// 인증 확인 함수
const requireAuth = async (to, from, next) => {
  console.log("인증 가드 실행:", to.path);

  try {
    // Supabase가 설정되지 않은 경우 로컬 모드로 처리
    if (!supabase) {
      console.log("Supabase 미설정 - 로컬 모드로 인증 체크");
      // 로컬 스토리지에서 사용자 확인
      const localUser = localStorage.getItem("currentUser");
      if (localUser) {
        next();
      } else {
        next("/admin/login");
      }
      return;
    }

    // Supabase 세션 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session && session.user) {
      console.log("세션 유효:", session.user.email);
      next(); // 인증됨, 계속 진행
    } else {
      console.log("세션 없음, 로그인 페이지로 리디렉션");
      // 로컬 스토리지 정리
      localStorage.removeItem("user");
      localStorage.removeItem("rememberUser");
      localStorage.removeItem("userEmail");

      next("/admin/login"); // 관리자 로그인 페이지로 리디렉션
    }
  } catch (error) {
    console.error("인증 확인 오류:", error);
    next("/admin/login");
  }
};

// 이미 로그인된 사용자가 로그인 페이지 접근 시 처리
const redirectIfAuthenticated = async (to, from, next) => {
  console.log("로그인 페이지 접근 확인:", to.path);

  try {
    // 비밀번호 재설정에서 온 경우 세션 체크 무시
    if (from.path === "/reset-password") {
      console.log(
        "비밀번호 재설정에서 온 접근, 세션 체크 무시하고 로그인 페이지 표시"
      );
      next();
      return;
    }

    // 메인 페이지들에서 온 경우 또는 쿼리 파라미터로 강제 표시 요청
    if (from.path === "/" || from.path === "/portfolio" || from.path === "/about" || from.path === "/contact" || to.query.force === "true") {
      console.log("메인 페이지에서 온 접근 또는 강제 표시, 로그인/회원가입 페이지 표시");
      next();
      return;
    }

    // Supabase가 설정되지 않은 경우 로컬 모드로 처리
    if (!supabase) {
      console.log("Supabase 미설정 - 로컬 모드");
      const localUser = localStorage.getItem("currentUser");
      if (localUser) {
        console.log("로컬 사용자 로그인됨, 대시보드로 리디렉션");
        next("/admin/dashboard");
      } else {
        console.log("로컬 사용자 없음, 로그인 페이지 표시");
        next();
      }
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session && session.user) {
      // URL에서 직접 접근한 경우만 리디렉션
      if (!from.path || from.path === to.path) {
        console.log("이미 로그인됨, 대시보드로 리디렉션");
        next("/admin/dashboard");
      } else {
        console.log("다른 페이지에서 온 접근, 페이지 표시");
        next();
      }
    } else {
      console.log("로그인 안됨, 로그인 페이지 표시");
      next();
    }
  } catch (error) {
    console.error("로그인 상태 확인 오류:", error);
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    component: PortfolioDemo,
  },
  {
    path: "/portfolio/:nickname",
    name: "PortfolioUser",
    component: PortfolioUser,
    props: true,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactView,
  },
  {
    path: "/login",
    redirect: "/admin/login",
  },
  {
    path: "/signup",
    redirect: "/admin/signup",
  },
  {
    path: "/admin",
    redirect: "/admin/dashboard",
  },
  {
    path: "/admin/login",
    name: "Login",
    component: Login,
    beforeEnter: redirectIfAuthenticated, // 이미 로그인된 경우 대시보드로
  },
  {
    path: "/admin/signup",
    name: "Signup",
    component: Signup,
    beforeEnter: redirectIfAuthenticated,
  },
  // ✅ 하위 호환성을 위한 register 경로 추가 (선택사항)
  {
    path: "/admin/register",
    redirect: "/admin/signup",
  },
  {
    path: "/admin/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    beforeEnter: redirectIfAuthenticated,
  },
  {
    path: "/admin/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
    // 비밀번호 재설정은 로그인하지 않은 상태에서도 접근 가능
  },
  {
    path: "/admin/two-factor-auth",
    name: "TwoFactorAuth",
    component: TwoFactorAuth,
    // 2FA는 부분적으로 인증된 상태이므로 별도 처리
  },
  {
    path: "/admin/auth/callback",
    name: "AuthCallback",
    component: AuthCallback,
    // OAuth 콜백은 인증 가드 없음
  },
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: requireAuth, // 인증 필요
  },
  {
    path: "/admin/projects",
    name: "Projects",
    component: Projects,
    beforeEnter: requireAuth,
  },
  // 새로 추가된 라우트들
  {
    path: "/admin/create-post",
    name: "CreatePost",
    component: CreatePost,
    beforeEnter: requireAuth,
  },
  {
    path: "/admin/edit-post/:id",
    name: "EditPost",
    component: CreatePost,
    beforeEnter: requireAuth,
  },
  {
    path: "/admin/post-list",
    name: "PostList",
    component: PostList,
    beforeEnter: requireAuth,
  },
  {
    path: "/admin/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: requireAuth,
  },
  {
    path: "/clear-session",
    name: "ClearSession",
    component: ClearSession,
    // 세션 클리어 페이지는 인증 없이 접근 가능
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/", // 잘못된 경로는 홈으로
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 전역 네비게이션 가드
router.beforeEach((to, from, next) => {
  console.log(`라우터: ${from.path} → ${to.path}`);
  next();
});

export default router;
