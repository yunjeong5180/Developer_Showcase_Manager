<template>
  <div>
    <!-- Contact 헤더 -->
    <section class="contact-header">
      <div class="container">
        <h1 class="page-title">Contact Me</h1>
        <p class="page-subtitle">언제든지 편하게 연락주세요!</p>
      </div>
    </section>

    <!-- 연락처 정보 섹션 -->
    <section class="contact-info-section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">📧</div>
            <h3>이메일</h3>
            <p>yunjeong5180@naver.com</p>
            <a href="mailto:yunjeong5180@naver.com" class="contact-link">이메일 보내기</a>
          </div>
          
          <div class="contact-card">
            <div class="contact-icon">📱</div>
            <h3>전화</h3>
            <p>010-6421-5199</p>
            <a href="tel:010-6421-5199" class="contact-link">전화 걸기</a>
          </div>
          
          <div class="contact-card">
            <div class="contact-icon">💻</div>
            <h3>GitHub</h3>
            <p>github.com/yang-yoonjeong</p>
            <a href="https://github.com/yang-yoonjeong" target="_blank" class="contact-link">GitHub 보기</a>
          </div>
          
          <div class="contact-card">
            <div class="contact-icon">💼</div>
            <h3>LinkedIn</h3>
            <p>linkedin.com/in/yang-yoonjeong</p>
            <a href="https://linkedin.com/in/yang-yoonjeong" target="_blank" class="contact-link">LinkedIn 보기</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 메시지 보내기 섹션 -->
    <section class="message-section">
      <div class="container">
        <h2 class="section-title">메시지를 보내주세요</h2>
        <p class="section-subtitle">
          궁금하신 점이 있거나 함께 일할 기회가 있다면 언제든지 연락주세요! 최대한 빠르게 답변드리겠습니다.
        </p>
        
        <div class="message-form-container">
          <div class="form-left">
            <h3>위치</h3>
            <p class="location-info">
              <span class="location-icon">🏴</span>
              Seoul, Korea
            </p>
            
            <h3>출장 시간</h3>
            <p class="time-info">
              <span class="time-icon">🕰️</span>
              24시간 이내
            </p>
            
            <h3>선호 연락 방법</h3>
            <p class="contact-preference">
              이메일 또는 폼 메시지
            </p>
            
            <h3>소셜 미디어</h3>
            <div class="social-links">
              <a href="#" class="social-link github">
                <span>GitHub</span>
              </a>
              <a href="#" class="social-link linkedin">
                <span>LinkedIn</span>
              </a>
              <a href="#" class="social-link twitter">
                <span>Twitter</span>
              </a>
              <a href="#" class="social-link instagram">
                <span>Instagram</span>
              </a>
            </div>
          </div>
          
          <div class="form-right">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">이름 *</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="formData.name"
                    required 
                    placeholder="이름"
                  >
                </div>
                <div class="form-group">
                  <label for="phone">전화번호 *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="formData.phone"
                    required 
                    placeholder="010-0000-0000"
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">이메일 *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email"
                  required 
                  placeholder="example@email.com"
                >
              </div>
              
              <div class="form-group">
                <label for="message">메시지 *</label>
                <textarea 
                  id="message" 
                  v-model="formData.message"
                  required 
                  placeholder="메시지를 입력해주세요..."
                  rows="5"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="subject">문의 유형</label>
                <select v-model="formData.subject" id="subject">
                  <option value="">일반 문의</option>
                  <option value="project">프로젝트 제안</option>
                  <option value="job">채용 관련</option>
                  <option value="other">기타</option>
                </select>
              </div>
              
              <button type="submit" class="submit-btn">메시지 보내기</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ 섹션 -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">자주 묻는 질문</h2>
        
        <div class="faq-list">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <button 
              class="faq-question" 
              @click="toggleFaq(index)"
              :class="{ active: activeFaq === index }"
            >
              {{ faq.question }}
              <span class="faq-icon">{{ activeFaq === index ? '-' : '+' }}</span>
            </button>
            <div 
              class="faq-answer" 
              :class="{ show: activeFaq === index }"
            >
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        email: '',
        message: '',
        subject: ''
      },
      activeFaq: null,
      faqs: [
        {
          question: '현재 새로운 프로젝트를 받고 있나요?',
          answer: '네, 현재 새로운 프로젝트와 협업 기회를 열어두고 있습니다. 프로젝트의 규모와 일정에 따라 참여 가능 여부가 결정됩니다.'
        },
        {
          question: '어떤 기술 스택을 주로 사용하시나요?',
          answer: '프론트엔드는 HTML, CSS, JavaScript, Vue.js를 주로 사용하고, 백엔드는 Java, Spring Boot를 사용합니다. 또한 Git으로 버전 관리를 하고 있습니다.'
        },
        {
          question: '응답은 얼마나 빨리 받을 수 있나요?',
          answer: '보통 24시간 이내에 답변드리려고 노력하고 있습니다. 주말이나 공휴일의 경우 조금 더 시간이 걸릴 수 있습니다.'
        },
        {
          question: '원격 근무가 가능한가요?',
          answer: '네, 원격 근무가 가능합니다. 프로젝트의 성격에 따라 유연하게 대응할 수 있습니다.'
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      console.log('Form submitted:', this.formData)
      alert('메시지가 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.')
      
      // 폼 초기화
      this.formData = {
        name: '',
        phone: '',
        email: '',
        message: '',
        subject: ''
      }
    },
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index
    }
  }
}
</script>

<style scoped>
/* Contact 헤더 */
.contact-header {
  background: #2c3e50;
  color: white;
  padding: 120px 0 80px;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 연락처 정보 섹션 */
.contact-info-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-card h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.contact-card p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.contact-link {
  display: inline-block;
  padding: 8px 20px;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.contact-link:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* 메시지 섹션 */
.message-section {
  padding: 80px 0;
  background: white;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.message-form-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
}

.form-left h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.location-info,
.time-info,
.contact-preference {
  color: #666;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon,
.time-icon {
  font-size: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.social-link.github {
  background: #333;
  color: white;
}

.social-link.linkedin {
  background: #0077b5;
  color: white;
}

.social-link.twitter {
  background: #1da1f2;
  color: white;
}

.social-link.instagram {
  background: #e4405f;
  color: white;
}

.social-link:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* 폼 스타일 */
.contact-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 14px 30px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* FAQ 섹션 */
.faq-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1rem;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.faq-question {
  width: 100%;
  padding: 1.5rem;
  background: white;
  border: none;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #f8f9fa;
}

.faq-question.active {
  background: #3498db;
  color: white;
}

.faq-icon {
  font-size: 1.5rem;
  font-weight: 300;
}

.faq-answer {
  padding: 0 1.5rem;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-answer.show {
  padding: 1.5rem;
  max-height: 200px;
}

.faq-answer p {
  color: #666;
  line-height: 1.6;
}

/* 반응형 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .message-form-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>