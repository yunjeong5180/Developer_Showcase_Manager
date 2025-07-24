<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">C</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Codit 관리자 로그인</h1>
        <p class="text-gray-600 mt-2">포트폴리오 관리 페이지에 접속하세요</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="이메일을 입력하세요"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="비밀번호를 입력하세요"
            required
          >
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="loading">로그인 중...</span>
          <span v-else>로그인</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          계정이 없으신가요? 
          <a href="http://localhost:8080/signup" class="text-blue-600 hover:text-blue-700 font-medium">회원가입</a>
        </p>
      </div>

      <div class="mt-8 text-center">
        <a href="http://localhost:3001" class="text-gray-500 hover:text-gray-700 text-sm">← 메인으로 돌아가기</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (this.form.email && this.form.password) {
          window.location.href = 'http://localhost:8080/dashboard'
        } else {
          alert('이메일과 비밀번호를 입력해주세요.')
        }
      } catch (error) {
        console.error('로그인 실패:', error)
        alert('로그인에 실패했습니다. 다시 시도해주세요.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>