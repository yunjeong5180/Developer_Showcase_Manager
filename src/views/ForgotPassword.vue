<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <div class="header">
        <h1>비밀번호 찾기</h1>
        <p>가입할 때 사용한 이메일 주소를 입력하세요.</p>
        <p>비밀번호 재설정 링크를 보내드립니다.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="forgot-password-form" v-if="!isEmailSent">
        <div class="form-group">
          <label for="email">이메일 주소</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="example@email.com"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="loading || !isEmailValid"
        >
          <span v-if="loading">전송 중...</span>
          <span v-else>재설정 링크 전송</span>
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <!-- 이메일 전송 완료 화면 -->
      <div v-if="isEmailSent" class="success-screen">
        <div class="success-icon">📧</div>
        <h2>이메일을 확인하세요</h2>
        <p>
          <strong>{{ email }}</strong>로 비밀번호 재설정 링크를 보냈습니다.
        </p>
        <p>
          이메일을 확인하고 링크를 클릭하여 새 비밀번호를 설정하세요.
        </p>

        <div class="action-buttons">
          <button @click="resendEmail" class="resend-button" :disabled="loading">
            <span v-if="loading">재전송 중...</span>
            <span v-else>이메일 다시 보내기</span>
          </button>

          <router-link to="/login" class="back-to-login">
            로그인 페이지로 돌아가기
          </router-link>
        </div>
      </div>

      <!-- 하단 링크들 -->
      <div class="footer-links" v-if="!isEmailSent">
        <router-link to="/login" class="back-link">
          ← 로그인 페이지로 돌아가기
        </router-link>

        <div class="help-text">
          <p>계정이 없으신가요? <router-link to="/signup">회원가입하기</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/config/supabase'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      error: '',
      isEmailSent: false
    }
  },
  computed: {
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.email)
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.isEmailValid) {
        this.error = '올바른 이메일 주소를 입력해주세요.'
        return
      }

      this.loading = true
      this.error = ''

      try {
        const result = await authAPI.resetPassword(this.email)

        if (result.success) {
          this.isEmailSent = true
        } else {
          this.error = result.error || '이메일 전송에 실패했습니다.'
        }
      } catch (error) {
        console.error('비밀번호 재설정 요청 오류:', error)
        this.error = '오류가 발생했습니다. 다시 시도해주세요.'
      } finally {
        this.loading = false
      }
    },

    async resendEmail() {
      this.loading = true
      this.error = ''

      try {
        const result = await authAPI.resetPassword(this.email)

        if (result.success) {
          // 재전송 완료 알림
          this.$nextTick(() => {
            alert('이메일을 다시 보냈습니다. 받은편지함을 확인해주세요.')
          })
        } else {
          this.error = result.error || '이메일 재전송에 실패했습니다.'
        }
      } catch (error) {
        console.error('이메일 재전송 오류:', error)
        this.error = '재전송 중 오류가 발생했습니다.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-password-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2rem;
}

.header p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #c33;
  font-size: 14px;
}

/* 성공 화면 */
.success-screen {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.success-screen h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.success-screen p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.success-screen strong {
  color: #333;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.resend-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.resend-button:hover:not(:disabled) {
  background: #218838;
}

.resend-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-to-login {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  padding: 12px;
  border: 2px solid #667eea;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-to-login:hover {
  background: #667eea;
  color: white;
}

/* 하단 링크들 */
.footer-links {
  margin-top: 30px;
  text-align: center;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 15px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #5a6fd8;
}

.help-text {
  padding-top: 15px;
  border-top: 1px solid #e1e5e9;
}

.help-text p {
  color: #666;
  font-size: 14px;
}

.help-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.help-text a:hover {
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 480px) {
  .forgot-password-card {
    padding: 30px 20px;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .action-buttons {
    gap: 12px;
  }
}
</style>