<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="signup-header">
        <h2>회원가입</h2>
        <p>Developer Showcase Manager에 오신 것을 환영합니다!</p>
      </div>

      <form @submit.prevent="handleSignUp" class="signup-form">
        <!-- 이름 입력 -->
        <div class="form-group">
          <label for="name">이름</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            :class="{ 'error': errors.name }"
            placeholder="이름을 입력하세요"
            required
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

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
            placeholder="최소 6자리 이상"
            required
          >
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :class="{ 'error': errors.confirmPassword }"
            placeholder="비밀번호를 다시 입력하세요"
            required
          >
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <!-- 회원가입 버튼 -->
        <button
          type="submit"
          class="signup-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? '가입 중...' : '회원가입' }}
        </button>

        <!-- 성공/실패 메시지 -->
        <div v-if="message.text" :class="`message ${message.type}`">
          {{ message.text }}
        </div>
      </form>

      <!-- 로그인 링크 -->
      <div class="login-link">
        <p>이미 계정이 있으신가요?
          <router-link to="/login">로그인하기</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/config/supabase'
import { authUtils } from '@/utils/auth'

export default {
  name: 'SignUp',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {},
      message: {
        text: '',
        type: ''
      },
      isLoading: false
    }
  },
  methods: {
    // 폼 유효성 검사
    validateForm() {
      this.errors = {}

      // 이름 검사
      if (!this.formData.name.trim()) {
        this.errors.name = '이름을 입력해주세요.'
      }

      // 이메일 검사
      if (!authUtils.validateEmail(this.formData.email)) {
        this.errors.email = '올바른 이메일 형식을 입력해주세요.'
      }

      // 비밀번호 검사
      if (!authUtils.validatePassword(this.formData.password)) {
        this.errors.password = '비밀번호는 최소 6자리 이상이어야 합니다.'
      }

      // 비밀번호 확인 검사
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }

      return Object.keys(this.errors).length === 0
    },

    // 회원가입 처리
    async handleSignUp() {
      // 유효성 검사
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.message = { text: '', type: '' }

      try {
        // 1. 이메일 중복 체크
        const emailExists = await authAPI.checkEmailExists(this.formData.email)
        if (emailExists) {
          this.errors.email = '이미 사용 중인 이메일입니다.'
          this.isLoading = false
          return
        }

        // 2. 회원가입 API 호출 (비밀번호 해시 제거)
        const result = await authAPI.signUp({
          name: this.formData.name.trim(),
          email: this.formData.email.toLowerCase(),
          password: this.formData.password // 원본 비밀번호 직접 사용
        })

        if (result.success) {
          this.message = {
            text: '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.',
            type: 'success'
          }

          // 폼 초기화
          this.formData = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          }

          // 2초 후 로그인 페이지로 이동
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          this.message = {
            text: `회원가입 실패: ${result.error}`,
            type: 'error'
          }
        }
      } catch (error) {
        this.message = {
          text: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
          type: 'error'
        }
        console.error('SignUp Error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signup-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 40px;
}

.signup-header {
  text-align: center;
  margin-bottom: 30px;
}

.signup-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.signup-header p {
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

.signup-btn {
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

.signup-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.signup-btn:disabled {
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

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link p {
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .signup-card {
    padding: 30px 20px;
  }

  .signup-header h2 {
    font-size: 24px;
  }
}
</style>