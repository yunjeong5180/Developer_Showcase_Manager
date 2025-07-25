<template>
  <div>
    <!-- About Me 헤더 -->
    <section class="about-header">
      <div class="container">
        <h1 class="page-title">About Me</h1>
        
        <!-- 프로필 섹션 -->
        <div class="profile-section">
          <div class="profile-container">
            <div class="profile-left">
              <div class="profile-img">
                <span>👩‍💻</span>
              </div>
            </div>
            <div class="profile-right">
              <h2>개발자를 꿈꾸는 양윤정</h2>
              <p class="profile-description">
                비전공자에서 시작한 개발 여정을 통해 HTML, CSS, JavaScript부터<br>
                시작해서 Java, Spring Boot까지 차근차근 배워나가고 있습니다.
              </p>
              <p class="profile-sub">
                새로운 기술을 배우는 것을 좋아하고, 사용자 친화적인 웹 애플리케이션을 만들기 위해 노력하고<br>
                있습니다. 매일 조금씩이라도 성장하는 개발자가 되는 것이 목표입니다.
              </p>
              <p class="profile-sub">
                현재는 IntelliJ IDEA를 주로 사용하며, GitHub으로 형상 관리를 하면서 프로젝트를 진행하고 있습니다. 클린 코드와 사용<br>
                자 경험을 중시하며, Supabase와 Railway를 활용해 프로젝트를 배포하고 있습니다.
              </p>
              
              <!-- 기술 스택 -->
              <div class="skills-container">
                <span class="skill-tag">HTML/CSS</span>
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">Java</span>
                <span class="skill-tag">Spring Boot</span>
                <span class="skill-tag">Git/GitHub</span>
                <span class="skill-tag">IntelliJ IDEA</span>
                <span class="skill-tag">Supabase</span>
                <span class="skill-tag">Railway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 학습 여정 섹션 -->
    <section class="journey-section">
      <div class="container">
        <h2 class="section-title">학습 여정</h2>
        
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">2024.01</div>
            <div class="timeline-content">
              <h3>웹 개발 학습 시작</h3>
              <p>HTML, CSS 기초부터 시작하여 웹페이지 구조를 이해하고 디자인 다루기 시작했습니다.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-date">2024.03</div>
            <div class="timeline-content">
              <h3>JavaScript 학습</h3>
              <p>동적인 웹 페이지를 만들기 위해 JavaScript의 기초부터 다양한 프로젝트를 진행했습니다.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-date">2024.06</div>
            <div class="timeline-content">
              <h3>Java & Spring Boot 학습</h3>
              <p>백엔드 개발을 위해 Java와 Spring Boot를 학습하고 웹 애플리케이션을 개발했습니다.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-date">2024.09</div>
            <div class="timeline-content">
              <h3>클라우드 서비스 활용</h3>
              <p>Supabase와 Railway를 활용해 실제 서비스를 배포하고 운영하는 경험을 쌓았습니다.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-date">현재</div>
            <div class="timeline-content">
              <h3>지속적인 성장</h3>
              <p>매일 새로운 것을 배우고, 더 나은 코드를 작성하기 위해 노력하고 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 관심사 & 목표 섹션 -->
    <section class="interests-section">
      <div class="container">
        <h2 class="section-title">관심사 & 목표</h2>
        
        <div class="interests-grid">
          <div class="interest-card">
            <div class="interest-icon">🎯</div>
            <h3>목표</h3>
            <p>풀스택 개발자로 성장하여 사용자에게 가치있는 서비스를 제공하는 것이 목표입니다.</p>
          </div>
          
          <div class="interest-card">
            <div class="interest-icon">📚</div>
            <h3>학습</h3>
            <p>새로운 기술과 트렌드에 관심을 가지고 꾸준히 학습하며, 지식을 실무에 적용하려 노력합니다.</p>
          </div>
          
          <div class="interest-card">
            <div class="interest-icon">💡</div>
            <h3>혁신</h3>
            <p>창의적인 문제해결과 사용자 경험 개선을 통해 더 나은 서비스를 만들어가고 있습니다.</p>
          </div>
          
          <div class="interest-card">
            <div class="interest-icon">🚀</div>
            <h3>도전</h3>
            <p>새로운 도전을 두려워하지 않으며, 실패를 통해 배우고 성장하는 마인드셋을 가지고 있습니다.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About',
  mounted() {
    this.observeElements()
  },
  methods: {
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

      const fadeElements = document.querySelectorAll('.fade-in')
      fadeElements.forEach(el => observer.observe(el))
    }
  }
}
</script>

<style scoped>
/* About 헤더 */
.about-header {
  background: #f8f9fa;
  padding: 100px 0 60px;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 3rem;
  position: relative;
}

.page-title::after {
  content: '';
  width: 50px;
  height: 3px;
  background: #3498db;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

/* 프로필 섹션 */
.profile-section {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: center;
}

.profile-left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-img {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.profile-img span {
  font-size: 5rem;
}

.profile-right {
  text-align: left;
}

.profile-right h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.profile-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.profile-sub {
  font-size: 1rem;
  color: #777;
  line-height: 1.7;
  margin-bottom: 1rem;
}

/* 기술 스택 */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 2rem;
}

.skill-tag {
  background: #3498db;
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

/* 학습 여정 섹션 */
.journey-section {
  padding: 80px 0;
  background: white;
}

.timeline {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 150px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #3498db;
}

.timeline-item {
  position: relative;
  padding: 25px 0;
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 144px;
  top: 35px;
  width: 15px;
  height: 15px;
  background: #3498db;
  border-radius: 50%;
  z-index: 1;
}

.timeline-date {
  width: 120px;
  text-align: left;
  color: #3498db;
  font-weight: 600;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
  padding-left: 30px;
}

.timeline-content h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.timeline-content p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 관심사 & 목표 섹션 */
.interests-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.interest-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.interest-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.interest-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.interest-card h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.interest-card p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
}

/* 반응형 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .profile-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .profile-img {
    width: 150px;
    height: 150px;
  }
  
  .profile-img span {
    font-size: 4rem;
  }
  
  .profile-right {
    text-align: center;
  }
  
  .profile-right h2 {
    font-size: 1.5rem;
  }
  
  .skills-container {
    justify-content: center;
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item {
    flex-direction: column;
    gap: 10px;
  }
  
  .timeline-item::before {
    left: 14px;
    top: 25px;
  }
  
  .timeline-date {
    width: 100%;
    padding-left: 50px;
    margin-bottom: 5px;
  }
  
  .timeline-content {
    padding-left: 50px;
  }
  
  .interests-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .interests-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>