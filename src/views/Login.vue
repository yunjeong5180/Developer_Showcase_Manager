<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>로그인</h2>
        <p>Developer Showcase Manager에 로그인하세요</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 이메일 입력 -->
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="{ 'error': errors.email }"
            placeholder="example@email.com"
            required
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            :class="{ 'error': errors.password }"
            placeholder="비밀번호를 입력하세요"
            required
          >
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- 로그인 버튼 -->
        <button
          type="submit"
          class="login-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>

        <!-- 성공/실패 메시지 -->
        <div v-if="message.text" :class="`message ${message.type}`">
          {{ message.text }}
        </div>
      </form>

      <!-- 회원가입 링크 -->
      <div class="signup-link">
        <p>계정이 없으신가요?
          <router-link to="/signup">회원가입하기</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/config/supabase'
import { authUtils } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      errors: {},
      message: {
        text: '',
        type: ''
      },
      isLoading: false
    }
  },
  mounted() {
    // 이미 로그인된 사용자는 대시보드로 리다이렉트
    if (authUtils.isAuthenticated()) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    // 폼 유효성 검사
    validateForm() {
      this.errors = {}

      // 이메일 검사
      if (!authUtils.validateEmail(this.formData.email)) {
        this.errors.email = '올바른 이메일 형식을 입력해주세요.'
      }

      // 비밀번호 검사
      if (!this.formData.password) {
        this.errors.password = '비밀번호를 입력해주세요.'
      }

      return Object.keys(this.errors).length === 0
    },

    // 로그인 처리
    async handleLogin() {
      // 유효성 검사
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.message = { text: '', type: '' }

      try {
        // 1. 이메일로 사용자 찾기
        const result = await authAPI.signIn(
          this.formData.email.toLowerCase(),
          this.formData.password
        )

        if (!result.success) {
          this.message = {
            text: result.error,
            type: 'error'
          }
          this.isLoading = false
          return
        }

        // 2. 비밀번호 검증
        const user = result.user
        const isPasswordValid = await authUtils.verifyPassword(
          this.formData.password,
          user.password_hash
        )

        if (!isPasswordValid) {
          this.message = {
            text: '비밀번호가 일치하지 않습니다.',
            type: 'error'
          }
          this.isLoading = false
          return
        }

        // 3. 로그인 성공 처리
        this.message = {
          text: '로그인 성공! 대시보드로 이동합니다.',
          type: 'success'
        }

        // 4. 사용자 세션 저장
        authUtils.saveUserSession({
          id: user.id,
          email: user.email,
          name: user.name
        })

        // 5. 대시보드로 리다이렉트
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1500)

      } catch (error) {
        this.message = {
          text: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
          type: 'error'
        }
        console.error('Login Error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
}

.signup-link p {
  color: #666;
  font-size: 14px;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h2 {
    font-size: 24px;
  }
}
</style>