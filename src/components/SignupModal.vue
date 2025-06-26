<template>
  <!-- 모달 오버레이 -->
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click="closeModal"
  >
    <!-- 모달 컨텐츠 -->
    <div
      class="modal-content"
      @click.stop
    >
      <!-- 닫기 버튼 -->
      <button
        class="close-btn"
        @click="closeModal"
        aria-label="모달 닫기"
      >
        ✕
      </button>

      <!-- 모달 아이콘 -->
      <div class="modal-icon">
        🚀
      </div>

      <!-- 모달 제목 -->
      <h2 class="modal-title">
        아직 계정이 없으신가요?
      </h2>

      <!-- 모달 메시지 -->
      <p class="modal-message">
        입력하신 이메일로 등록된 계정을 찾을 수 없습니다.<br>
        <strong>Developer Showcase</strong>에 가입하여<br>
        포트폴리오를 관리해보세요!
      </p>

      <!-- 혜택 리스트 -->
      <div class="benefits-list">
        <div class="benefit-item">
          <span class="benefit-icon">📝</span>
          <span class="benefit-text">포트폴리오 관리</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">🎨</span>
          <span class="benefit-text">프로젝트 전시</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">🤝</span>
          <span class="benefit-text">개발자 네트워킹</span>
        </div>
      </div>

      <!-- 액션 버튼들 -->
      <div class="modal-actions">
        <button
          class="signup-btn"
          @click="goToSignup"
        >
          <span class="btn-icon">✨</span>
          지금 회원가입하기
        </button>

        <button
          class="cancel-btn"
          @click="closeModal"
        >
          나중에 하기
        </button>
      </div>

      <!-- 추가 정보 -->
      <div class="modal-footer">
        <p class="footer-text">
          이미 계정이 있으신가요?
          <button
            class="link-btn"
            @click="retryLogin"
          >
            다시 로그인하기
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'goToSignup', 'retryLogin'],

  // 🔧 라이프사이클 훅
  mounted() {
    document.addEventListener('keydown', this.handleEscape)
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape)
  },

  // ✅ 하나의 methods 객체로 통합
  methods: {
    closeModal() {
      this.$emit('close')
    },

    goToSignup() {
      this.$emit('goToSignup', this.email)
    },

    retryLogin() {
      this.$emit('retryLogin')
    },

    handleEscape(event) {
      if (event.key === 'Escape' && this.isVisible) {
        this.closeModal()
      }
    }
  }
}
</script>

<style scoped>
/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 모달 컨텐츠 */
.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 450px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 닫기 버튼 */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
  transform: rotate(90deg);
}

/* 모달 아이콘 */
.modal-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 모달 제목 */
.modal-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
}

/* 모달 메시지 */
.modal-message {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
}

.modal-message strong {
  color: #667eea;
  font-weight: 600;
}

/* 혜택 리스트 */
.benefits-list {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 15px;
  border: 1px solid #e3e7ff;
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.benefit-icon {
  font-size: 1.5rem;
  display: block;
}

.benefit-text {
  font-size: 0.85rem;
  color: #4a5568;
  font-weight: 600;
  text-align: center;
}

/* 액션 버튼들 */
.modal-actions {
  margin-bottom: 20px;
}

.signup-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.signup-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1rem;
}

.cancel-btn {
  background: none;
  border: none;
  color: #8e8e93;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #f5f5f5;
  color: #666;
}

/* 모달 푸터 */
.modal-footer {
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-top: 10px;
}

.footer-text {
  color: #8e8e93;
  font-size: 0.9rem;
  margin: 0;
}

.link-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
}

.link-btn:hover {
  color: #5a6fd8;
}

/* 반응형 */
@media (max-width: 480px) {
  .modal-content {
    padding: 30px 20px;
    margin: 10px;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .benefits-list {
    flex-direction: column;
    gap: 15px;
  }

  .benefit-item {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
  }

  .benefit-icon {
    font-size: 1.2rem;
  }
}
</style>