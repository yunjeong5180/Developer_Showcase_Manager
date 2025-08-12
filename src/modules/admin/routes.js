// 관리자 모듈 라우트 설정
const adminRoutes = [
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () => import("./views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/projects",
    name: "AdminProjects",
    component: () => import("./views/PostList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/projects/create",
    name: "CreateProject",
    component: () => import("./views/CreatePost.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/profile",
    name: "AdminProfile",
    component: () => import("./views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/settings",
    name: "AdminSettings",
    component: () => import("./views/SecuritySettings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/2fa",
    name: "TwoFactorAuth",
    component: () => import("./views/TwoFactorAuth.vue"),
    meta: { requiresAuth: true },
  },
  // 인증 관련 라우트
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("./views/Signup.vue"),
    meta: { guest: true },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("./views/ForgotPassword.vue"),
    meta: { guest: true },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("./views/ResetPassword.vue"),
    meta: { guest: true },
  },
  {
    path: "/auth/callback",
    name: "AuthCallback",
    component: () => import("./views/AuthCallback.vue"),
  },
];

export default adminRoutes;
