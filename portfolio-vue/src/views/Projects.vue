<template>
  <div>
    <!-- 프로젝트 헤더 섹션 -->
    <section class="projects-header">
      <div class="container">
        <h1 class="page-title fade-in">My Projects</h1>
        <p class="page-subtitle fade-in">지금까지 진행한 프로젝트들을 소개합니다</p>
      </div>
    </section>

    <!-- 프로젝트 필터 섹션 -->
    <section class="projects-filter">
      <div class="container">
        <div class="filter-buttons fade-in">
          <button 
            class="filter-btn" 
            :class="{ active: selectedFilter === 'all' }"
            @click="filterProjects('all')"
          >
            전체
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: selectedFilter === 'web' }"
            @click="filterProjects('web')"
          >
            웹 개발
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: selectedFilter === 'frontend' }"
            @click="filterProjects('frontend')"
          >
            프론트엔드
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: selectedFilter === 'fullstack' }"
            @click="filterProjects('fullstack')"
          >
            풀스택
          </button>
        </div>
      </div>
    </section>

    <!-- 프로젝트 목록 섹션 -->
    <section class="projects-section">
      <div class="container">
        <div class="projects-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card fade-in"
            :data-category="project.category"
          >
            <div class="project-image" :style="{ background: project.gradient }">
              {{ project.emoji }}
            </div>
            <div class="project-content">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tech">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
              <div class="project-details">
                <h4>주요 기능</h4>
                <ul>
                  <li v-for="feature in project.features" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div class="project-links">
                <a href="#" class="project-link">Live Demo</a>
                <a href="#" class="project-link">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Projects',
  data() {
    return {
      selectedFilter: 'all',
      projects: [
        {
          id: 1,
          title: '포트폴리오 웹사이트',
          description: '반응형 디자인과 애니메이션 효과를 적용한 개인 포트폴리오 웹사이트입니다. 순수 HTML, CSS, JavaScript로 제작했습니다.',
          emoji: '🌐',
          gradient: 'linear-gradient(45deg, #667eea, #764ba2)',
          category: 'frontend web',
          technologies: ['HTML', 'CSS', 'JavaScript', '반응형'],
          features: [
            '반응형 웹 디자인',
            '스크롤 애니메이션',
            '스무스 스크롤 네비게이션',
            '연락처 폼'
          ]
        },
        {
          id: 2,
          title: '할일 관리 앱 (To-Do List)',
          description: 'Spring Boot와 Supabase를 활용한 할일 관리 웹 애플리케이션입니다. CRUD 기능과 카테고리 분류 기능을 구현했습니다.',
          emoji: '📝',
          gradient: 'linear-gradient(45deg, #ff6b6b, #feca57)',
          category: 'fullstack web',
          technologies: ['Java', 'Spring Boot', 'Supabase', 'PostgreSQL'],
          features: [
            '할일 추가/수정/삭제',
            '카테고리별 분류',
            '완료 상태 관리',
            '우선순위 설정'
          ]
        },
        {
          id: 3,
          title: '아이디어 노트',
          description: '개발 공부하면서 얻은 아이디어들을 정리하는 개인 블로그입니다. 마크다운 에디터와 태그 시스템을 구현했습니다.',
          emoji: '💡',
          gradient: 'linear-gradient(45deg, #a8edea, #fed6e3)',
          category: 'fullstack web',
          technologies: ['JavaScript', 'Spring Boot', 'PostgreSQL', 'Markdown'],
          features: [
            '마크다운 에디터',
            '태그 시스템',
            '검색 기능',
            '카테고리 분류'
          ]
        },
        {
          id: 4,
          title: '북마크 관리 사이트',
          description: '웹사이트 URL을 저장하고 카테고리별로 정리할 수 있는 북마크 관리 시스템입니다. 검색과 공유 기능을 포함합니다.',
          emoji: '🔖',
          gradient: 'linear-gradient(45deg, #ff9a9e, #fecfef)',
          category: 'fullstack web',
          technologies: ['Java', 'Spring Boot', 'Supabase', 'Railway'],
          features: [
            'URL 저장 및 관리',
            '카테고리별 정리',
            '키워드 검색',
            '즐겨찾기 기능'
          ]
        },
        {
          id: 5,
          title: '간단한 쇼핑몰',
          description: 'Spring Boot를 활용한 간단한 온라인 쇼핑몰입니다. 상품 관리, 장바구니, 주문 기능을 구현했습니다.',
          emoji: '🛒',
          gradient: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
          category: 'fullstack web',
          technologies: ['Java', 'Spring Boot', 'JPA', 'PostgreSQL'],
          features: [
            '상품 등록/관리',
            '장바구니 기능',
            '주문 관리',
            '회원 관리'
          ]
        },
        {
          id: 6,
          title: '날씨 앱',
          description: '외부 API를 활용한 날씨 정보 웹 애플리케이션입니다. 현재 날씨와 5일 예보를 제공합니다.',
          emoji: '🌤️',
          gradient: 'linear-gradient(45deg, #74b9ff, #0984e3)',
          category: 'frontend web',
          technologies: ['JavaScript', 'API', 'CSS', 'LocalStorage'],
          features: [
            '현재 날씨 조회',
            '5일 날씨 예보',
            '도시 검색',
            '즐겨찾기 도시'
          ]
        }
      ]
    }
  },
  computed: {
    filteredProjects() {
      if (this.selectedFilter === 'all') {
        return this.projects
      }
      return this.projects.filter(project => 
        project.category.includes(this.selectedFilter)
      )
    }
  },
  mounted() {
    this.observeElements()
  },
  methods: {
    filterProjects(filter) {
      this.selectedFilter = filter
    },
    observeElements() {
      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, options)

      this.$nextTick(() => {
        const fadeElements = document.querySelectorAll('.fade-in')
        fadeElements.forEach(el => observer.observe(el))
      })
    }
  }
}
</script>

<style scoped>
/* 프로젝트 헤더 */
.projects-header {
  padding: 120px 0 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: white;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 프로젝트 필터 */
.projects-filter {
  background: #f8f9fa;
  padding: 40px 0;
  text-align: center;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 24px;
  border: 2px solid #3498db;
  background: transparent;
  color: #3498db;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
}

/* 프로젝트 그리드 */
.projects-section {
  padding: 60px 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.project-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.project-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
}

.project-content {
  padding: 2rem;
}

.project-content h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.project-content p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.project-details {
  margin-bottom: 1.5rem;
}

.project-details h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.project-details ul {
  list-style: none;
  padding: 0;
}

.project-details li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.project-details li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3498db;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.project-link:hover {
  color: #2980b9;
}

/* 반응형 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-buttons {
    justify-content: center;
  }
}
</style>