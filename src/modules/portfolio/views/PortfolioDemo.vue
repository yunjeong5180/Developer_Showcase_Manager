<template>
  <div class="portfolio-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">데모 포트폴리오</h1>
        <p class="hero-subtitle">개발자 포트폴리오 예시를 확인해보세요</p>
      </div>
    </div>

    <div class="content-container">
      <!-- 프로필 섹션 -->
      <section class="profile-section">
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">
              <span>홍</span>
            </div>
            <div class="profile-info">
              <h2 class="profile-name">홍길동</h2>
              <p class="profile-title">풀스택 개발자</p>
              <p class="profile-bio">
                5년 경력의 풀스택 개발자로, 현대적인 웹 기술을 활용해 사용자 중심의 애플리케이션을 개발합니다. 
                프론트엔드와 백엔드 모두에서 깊은 경험을 보유하고 있으며, 새로운 기술 습득을 즐깁니다.
              </p>
              <div class="profile-links">
                <a href="#" class="link-btn">
                  <span>🐙</span> GitHub
                </a>
                <a href="#" class="link-btn">
                  <span>💼</span> LinkedIn
                </a>
                <a href="#" class="link-btn">
                  <span>🌐</span> Blog
                </a>
                <a href="#" class="link-btn">
                  <span>📧</span> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 기술 스택 -->
      <section class="skills-section">
        <h2 class="section-title">🛠 기술 스택</h2>
        <div class="skills-grid">
          <div v-for="skill in skills" :key="skill.name" class="skill-card">
            <div class="skill-header">
              <span class="skill-icon">{{ skill.icon }}</span>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
            <div class="skill-level">
              <div class="level-bar">
                <div class="level-fill" :style="`width: ${skill.level}%`"></div>
              </div>
              <span class="level-text">{{ skill.level }}%</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 프로젝트 -->
      <section class="projects-section">
        <h2 class="section-title">💼 주요 프로젝트</h2>
        <div class="projects-grid">
          <div v-for="project in projects" :key="project.id" class="project-card">
            <div class="project-image">
              <div class="image-placeholder">
                <span>{{ project.title.charAt(0) }}</span>
              </div>
            </div>
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-technologies">
                <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
              <div class="project-actions">
                <a href="#" class="action-btn">자세히 보기</a>
                <a href="#" class="action-btn-outline">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 경력 -->
      <section class="experience-section">
        <h2 class="section-title">💼 경력 사항</h2>
        <div class="timeline">
          <div v-for="exp in experiences" :key="exp.id" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3 class="company">{{ exp.company }}</h3>
              <p class="position">{{ exp.position }}</p>
              <p class="period">{{ exp.period }}</p>
              <p class="description">{{ exp.description }}</p>
              <ul class="achievements">
                <li v-for="(achievement, index) in exp.achievements" :key="index">
                  {{ achievement }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 교육 -->
      <section class="education-section">
        <h2 class="section-title">🎓 교육</h2>
        <div class="education-list">
          <div v-for="edu in education" :key="edu.id" class="education-item">
            <div class="edu-icon">🎓</div>
            <div class="edu-content">
              <h3>{{ edu.school }}</h3>
              <p class="degree">{{ edu.degree }}</p>
              <p class="period">{{ edu.period }}</p>
            </div>
          </div>
        </div>
      </section>
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
      ],
      experiences: [
        {
          id: 1,
          company: '테크스타트업 A',
          position: '시니어 풀스택 개발자',
          period: '2021.03 - 현재',
          description: '핀테크 플랫폼 개발 및 유지보수',
          achievements: [
            '마이크로서비스 아키텍처 도입으로 시스템 확장성 200% 향상',
            'CI/CD 파이프라인 구축으로 배포 시간 80% 단축',
            '신규 결제 시스템 개발로 거래 처리량 3배 증가'
          ]
        },
        {
          id: 2,
          company: 'IT 기업 B',
          position: '풀스택 개발자',
          period: '2019.01 - 2021.02',
          description: 'B2B SaaS 플랫폼 개발',
          achievements: [
            'React 기반 대시보드 개발로 사용자 만족도 95% 달성',
            'RESTful API 설계 및 구현',
            '데이터베이스 최적화로 쿼리 성능 60% 개선'
          ]
        }
      ],
      education: [
        {
          id: 1,
          school: '서울대학교',
          degree: '컴퓨터공학 학사',
          period: '2015.03 - 2019.02'
        },
        {
          id: 2,
          school: '부트캠프',
          degree: '풀스택 웹 개발 과정',
          period: '2018.07 - 2018.12'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/shared/styles/variables' as *;

.portfolio-page {
  min-height: 100vh;
  background: $gray-100;
}

.hero-section {
  background: $gradient-primary;  // 차콜 블랙 그라디언트로 통일
  padding: 100px 20px 60px;
  
  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    
    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      color: white;  // 검정 배경에 흰색 텍스트
      margin-bottom: 16px;
      animation: fadeInDown 0.8s ease;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);  // 밝은 회색 텍스트
      animation: fadeInUp 0.8s ease;
    }
  }
}

.content-container {
  max-width: 1200px;
  margin: -40px auto 0;
  padding: 0 20px 60px;
  position: relative;
  z-index: 1;
}

section {
  margin-bottom: 60px;
  
  .section-title {
    font-size: 2rem;
    color: $gray-900;
    margin-bottom: 40px;
    text-align: center;
  }
}

.profile-section {
  .profile-card {
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-lg;
    overflow: hidden;
    
    .profile-header {
      padding: 40px;
      display: flex;
      gap: 40px;
      align-items: center;
      
      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        text-align: center;
      }
      
      .profile-avatar {
        width: 150px;
        height: 150px;
        background: $gradient-primary;  // 차콜 블랙 그라디언트
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        span {
          font-size: 4rem;
          font-weight: 700;
          color: white;
        }
      }
      
      .profile-info {
        flex: 1;
        
        .profile-name {
          font-size: 2.5rem;
          font-weight: 700;
          color: $gray-900;
          margin-bottom: 8px;
        }
        
        .profile-title {
          font-size: 1.5rem;
          color: $primary-color;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .profile-bio {
          color: $gray-600;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        
        .profile-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          
          @media (max-width: $breakpoint-md) {
            justify-content: center;
          }
          
          .link-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: $gray-100;
            color: $gray-700;
            border-radius: $border-radius-lg;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            
            &:hover {
              background: $primary-color;
              color: white;
              transform: translateY(-2px);
              box-shadow: $shadow-sm;
            }
          }
        }
      }
    }
  }
}

.skills-section {
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    
    .skill-card {
      background: white;
      padding: 24px;
      border-radius: $border-radius-lg;
      box-shadow: $shadow;
      
      .skill-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        
        .skill-icon {
          font-size: 1.5rem;
        }
        
        .skill-name {
          font-weight: 600;
          color: $gray-900;
          font-size: 1.125rem;
        }
      }
      
      .skill-level {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .level-bar {
          flex: 1;
          height: 8px;
          background: $gray-200;
          border-radius: 4px;
          overflow: hidden;
          
          .level-fill {
            height: 100%;
            background: linear-gradient(90deg, $primary-color 0%, $primary-dark 100%);
            border-radius: 4px;
            transition: width 1s ease;
          }
        }
        
        .level-text {
          font-weight: 600;
          color: $primary-color;
          min-width: 45px;
          text-align: right;
        }
      }
    }
  }
}

.projects-section {
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    
    .project-card {
      background: white;
      border-radius: $border-radius-lg;
      box-shadow: $shadow;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: $shadow-lg;
      }
      
      .project-image {
        height: 200px;
        background: linear-gradient(135deg, $gray-200 0%, $gray-300 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .image-placeholder {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          span {
            font-size: 2rem;
            font-weight: 700;
            color: $primary-color;
          }
        }
      }
      
      .project-content {
        padding: 24px;
        
        .project-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: $gray-900;
          margin-bottom: 12px;
        }
        
        .project-description {
          color: $gray-600;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
          
          .tech-tag {
            padding: 6px 12px;
            background: $primary-light;
            color: $primary-dark;
            border-radius: $border-radius;
            font-size: 0.875rem;
            font-weight: 500;
          }
        }
        
        .project-actions {
          display: flex;
          gap: 12px;
          
          .action-btn,
          .action-btn-outline {
            padding: 10px 20px;
            border-radius: $border-radius;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            text-align: center;
            flex: 1;
          }
          
          .action-btn {
            background: $primary-color;
            color: white;
            
            &:hover {
              background: $primary-dark;
            }
          }
          
          .action-btn-outline {
            border: 2px solid $primary-color;
            color: $primary-color;
            
            &:hover {
              background: $primary-color;
              color: white;
            }
          }
        }
      }
    }
  }
}

.experience-section {
  .timeline {
    position: relative;
    padding-left: 40px;
    
    &::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: $gray-300;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 40px;
      
      .timeline-marker {
        position: absolute;
        left: -25px;
        top: 8px;
        width: 12px;
        height: 12px;
        background: $primary-color;
        border-radius: 50%;
        box-shadow: 0 0 0 4px white, 0 0 0 6px $primary-light;
      }
      
      .timeline-content {
        background: white;
        padding: 24px;
        border-radius: $border-radius-lg;
        box-shadow: $shadow;
        
        .company {
          font-size: 1.25rem;
          font-weight: 700;
          color: $gray-900;
          margin-bottom: 8px;
        }
        
        .position {
          color: $primary-color;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .period {
          color: $gray-500;
          font-size: 0.875rem;
          margin-bottom: 16px;
        }
        
        .description {
          color: $gray-600;
          margin-bottom: 16px;
        }
        
        .achievements {
          list-style: none;
          padding: 0;
          
          li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 8px;
            color: $gray-600;
            
            &::before {
              content: '✓';
              position: absolute;
              left: 0;
              color: $success-color;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

.education-section {
  .education-list {
    display: grid;
    gap: 20px;
    
    .education-item {
      background: white;
      padding: 24px;
      border-radius: $border-radius-lg;
      box-shadow: $shadow;
      display: flex;
      gap: 24px;
      align-items: center;
      
      .edu-icon {
        font-size: 2.5rem;
      }
      
      .edu-content {
        flex: 1;
        
        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: $gray-900;
          margin-bottom: 8px;
        }
        
        .degree {
          color: $primary-color;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .period {
          color: $gray-500;
          font-size: 0.875rem;
        }
      }
    }
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: $breakpoint-md) {
  .hero-section {
    padding: 60px 20px 40px;
    
    .hero-content {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
    }
  }
  
  section {
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 30px;
    }
  }
}
</style>