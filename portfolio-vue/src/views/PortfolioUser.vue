<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">{{ username }}의 포트폴리오</h1>
          <a href="http://localhost:3001" class="text-blue-600 hover:text-blue-700">← 돌아가기</a>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="user" class="max-w-6xl mx-auto px-6 py-12">
      <!-- 프로필 섹션 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name" class="w-full h-full rounded-full object-cover">
            <span v-else class="text-4xl font-bold text-white">{{ user.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ user.name || username }}</h2>
            <p class="text-xl text-blue-600 mb-4">{{ user.title || '개발자' }}</p>
            <p class="text-gray-600 leading-relaxed">
              {{ user.bio || '개발자 포트폴리오입니다.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 기술 스택 -->
      <div v-if="user.skills && user.skills.length > 0" class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">기술 스택</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="skill in user.skills" :key="skill.name" class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="font-medium text-gray-800 mb-2">{{ skill.name }}</p>
            <div class="mt-2 bg-gray-200 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full" :style="`width: ${skill.level || 50}%`"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 프로젝트 -->
      <div v-if="user.projects && user.projects.length > 0" class="bg-white rounded-xl shadow-lg p-8">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">프로젝트</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="project in user.projects" :key="project.id" class="border border-gray-200 rounded-lg p-6">
            <div class="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4">
              <img v-if="project.image_url" :src="project.image_url" :alt="project.title" class="w-full h-full rounded-lg object-cover">
            </div>
            <h4 class="text-xl font-bold text-gray-800 mb-2">{{ project.title }}</h4>
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            <div v-if="project.technologies" class="flex flex-wrap gap-2">
              <span v-for="tech in project.technologies" :key="tech" 
                    class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center items-center min-h-96">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">사용자를 찾을 수 없습니다</h2>
        <p class="text-gray-600">요청하신 포트폴리오가 존재하지 않습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioUser',
  data() {
    return {
      user: null,
      loading: true
    }
  },
  computed: {
    username() {
      return this.$route.params.username
    },
    userId() {
      return this.$route.params.userId
    }
  },
  async mounted() {
    await this.fetchUserData()
  },
  methods: {
    async fetchUserData() {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.user = {
          name: this.username,
          title: 'Vue.js 개발자',
          bio: '사용자 중심의 웹 애플리케이션을 개발하는 것을 좋아합니다.',
          avatar_url: null,
          skills: [
            { name: 'Vue.js', level: 90 },
            { name: 'JavaScript', level: 85 },
            { name: 'CSS', level: 80 },
            { name: 'Node.js', level: 75 }
          ],
          projects: [
            {
              id: 1,
              title: '개인 블로그',
              description: 'Vue.js로 만든 개인 블로그입니다.',
              technologies: ['Vue.js', 'Nuxt.js', 'Markdown'],
              image_url: null
            },
            {
              id: 2,
              title: '할일 관리 앱',
              description: '간단한 할일 관리 애플리케이션입니다.',
              technologies: ['Vue.js', 'Vuex', 'LocalStorage'],
              image_url: null
            }
          ]
        }
      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error)
        this.user = null
      } finally {
        this.loading = false
      }
    }
  }
}
</script>