<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">데모 포트폴리오</h1>
          <a href="http://localhost:3001" class="text-blue-600 hover:text-blue-700">← 돌아가기</a>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-12">
      <!-- 프로필 섹션 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span class="text-4xl font-bold text-white">홍</span>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">홍길동</h2>
            <p class="text-xl text-blue-600 mb-4">풀스택 개발자</p>
            <p class="text-gray-600 leading-relaxed">
              5년 경력의 풀스택 개발자로, 현대적인 웹 기술을 활용해 사용자 중심의 애플리케이션을 개발합니다. 
              프론트엔드와 백엔드 모두에서 깊은 경험을 보유하고 있으며, 새로운 기술 습득을 즐깁니다.
            </p>
          </div>
        </div>
      </div>

      <!-- 기술 스택 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">기술 스택</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="skill in skills" :key="skill.name" class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl mb-2">{{ skill.icon }}</div>
            <p class="font-medium text-gray-800">{{ skill.name }}</p>
            <div class="mt-2 bg-gray-200 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full" :style="`width: ${skill.level}%`"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 프로젝트 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">주요 프로젝트</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="project in projects" :key="project.id" class="border border-gray-200 rounded-lg p-6">
            <div class="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4"></div>
            <h4 class="text-xl font-bold text-gray-800 mb-2">{{ project.title }}</h4>
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
</template>

<script>
export default {
  name: 'PortfolioDemo',
  data() {
    return {
      skills: [
        { name: 'JavaScript', icon: '🟨', level: 90 },
        { name: 'Vue.js', icon: '💚', level: 85 },
        { name: 'React', icon: '⚛️', level: 80 },
        { name: 'Node.js', icon: '🟢', level: 85 },
        { name: 'Python', icon: '🐍', level: 75 },
        { name: 'PostgreSQL', icon: '🐘', level: 80 },
        { name: 'Docker', icon: '🐳', level: 70 },
        { name: 'AWS', icon: '☁️', level: 75 }
      ],
      projects: [
        {
          id: 1,
          title: 'E-커머스 플랫폼',
          description: '완전한 온라인 쇼핑 플랫폼으로 결제 시스템과 관리자 대시보드를 포함합니다.',
          technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe']
        },
        {
          id: 2,
          title: '실시간 채팅 애플리케이션',
          description: 'WebSocket을 활용한 실시간 메시지 기능과 파일 공유 기능을 제공합니다.',
          technologies: ['React', 'Socket.io', 'Express', 'MongoDB']
        },
        {
          id: 3,
          title: '프로젝트 관리 도구',
          description: '팀 협업을 위한 프로젝트 관리 및 작업 추적 도구입니다.',
          technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind']
        },
        {
          id: 4,
          title: '데이터 시각화 대시보드',
          description: '복잡한 데이터를 직관적인 차트와 그래프로 표현하는 대시보드입니다.',
          technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI']
        }
      ]
    }
  }
}
</script>