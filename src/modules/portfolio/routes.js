// 포트폴리오 모듈 라우트 설정
// Import 가이드라인:
// - 동적 import는 '@/modules/portfolio/views/' 경로 사용
// - 컴포넌트 import는 '@/modules/portfolio/components/' 경로 사용

const portfolioRoutes = [
  {
    path: "/portfolio",
    name: "PortfolioList",
    component: () => import("@/modules/portfolio/views/Projects.vue"),
  },
  {
    path: "/portfolio/:username",
    name: "PortfolioUser",
    component: () => import("@/modules/portfolio/views/PortfolioUser.vue"),
    props: true,
  },
  {
    path: "/portfolio/demo",
    name: "PortfolioDemo",
    component: () => import("@/modules/portfolio/views/PortfolioDemo.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/modules/portfolio/views/About.vue"),
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("@/modules/portfolio/views/Contact.vue"),
  },
];

export default portfolioRoutes;
