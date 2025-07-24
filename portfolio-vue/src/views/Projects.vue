<template>
  <div>
    <Navigation />
    <div class="pt-16 min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-8 py-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">프로젝트</h1>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="project in projects" :key="project.id" class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 mb-4">{{ project.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="tech in project.technologies" :key="tech" 
                      class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  {{ tech }}
                </span>
              </div>
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
  name: 'Projects',
  components: {
    Navigation
  },
  data() {
    return {
      projects: [
        {
          id: 1,
          title: '포트폴리오 웹사이트',
          description: 'Vue.js로 만든 반응형 포트폴리오 웹사이트',
          technologies: ['Vue.js', 'Tailwind CSS', 'JavaScript']
        },
        {
          id: 2,
          title: '할일 관리 앱',
          description: '사용자 친화적인 할일 관리 애플리케이션',
          technologies: ['React', 'Node.js', 'MongoDB']
        },
        {
          id: 3,
          title: 'E-커머스 플랫폼',
          description: '온라인 쇼핑몰 플랫폼 개발',
          technologies: ['Next.js', 'PostgreSQL', 'Stripe']
        }
      ]
    }
  }
}
</script>