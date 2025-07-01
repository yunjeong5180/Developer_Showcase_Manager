<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <div class="header">
        <div class="icon">🔒</div>
        <h2>비밀번호를 잊으셨나요?</h2>
        <p>이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
      </div>

      <form @submit.prevent="handleResetPassword" class="reset-form">
        <div class="form-group">
          <label for="email">이메일 주소</label>
          <input
            type="email"
            id="email"
            v-model="email"
            :class="{ 'error': errors.email }"
            :disabled="isLoading"
            placeholder="이메일을 입력하세요"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          <!-- DB 확인 중 표시 -->
          <div v-if="checkingEmail" class="checking-message">이메일 확인 중...</div>
        </div>

        <!-- 성공/실패 메시지 (모달이 표시되지 않을 때만) -->
        <div v-if="message.text && !showSignupModal" :class="`message ${message.type}`">
          {{ message.text }}
        </div>

        <button
          type="submit"
          class="reset-btn"
          :disabled="isLoading || checkingEmail"
        >
          {{ isLoading ? '처리 중...' : '재설정 링크 보내기' }}
        </button>
      </form>

      <div class="back-to-login">
        <router-link to="/login">← 로그인으로 돌아가기</router-link>
      </div>

      <div class="signup-link">
        계정이 없으신가요? <router-link to="/signup">회원가입</router-link>
      </div>
    </div>

    <!-- SignupModal - 조건부 렌더링 -->
    <SignupModal
      v-if="showSignupModal"
      :isVisible="showSignupModal"
      :email="email"
      mode="forgotPassword"
      @close="closeSignupModal"
      @goToSignup="goToSignupWithEmail"
      @retryReset="retryPasswordReset"
    />
  </div>
</template>

<script>
import { supabase } from '@/config/supabase'

// SignupModal 동적 import로 안전하게 처리
let SignupModal = null
try {
  SignupModal = require('@/components/SignupModal.vue').default
} catch (error) {
  console.warn('SignupModal을 찾을 수 없습니다:', error)
  // 모달 없이도 동작하도록 더미 컴포넌트 제공
  SignupModal = {
    name: 'DummySignupModal',
    template: '<div></div>'
  }
}

export default {
  name: 'ForgotPassword',
  components: {
    SignupModal
  },
  data() {
    return {
      email: '',
      isLoading: false,
      checkingEmail: false,
      errors: {},
      message: {
        text: '',
        type: ''
      },
      showSignupModal: false
    }
  },
  methods: {
    // 🔧 수정된 DB 확인 함수 - DB 우선 확인
    async checkEmailExistsInDB(email) {
      try {
        console.log('📊 비밀번호 재설정: DB에서 이메일 존재 여부 확인:', email)

        const normalizedEmail = email.toLowerCase().trim()

        // 🎯 방법 1: Supabase users 테이블에서 먼저 확인 (가장 정확함)
        try {
          const { data, error } = await supabase
            .from('users')
            .select('email')
            .eq('email', normalizedEmail)
            .single()

          if (data && data.email) {
            console.log('✅ users 테이블에서 가입된 이메일 확인:', normalizedEmail)
            return true
          }

          if (error && (error.code === 'PGRST116' || error.message.includes('No rows'))) {
            console.log('❌ users 테이블에서 미가입 이메일 확인:', normalizedEmail)
            return false
          }
        } catch (dbError) {
          console.warn('users 테이블 쿼리 실패, 다른 방법 시도:', dbError)
        }

        // 🎯 방법 2: localStorage 확인 (백업용)
        const recentSignups = JSON.parse(localStorage.getItem('recentSignups') || '[]')
        if (recentSignups.includes(normalizedEmail)) {
          console.log('✅ localStorage에서 가입된 이메일 확인 (백업):', normalizedEmail)

          // 하지만 DB에서 확인되지 않았다면 localStorage 데이터가 잘못된 것
          console.warn('⚠️ localStorage와 DB 불일치 감지, localStorage 정리 필요')

          // localStorage에서 해당 이메일 제거
          const updatedSignups = recentSignups.filter(e => e !== normalizedEmail)
          localStorage.setItem('recentSignups', JSON.stringify(updatedSignups))

          return false // DB를 믿고 미가입으로 처리
        }

        // 🎯 방법 3: Supabase auth 더미 로그인 시도 (최후의 수단)
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: '___DUMMY_PASSWORD_FOR_EMAIL_CHECK___'
          })

          if (error && error.message === 'Invalid login credentials') {
            console.log('✅ Supabase auth에서 가입된 이메일 확인 (더미 로그인):', normalizedEmail)
            return true
          }
        } catch (authError) {
          console.warn('더미 로그인 시도 중 오류:', authError)
        }

        console.log('❌ 모든 확인 방법에서 미가입 이메일로 판단:', normalizedEmail)
        return false

      } catch (error) {
        console.error('이메일 존재 확인 중 오류:', error)
        return false
      }
    },

    // 이메일 유효성 검사
    validateEmail() {
      this.errors.email = ""

      if (!this.email.trim()) {
        this.errors.email = "이메일을 입력해주세요"
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.errors.email = "올바른 이메일 형식을 입력해주세요"
        return false
      }

      return true
    },

    // 비밀번호 재설정 처리
    async handleResetPassword() {
      if (!this.validateEmail()) {
        return
      }

      this.isLoading = true
      this.checkingEmail = true
      this.message = { text: '', type: '' }
      this.showSignupModal = false

      try {
        console.log('비밀번호 재설정 요청:', this.email)

        // 1단계: DB에서 이메일 존재 여부 확인
        const emailExists = await this.checkEmailExistsInDB(this.email)
        this.checkingEmail = false

        if (!emailExists) {
          // 미가입 이메일인 경우 모달 표시
          console.log('❌ 미가입 이메일로 비밀번호 재설정 시도 → 회원가입 모달 표시')
          this.message = { text: '', type: '' }
          this.showSignupModal = true
          return
        }

        // 2단계: 가입된 이메일인 경우에만 재설정 링크 전송
        console.log('✅ 가입된 이메일 확인됨, 재설정 링크 전송 진행')

        const { error } = await supabase.auth.resetPasswordForEmail(this.email, {
          redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) {
          console.error('비밀번호 재설정 오류:', error)
          this.message = {
            text: this.getErrorMessage(error.message),
            type: 'error'
          }
          return
        }

        console.log('비밀번호 재설정 이메일 전송 성공')
        this.message = {
          text: '비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.',
          type: 'success'
        }

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)

      } catch (error) {
        console.error('비밀번호 재설정 처리 오류:', error)
        this.message = {
          text: '비밀번호 재설정 요청 중 오류가 발생했습니다. 다시 시도해주세요.',
          type: 'error'
        }
      } finally {
        this.isLoading = false
        this.checkingEmail = false
      }
    },

    // 에러 메시지 변환
    getErrorMessage(error) {
      switch (error) {
        case 'Invalid email':
          return "올바른 이메일 형식이 아닙니다"
        case 'Email not found':
          return "등록되지 않은 이메일 주소입니다"
        case 'Too many requests':
          return "너무 많은 요청입니다. 잠시 후 다시 시도해주세요"
        default:
          return `비밀번호 재설정 실패: ${error}`
      }
    },

    // 모달 관련 메서드들
    closeSignupModal() {
      this.showSignupModal = false
    },

    goToSignupWithEmail(email) {
      this.$router.push({
        path: '/signup',
        query: { email: email }
      })
    },

    retryPasswordReset() {
      this.showSignupModal = false
      this.email = ''
      this.$nextTick(() => {
        const emailInput = document.getElementById('email')
        if (emailInput) {
          emailInput.focus()
        }
      })
    }
  },

  watch: {
    // 이메일 변경 시 에러 메시지 초기화
    email() {
      this.errors.email = ""
      this.message = { text: '', type: '' }
      this.showSignupModal = false
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 40px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.header p {
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

.reset-form {
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
}

.form-group input.error {
  border-color: #dc3545;
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.checking-message {
  color: #ffc107;
  font-size: 0.85rem;
  margin-top: 5px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.4;
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

.reset-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.reset-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.back-to-login {
  text-align: center;
  margin-bottom: 15px;
}

.back-to-login a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.back-to-login a:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

.signup-link {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .forgot-password-card {
    padding: 30px 20px;
  }

  .header h2 {
    font-size: 1.3rem;
  }

  .icon {
    font-size: 2.5rem;
  }
}
</style>