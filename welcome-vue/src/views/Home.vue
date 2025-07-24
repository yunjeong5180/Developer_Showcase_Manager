<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <header class="px-6 py-4">
      <nav class="flex justify-between items-center max-w-7xl mx-auto">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">C</span>
          </div>
          <span class="text-xl font-bold text-gray-900">Codit</span>
        </div>
        <div class="flex space-x-8">
          <a href="#features" class="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#demo" class="text-gray-600 hover:text-blue-600 transition-colors">Demo</a>
          <a href="#contact" class="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          나의 코드로
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            세상과 나를 잇다
          </span>
        </h1>
        <p class="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          <strong>Codit</strong>은 개발자를 위한 직관적이고 아름다운 포트폴리오 플랫폼입니다. 
          당신의 코드와 프로젝트로 세상과 연결되어 보세요.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="http://localhost:8080/dashboard" 
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 no-underline"
          >
            My Codit 시작하기
          </a>
          <a 
            href="http://localhost:3001/portfolio/demo" 
            class="border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors no-underline"
          >
            포트폴리오 둘러보기
          </a>
        </div>
      </div>

      <!-- Features Section -->
      <section id="features" class="mt-32">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">
          왜 Codit인가요?
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">My Codit으로 쉽게</h3>
            <p class="text-gray-600">
              직관적인 My Codit 페이지로 나만의 포트폴리오를 간편하게 만들고 관리할 수 있습니다.
            </p>
          </div>

          <div class="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">코드로 연결하기</h3>
            <p class="text-gray-600">
              당신의 코드와 프로젝트를 통해 세상과 자연스럽게 연결되는 경험을 제공합니다.
            </p>
          </div>

          <div class="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">특별한 포트폴리오</h3>
            <p class="text-gray-600">
              단순한 이력서가 아닌, 나만의 스토리가 담긴 특별한 포트폴리오를 만들어보세요.
            </p>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section id="demo" class="mt-32 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">
          실제 작동 모습을 확인해보세요
        </h2>
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
          <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
              <p class="text-gray-500">포트폴리오 데모 영상</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer id="contact" class="bg-gray-900 text-white py-16 mt-32">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <div class="flex items-center justify-center space-x-2 mb-8">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">C</span>
          </div>
          <span class="text-xl font-bold">Codit</span>
        </div>
        <p class="text-gray-400 mb-8">
          나의 코드로 세상과 나를 잇는 포트폴리오 플랫폼
        </p>
        <div class="flex justify-center space-x-6">
          <a href="#" class="text-gray-400 hover:text-white transition-colors">이용약관</a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">개인정보처리방침</a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">문의하기</a>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-800">
          <p class="text-gray-400 text-sm">
            © 2024 Codit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>