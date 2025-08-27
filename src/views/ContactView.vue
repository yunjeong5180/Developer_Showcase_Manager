<template>
  <div class="contact-page">
    <div class="hero-section">
      <h1 class="hero-title">문의하기</h1>
      <p class="hero-subtitle">프로젝트 협업이나 기타 문의사항을 남겨주세요</p>
    </div>

    <div class="content-container">
      <div class="contact-grid">
        <!-- 연락처 정보 -->
        <div class="contact-info">
          <h2>연락처 정보</h2>

          <div class="info-card">
            <div class="info-icon">📧</div>
            <div class="info-content">
              <h3>이메일</h3>
              <p>contact@mycodit.com</p>
              <p class="sub-text">24시간 내 답변 드립니다</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">📱</div>
            <div class="info-content">
              <h3>전화</h3>
              <p>02-1234-5678</p>
              <p class="sub-text">평일 09:00 - 18:00</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">📍</div>
            <div class="info-content">
              <h3>위치</h3>
              <p>서울특별시 강남구</p>
              <p class="sub-text">테헤란로 123</p>
            </div>
          </div>

          <div class="social-links">
            <h3>소셜 미디어</h3>
            <div class="social-icons">
              <a href="#" class="social-icon" aria-label="GitHub">
                <span>🐙</span>
              </a>
              <a href="#" class="social-icon" aria-label="LinkedIn">
                <span>💼</span>
              </a>
              <a href="#" class="social-icon" aria-label="Twitter">
                <span>🐦</span>
              </a>
              <a href="#" class="social-icon" aria-label="Discord">
                <span>💬</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 문의 폼 -->
        <div class="contact-form-container">
          <h2>메시지 보내기</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">이름 *</label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                  placeholder="홍길동"
                />
              </div>
              <div class="form-group">
                <label for="email">이메일 *</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="subject">제목 *</label>
              <input
                type="text"
                id="subject"
                v-model="formData.subject"
                required
                placeholder="문의 제목을 입력하세요"
              />
            </div>

            <div class="form-group">
              <label for="category">문의 유형</label>
              <select id="category" v-model="formData.category">
                <option value="">선택하세요</option>
                <option value="general">일반 문의</option>
                <option value="collaboration">협업 제안</option>
                <option value="bug">버그 신고</option>
                <option value="feature">기능 요청</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">메시지 *</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="6"
                placeholder="문의 내용을 상세히 작성해주세요"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="resetForm" class="btn-secondary">
                초기화
              </button>
              <button type="submit" class="btn-primary">
                <span v-if="!isSubmitting">메시지 전송</span>
                <span v-else>전송 중...</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- FAQ 섹션 -->
      <section class="faq-section">
        <h2>자주 묻는 질문</h2>
        <div class="faq-list">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
            :class="{ active: activeFaq === index }"
          >
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ faq.question }}</h3>
              <span class="faq-toggle">{{
                activeFaq === index ? "−" : "+"
              }}</span>
            </div>
            <transition name="faq-answer">
              <div v-if="activeFaq === index" class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </transition>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactView",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      },
      isSubmitting: false,
      activeFaq: null,
      faqs: [
        {
          question: "MyCodit은 무료로 사용할 수 있나요?",
          answer:
            "네, 기본 기능은 모두 무료로 사용하실 수 있습니다. 프리미엄 기능은 추후 출시 예정입니다.",
        },
        {
          question: "포트폴리오는 몇 개까지 만들 수 있나요?",
          answer:
            "무제한으로 프로젝트를 등록하고 포트폴리오를 만들 수 있습니다.",
        },
        {
          question: "데이터는 안전하게 보관되나요?",
          answer:
            "모든 데이터는 암호화되어 안전하게 저장되며, 정기적으로 백업됩니다.",
        },
        {
          question: "협업 기능은 어떻게 사용하나요?",
          answer:
            "프로젝트에 팀원을 초대하여 함께 작업할 수 있으며, 실시간으로 진행 상황을 공유할 수 있습니다.",
        },
        {
          question: "기술 지원은 어떻게 받을 수 있나요?",
          answer: "이메일이나 전화로 문의하시면 전문 지원팀이 도움을 드립니다.",
        },
      ],
    };
  },
  methods: {
    handleSubmit() {
      if (this.isSubmitting) return;

      this.isSubmitting = true;

      // 실제로는 여기서 API 호출
      setTimeout(() => {
        alert("문의가 성공적으로 전송되었습니다!");
        this.resetForm();
        this.isSubmitting = false;
      }, 1500);
    },
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      };
    },
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;

.contact-page {
  min-height: calc(100vh - 60px);
  background: $gradient-light; // 깨끗한 회색 그라디언트
}

.hero-section {
  background: $gradient-primary; // 차콜 블랙 그라디언트
  color: white;
  padding: 80px 20px;
  text-align: center;

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 16px;
    animation: fadeInDown 0.8s ease;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    animation: fadeInUp 0.8s ease;
  }
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 80px;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.contact-info {
  h2 {
    font-size: 1.75rem;
    color: $primary-color; // 차콜 블랙
    margin-bottom: 30px;
  }

  .info-card {
    background: white;
    border: 1px solid $gray-200;
    padding: 20px;
    border-radius: $border-radius-lg;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s ease, background 0.3s ease;

    &:hover {
      transform: translateX(5px);
      background: $gray-50;
    }

    .info-icon {
      font-size: 2rem;
      color: $accent-color; // 블루 아이콘
    }

    .info-content {
      h3 {
        color: $primary-color; // 차콜 블랙
        font-size: 1.125rem;
        margin-bottom: 8px;
      }

      p {
        color: $gray-600;
        margin: 4px 0;
      }

      .sub-text {
        font-size: 0.875rem;
        color: $gray-500;
      }
    }
  }

  .social-links {
    margin-top: 40px;

    h3 {
      color: $primary-color; // 차콜 블랙으로 변경
      margin-bottom: 20px;
    }

    .social-icons {
      display: flex;
      gap: 15px;

      .social-icon {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        transition: all 0.3s ease;
        text-decoration: none;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }
      }
    }
  }
}

.contact-form-container {
  background: white;
  padding: 40px;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;

  h2 {
    font-size: 1.75rem;
    color: $gray-900;
    margin-bottom: 30px;
  }
}

.contact-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    margin-bottom: 24px;

    label {
      display: block;
      color: $gray-700;
      font-weight: 600;
      margin-bottom: 8px;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid $gray-300;
      border-radius: $border-radius;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
      }

      &::placeholder {
        color: $gray-400;
      }
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }
  }

  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;

    button {
      padding: 12px 32px;
      border-radius: $border-radius;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;

      &.btn-primary {
        background: $gradient-primary; // 차콜 블랙 그라디언트
        color: white; // 흰색 텍스트

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: $shadow;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      &.btn-secondary {
        background: $gray-200;
        color: $gray-700;

        &:hover {
          background: $gray-300;
        }
      }
    }
  }
}

.faq-section {
  background: white;
  padding: 60px;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;

  h2 {
    font-size: 2rem;
    color: $gray-900;
    text-align: center;
    margin-bottom: 40px;
  }

  .faq-list {
    max-width: 800px;
    margin: 0 auto;
  }

  .faq-item {
    border-bottom: 1px solid $gray-200;

    &:last-child {
      border-bottom: none;
    }

    .faq-question {
      padding: 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: $primary-color;
      }

      h3 {
        font-size: 1.125rem;
        color: $gray-900;
        font-weight: 600;
      }

      .faq-toggle {
        font-size: 1.5rem;
        color: $primary-color;
        font-weight: 300;
      }
    }

    &.active .faq-question h3 {
      color: $primary-color;
    }
  }

  .faq-answer {
    padding: 0 0 24px 0;

    p {
      color: $gray-600;
      line-height: 1.8;
    }
  }

  .faq-answer-enter-active,
  .faq-answer-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .faq-answer-enter-from,
  .faq-answer-leave-to {
    opacity: 0;
    transform: translateY(-10px);
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
    padding: 60px 20px;

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }
  }

  .faq-section {
    padding: 40px 20px;
  }
}
</style>
