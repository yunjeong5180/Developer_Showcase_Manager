// 웰컴 모듈 라우트 설정
const welcomeRoutes = [
  {
    path: "/",
    name: "Welcome",
    component: () => import("./views/Home.vue"),
  },
];

export default welcomeRoutes;
