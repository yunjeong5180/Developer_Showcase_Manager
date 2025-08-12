<template>
  <div class="home">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">{{ title }}</span>
        </h1>
        <p class="hero-subtitle">
          {{ subtitle }}
        </p>
        <p class="hero-description">
          {{ description }}
        </p>
        <div class="hero-actions">
          <router-link to="/portfolio" class="btn btn-primary">
            포트폴리오 둘러보기
          </router-link>
          <router-link to="/signup" class="btn btn-secondary">
            시작하기
          </router-link>
        </div>
      </div>
      <div class="hero-visual">
        <div class="code-block">
          <div class="code-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <pre class="code-content">
<span class="keyword">const</span> <span class="variable">developer</span> = {
  <span class="property">name</span>: <span class="string">"{{ developerName }}"</span>,
  <span class="property">skills</span>: [<span v-for="(skill, index) in skills" :key="index"><span class="string">"{{ skill }}"</span><span v-if="index < skills.length - 1">, </span></span>],
  <span class="property">portfolio</span>: <span class="string">"{{ portfolioUrl }}"</span>,
  <span class="property">passion</span>: <span class="keyword">{{ passion }}</span>
};</pre>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Codit?</h2>
        <div class="features-grid">
          <div 
            v-for="feature in features" 
            :key="feature.id"
            class="feature-card"
            @click="handleFeatureClick(feature)"
            :class="{ active: selectedFeature?.id === feature.id }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>{{ ctaTitle }}</h2>
        <p>{{ ctaDescription }}</p>
        <button @click="handleGetStarted" class="btn btn-large">
          {{ ctaButtonText }}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
// Composition API 사용
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: "HomeViewComposition",
  
  // setup 함수가 Composition API의 진입점
  setup() {
    // Router와 Store 인스턴스
    const router = useRouter()
    const store = useStore()
    
    // 반응형 데이터 (ref는 단일 값, reactive는 객체)
    const title = ref('Welcome to Codit')
    const subtitle = ref('개발자를 위한 포트폴리오 플랫폼')
    const description = ref('나만의 포트폴리오를 만들고, 프로젝트를 관리하며, 성장을 기록하세요')
    
    // 개발자 정보 (reactive로 객체 관리)
    const developerInfo = reactive({
      name: 'Your Name',
      skills: ['Vue.js', 'React', 'Node.js'],
      portfolioUrl: 'codit.dev/yourname',
      passion: true
    })
    
    // 기능 목록
    const features = ref([
      {
        id: 1,
        icon: '📋',
        title: '프로젝트 관리',
        description: '모든 프로젝트를 한 곳에서 체계적으로 관리하세요'
      },
      {
        id: 2,
        icon: '🎨',
        title: '커스텀 포트폴리오',
        description: '나만의 스타일로 포트폴리오를 꾸며보세요'
      },
      {
        id: 3,
        icon: '📊',
        title: '성장 추적',
        description: '개발자로서의 성장 과정을 기록하고 분석하세요'
      },
      {
        id: 4,
        icon: '🔗',
        title: '간편한 공유',
        description: '하나의 링크로 포트폴리오를 쉽게 공유하세요'
      }
    ])
    
    // 선택된 기능
    const selectedFeature = ref(null)
    
    // CTA 섹션 데이터
    const ctaTitle = ref('지금 시작하세요')
    const ctaDescription = ref('무료로 포트폴리오를 만들고 관리해보세요')
    const ctaButtonText = ref('무료로 시작하기')
    
    // Computed 속성 (계산된 값)
    const developerName = computed(() => developerInfo.name)
    const skills = computed(() => developerInfo.skills)
    const portfolioUrl = computed(() => developerInfo.portfolioUrl)
    const passion = computed(() => developerInfo.passion)
    
    // Methods (메서드)
    const handleFeatureClick = (feature) => {
      selectedFeature.value = feature
      console.log('선택된 기능:', feature.title)
      
      // Vuex store에 알림 표시
      store.dispatch('showNotification', {
        message: `${feature.title} 기능을 선택했습니다`,
        type: 'info'
      })
    }
    
    const handleGetStarted = () => {
      console.log('시작하기 버튼 클릭')
      router.push('/signup')
    }
    
    // 라이프사이클 훅
    onMounted(() => {
      console.log('HomeView 컴포넌트가 마운트되었습니다')
      
      // 예시: API 호출이나 초기화 작업
      loadUserPreferences()
    })
    
    onUnmounted(() => {
      console.log('HomeView 컴포넌트가 언마운트되었습니다')
      
      // 예시: 이벤트 리스너 제거나 정리 작업
      cleanup()
    })
    
    // 헬퍼 함수들
    const loadUserPreferences = async () => {
      // 사용자 설정 로드 (예시)
      try {
        // const preferences = await api.getPreferences()
        // developerInfo.name = preferences.name || 'Your Name'
      } catch (error) {
        console.error('설정 로드 실패:', error)
      }
    }
    
    const cleanup = () => {
      // 정리 작업
    }
    
    // setup에서 템플릿에 노출할 항목들을 반환
    return {
      // 데이터
      title,
      subtitle,
      description,
      developerName,
      skills,
      portfolioUrl,
      passion,
      features,
      selectedFeature,
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      
      // 메서드
      handleFeatureClick,
      handleGetStarted
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/shared/styles/variables' as *;

.home {
  background: $gray-100;
  min-height: calc(100vh - 60px);
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 60px;

  @media (max-width: $breakpoint-lg) {
    flex-direction: column;
    padding: 60px 20px;
  }
}

.hero-content {
  flex: 1;
  max-width: 500px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;

  @media (max-width: $breakpoint-md) {
    font-size: 2.5rem;
  }
}

.gradient-text {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: $gray-700;
  margin-bottom: 15px;
  font-weight: 600;
}

.hero-description {
  font-size: 1.1rem;
  color: $gray-600;
  line-height: 1.6;
  margin-bottom: 30px;
}

.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: $border-radius-lg;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  cursor: pointer;
  border: none;

  &-primary {
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: white;
    box-shadow: $shadow;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }
  }

  &-secondary {
    background: white;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover {
      background: $primary-color;
      color: white;
    }
  }

  &-large {
    padding: 16px 32px;
    font-size: 1.2rem;
  }
}

.hero-visual {
  flex: 1;
  max-width: 500px;
}

.code-block {
  background: $gray-900;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  overflow: hidden;
}

.code-header {
  background: $gray-800;
  padding: 10px 15px;
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.red { background: #ff5f56; }
  &.yellow { background: #ffbd2e; }
  &.green { background: #27c93f; }
}

.code-content {
  color: #abb2bf;
  padding: 20px;
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;

  .keyword { color: #c678dd; }
  .variable { color: #e06c75; }
  .property { color: #e06c75; }
  .string { color: #98c379; }
}

.features-section {
  background: white;
  padding: 80px 40px;

  @media (max-width: $breakpoint-md) {
    padding: 60px 20px;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 50px;
  color: $gray-900;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  text-align: center;
  padding: 30px;
  border-radius: $border-radius-lg;
  background: $gray-50;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow;
    background: white;
  }
  
  &.active {
    background: white;
    box-shadow: $shadow;
    border: 2px solid $primary-color;
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: $gray-900;
  }

  p {
    color: $gray-600;
    line-height: 1.6;
  }
}

.cta-section {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  color: white;
  text-align: center;
  padding: 80px 40px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
  }

  .btn {
    background: white;
    color: $primary-color;

    &:hover {
      background: $gray-100;
    }
  }
}
</style>