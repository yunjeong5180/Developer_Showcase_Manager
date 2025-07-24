<template>
  <nav :class="[
    'fixed top-0 w-full z-50 transition-all duration-300',
    isScrolled 
      ? 'bg-white/98 backdrop-blur-md shadow-lg' 
      : 'bg-white/95 backdrop-blur-sm'
  ]">
    <div class="max-w-7xl mx-auto px-8">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="text-2xl font-bold text-gray-800">
          Portfolio
        </router-link>
        <ul class="flex space-x-8">
          <li>
            <router-link 
              to="/" 
              :class="[
                'hover:text-blue-600 transition-colors',
                $route.path === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              ]"
            >
              홈
            </router-link>
          </li>
          <li>
            <router-link 
              to="/about" 
              :class="[
                'hover:text-blue-600 transition-colors',
                $route.path === '/about' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              ]"
            >
              소개
            </router-link>
          </li>
          <li>
            <router-link 
              to="/projects" 
              :class="[
                'hover:text-blue-600 transition-colors',
                $route.path === '/projects' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              ]"
            >
              프로젝트
            </router-link>
          </li>
          <li>
            <router-link 
              to="/contact" 
              :class="[
                'hover:text-blue-600 transition-colors',
                $route.path === '/contact' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              ]"
            >
              연락처
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Navigation',
  setup() {
    const isScrolled = ref(false)

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 10
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isScrolled
    }
  }
}
</script>