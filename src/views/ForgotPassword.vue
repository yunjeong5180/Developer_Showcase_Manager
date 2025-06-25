<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <!-- Header -->
      <div class="forgot-header">
        <h1>🔐 비밀번호를 잊으셨나요?</h1>
        <p>이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleForgotPassword" class="forgot-form">
        <!-- Email Input -->
        <div class="form-group">
          <label for="email">이메일 주소</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="이메일을 입력하세요"
            :disabled="loading"
            @input="clearMessages"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !email"
          class="forgot-btn"
        >
          {{ loading ? '전송 중...' : '재설정 링크 보내기' }}
        </button>
      </form>

      <!-- Navigation Links -->
      <div class="navigation-links">
        <div class="back-to-login">
          <router-link to="/login">← 로그인으로 돌아가기</router-link>
        </div>
        <div class="register-link">
          <span>계정이 없으신가요? </span>
          <router-link to="/register">회원가입</router-link>
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
      error: null,
      success: null
    }
  },
  methods: {
    clearMessages() {
      this.error = null
      this.success = null
    },

    async handleForgotPassword() {
      if (!this.email) {
        this.error = '이메일 주소를 입력해주세요.'
        return
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.error = '올바른 이메일 주소를 입력해주세요.'
        return
      }

      this.loading = true
      this.error = null
      this.success = null

      try {
        console.log('비밀번호 재설정 요청:', this.email)

        const result = await authAPI.resetPassword(this.email)

        if (result.success) {
          this.success = result.message
          console.log('비밀번호 재설정 이메일 전송 성공')

          // 성공 메시지를 5초간 보여준 후 로그인 페이지로 이동
          setTimeout(() => {
            this.$router.push('/login')
          }, 5000)
        } else {
          this.error = result.error || '비밀번호 재설정 요청 중 오류가 발생했습니다.'
          console.error('비밀번호 재설정 실패:', result.error)
        }
      } catch (error) {
        console.error('비밀번호 재설정 예외:', error)
        this.error = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
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
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.forgot-header {
  text-align: center;
  margin-bottom: 30px;
}

.forgot-header h1 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.forgot-header p {
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.forgot-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #c33;
  font-size: 14px;
  margin-bottom: 15px;
}

.success-message {
  background-color: #f0f9e9;
  color: #4a7c44;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.4;
}

.forgot-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.forgot-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.forgot-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.navigation-links {
  text-align: center;
}

.back-to-login {
  margin-bottom: 15px;
}

.back-to-login a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

.back-to-login a:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

.register-link {
  font-size: 0.9rem;
  color: #6c757d;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 480px) {
  .forgot-password-card {
    padding: 30px 20px;
  }

  .forgot-header h1 {
    font-size: 1.4rem;
  }

  .forgot-header p {
    font-size: 0.9rem;
  }
}
</style>