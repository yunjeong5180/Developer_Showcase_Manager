# Vue.js 프로젝트 설정 및 문제 해결 가이드

## 📋 목차
1. [프로젝트 초기 상태](#1-프로젝트-초기-상태)
2. [발견된 문제점들](#2-발견된-문제점들)
3. [해결 과정](#3-해결-과정)
4. [최종 프로젝트 구조](#4-최종-프로젝트-구조)
5. [실행 방법](#5-실행-방법)

---

## 1. 프로젝트 초기 상태

### 문제 상황
- 서버 실행 시 네비게이션바만 표시되고 메인 콘텐츠가 보이지 않음
- Vue 2와 Vue 3 코드가 혼재되어 있음
- 라우팅 설정이 잘못되어 있음

### 초기 기술 스택
- **Vue.js 2.6.14** (구버전)
- **Vue Router 3.x** (구버전)
- **Vuex 3.x** (구버전)
- **Vuetify 2.x** (구버전)

---

## 2. 발견된 문제점들

### 2.1 버전 호환성 문제
```javascript
// 문제: Vue 3 문법을 Vue 2 환경에서 사용
import { createStore } from "vuex";  // Vue 3 문법
import Vue from 'vue';               // Vue 2 import
```

### 2.2 라우팅 문제
```javascript
// 문제: 모든 경로가 admin/login으로 리다이렉트됨
{
  path: "/",
  redirect: "/admin/login"  // 홈페이지가 없음
}
```

### 2.3 스타일 문제
- SCSS 변수 누락 (`$gray-50` 등)
- 전역 스타일 파일 부재
- 컴포넌트 간 스타일 일관성 부족

---

## 3. 해결 과정

### 3.1 Vue 3로 업그레이드

#### Step 1: 패키지 업데이트
```bash
# Vue 3 및 관련 패키지 설치
npm install vue@3 vue-router@4 vuex@4 @vue/compiler-sfc --save

# Vuetify 3 설치
npm install vuetify@3 --legacy-peer-deps --save

# FontAwesome Vue 3 버전 설치
npm install @fortawesome/vue-fontawesome@3 --legacy-peer-deps --save
```

#### Step 2: main.js 수정 (Vue 3 방식)
```javascript
// 이전 (Vue 2)
import Vue from 'vue'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 이후 (Vue 3)
import { createApp } from 'vue'
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
```

### 3.2 라우터 설정 수정

#### Step 1: 홈페이지 라우트 추가
```javascript
// src/router/index.js
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,  // 홈페이지 추가
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
  // ... 기타 라우트
]
```

#### Step 2: Vue Router 4 문법 적용
```javascript
// 이전 (Vue Router 3)
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

// 이후 (Vue Router 4)
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
```

### 3.3 Vuex Store 수정

#### Step 1: Vue 3 문법 적용
```javascript
// src/store/index.js
// 이전 (Vuex 3)
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({...})

// 이후 (Vuex 4)
import { createStore } from 'vuex'
export default createStore({...})
```

#### Step 2: 누락된 모듈 생성
```javascript
// src/store/modules/portfolio.js
export default {
  namespaced: true,
  state: {
    portfolioData: null,
    isLoading: false,
    error: null
  },
  // ... getters, mutations, actions
}
```

### 3.4 스타일 문제 해결

#### Step 1: SCSS 변수 추가
```scss
// src/shared/styles/variables.scss
$gray-50: #f9fafb;  // 누락된 변수 추가
$gray-100: #f8f9fa;
// ... 기타 변수들
```

#### Step 2: 전역 스타일 파일 생성
```scss
// src/shared/styles/global.scss
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
```

### 3.5 홈페이지 컴포넌트 생성

```vue
<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">Welcome to Codit</span>
        </h1>
        <p class="hero-subtitle">
          개발자를 위한 포트폴리오 플랫폼
        </p>
        <!-- ... -->
      </div>
    </section>
  </div>
</template>
```

### 3.6 Vuetify 3 설정

#### Step 1: 구버전 제거
```bash
npm uninstall vuetify-loader vue-cli-plugin-vuetify
```

#### Step 2: 새 플러그인 설치
```bash
npm install webpack-plugin-vuetify --save-dev --legacy-peer-deps
```

#### Step 3: vue.config.js 수정
```javascript
const { VuetifyPlugin } = require('webpack-plugin-vuetify')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new VuetifyPlugin({
        autoImport: true,
      }),
    ],
  }
})
```

---

## 4. 최종 프로젝트 구조

```
MyCodit-vue/
├── src/
│   ├── App.vue                 # 메인 앱 컴포넌트
│   ├── main.js                  # Vue 3 진입점
│   ├── router/
│   │   └── index.js            # Vue Router 4 설정
│   ├── store/
│   │   ├── index.js            # Vuex 4 메인 스토어
│   │   └── modules/
│   │       ├── auth.js         # 인증 모듈
│   │       ├── projects.js     # 프로젝트 모듈
│   │       └── portfolio.js    # 포트폴리오 모듈
│   ├── views/
│   │   ├── HomeView.vue        # 홈페이지
│   │   ├── AboutView.vue       # 소개 페이지
│   │   ├── Login.vue           # 로그인
│   │   └── ...                 # 기타 페이지들
│   ├── modules/
│   │   └── portfolio/
│   │       └── views/
│   │           ├── PortfolioDemo.vue
│   │           └── PortfolioUser.vue
│   └── shared/
│       └── styles/
│           ├── variables.scss  # SCSS 변수
│           └── global.scss     # 전역 스타일
├── package.json                 # Vue 3 의존성
└── vue.config.js               # Vue 3 설정
```

---

## 5. 실행 방법

### 개발 서버 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 8080)
npm run serve
```

### 접속 주소
- **홈페이지**: http://localhost:8080/
- **포트폴리오**: http://localhost:8080/portfolio
- **관리자 로그인**: http://localhost:8080/admin/login
- **관리자 대시보드**: http://localhost:8080/admin/dashboard (로그인 필요)

---

## 🎯 핵심 포인트

### Vue 2 vs Vue 3 차이점

| 구분 | Vue 2 | Vue 3 |
|------|--------|--------|
| **앱 생성** | `new Vue()` | `createApp()` |
| **라우터** | `new VueRouter()` | `createRouter()` |
| **스토어** | `new Vuex.Store()` | `createStore()` |
| **컴포넌트 문법** | Options API | Composition API 지원 |
| **Vuetify** | v2.x | v3.x |

### 주요 해결 사항
1. ✅ Vue 2 → Vue 3 마이그레이션 완료
2. ✅ 홈페이지 및 라우팅 구조 개선
3. ✅ 스타일 시스템 정비
4. ✅ 모든 의존성 패키지 업데이트
5. ✅ 누락된 store 모듈 생성

### 트러블슈팅 팁

#### 문제: "Cannot read properties of undefined"
**해결**: Vue 3로 업그레이드 후 import 문법 확인

#### 문제: "Module not found"
**해결**: 파일 경로 확인 및 누락된 파일 생성

#### 문제: "Undefined variable" (SCSS)
**해결**: variables.scss에 누락된 변수 추가

#### 문제: "vuetify-loader is only for use with vuetify 2"
**해결**: webpack-plugin-vuetify로 교체

---

## 📚 참고 자료
- [Vue 3 공식 문서](https://vuejs.org/)
- [Vue Router 4 가이드](https://router.vuejs.org/)
- [Vuex 4 문서](https://vuex.vuejs.org/)
- [Vuetify 3 문서](https://vuetifyjs.com/)

---

## 🚀 다음 단계
1. 컴포넌트를 Composition API로 리팩토링
2. TypeScript 도입 고려
3. 테스트 코드 작성
4. 프로덕션 빌드 최적화
5. CI/CD 파이프라인 구축