<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>로그인</h1>
        <p>Developer Showcase Manager에 로그인하세요</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 이메일 입력 -->
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="이메일을 입력하세요"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

        <!-- 로그인 버튼 -->
        <button
          type="submit"
          class="login-button"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading">로그인 중...</span>
          <span v-else>로그인</span>
        </button>

        <!-- 에러 메시지 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <!-- 회원가입 링크 -->
      <div class="signup-link">
        <p>계정이 없으신가요? <router-link to="/signup">회원가입하기</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/config/supabase'

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  computed: {
    isFormValid() {
      return this.formData.email.trim() !== '' && this.formData.password !== ''
    }
  },
  methods: {
    async handleLogin() {
      // 폼 유효성 검사
      if (!this.isFormValid) {
        this.error = '이메일과 비밀번호를 모두 입력해주세요.'
        return
      }

      this.loading = true
      this.error = ''

      try {
        console.log('로그인 시도:', this.formData.email)

        const result = await authAPI.signIn(this.formData.email, this.formData.password)

        console.log('로그인 결과:', result)

        if (result.success && result.data) {
          console.log('로그인 성공! 대시보드로 이동')

          // 사용자 정보 저장 (선택사항)
          if (result.data.user) {
            localStorage.setItem('user', JSON.stringify(result.data.user))
          }

          // 대시보드로 이동
          this.$router.push('/dashboard')
        } else {
          console.log('로그인 실패:', result.error)
          this.error = result.error || '로그인에 실패했습니다.'
        }
      } catch (error) {
        console.error('로그인 처리 중 예외:', error)
        this.error = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
      } finally {
        this.loading = false
      }
    },

    // 디버깅용 메서드
    debugFormData() {
      console.log('현재 폼 데이터:', this.formData)
    }
  },

  // 데이터 변화 감시 (디버깅용)
  watch: {
    'formData.email'(newVal) {
      console.log('이메일 변경:', newVal)
    },
    'formData.password'(newVal) {
      console.log('비밀번호 변경:', newVal ? '***' : 'empty')
    }
  },

  // 컴포넌트 마운트 시 디버깅
  mounted() {
    console.log('Login 컴포넌트 마운트됨')
    console.log('초기 폼 데이터:', this.formData)
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
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2rem;
}

.login-header p {
  color: #666;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-input {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
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

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  opacity: 0.9;
}

.login-button:disabled {
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
  margin-top: 10px;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
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

/* 반응형 디자인 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>