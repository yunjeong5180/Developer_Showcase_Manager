<template>
  <div id="app">
    <!-- 로그인/회원가입 페이지가 아닐 때만 네비게이션 표시 -->
    <NavBar v-if="showNavigation" />

    <!-- 페이지 컨텐츠 -->
    <main class="main-content" :class="{ 'with-nav': showNavigation }">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  computed: {
    showNavigation() {
      // 로그인/회원가입 페이지에서는 네비게이션을 숨김
      const hideNavRoutes = ["/login", "/signup"];
      return !hideNavRoutes.includes(this.$route.path);
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

.main-content {
  min-height: 100vh;
}

.main-content.with-nav {
  min-height: calc(100vh - 70px);
  background: #f8f9fa;
}

/* 전역 스타일 */
body {
  background: #f8f9fa;
}

/* 스크롤바 스타일 (선택사항) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #42b883;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #369870;
}
</style>