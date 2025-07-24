<template>
  <div>
    <Navigation />
    <div class="pt-16 min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-8 py-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">연락처</h1>
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-6">연락 방법</h2>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">이메일</p>
                    <p class="text-gray-600">example@email.com</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">전화번호</p>
                    <p class="text-gray-600">010-1234-5678</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">GitHub</p>
                    <p class="text-gray-600">github.com/username</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-6">메시지 전송</h2>
              <form @submit.prevent="sendMessage" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input v-model="form.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">메시지</label>
                  <textarea v-model="form.message" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  메시지 전송
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'

export default {
  name: 'Contact',
  components: {
    Navigation
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    sendMessage() {
      alert('메시지가 전송되었습니다!')
      this.form = {
        name: '',
        email: '',
        message: ''
      }
    }
  }
}
</script>