<template>
  <div>
    <Navigation />
    <div class="pt-16 min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-8 py-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">소개</h1>
        <div class="bg-white rounded-xl shadow-lg p-8">
          <p class="text-lg text-gray-600 mb-6">
            안녕하세요! 저는 열정적인 개발자입니다.
          </p>
          <p class="text-lg text-gray-600 mb-6">
            새로운 기술을 배우고 문제를 해결하는 것을 좋아합니다.
          </p>
          <p class="text-lg text-gray-600">
            이 포트폴리오를 통해 제가 작업한 프로젝트들을 확인해보세요.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'

export default {
  name: 'About',
  components: {
    Navigation
  }
}
</script>