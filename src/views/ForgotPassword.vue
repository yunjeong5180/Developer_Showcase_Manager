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

        <!-- 🆕 환경 정보 표시 (개발 환경에서만) -->
        <div v-if="showEnvironmentInfo" class="environment-info">
          <div class="env-badge" :class="environmentConfig.environment">
            🌍 {{ environmentConfig.environment.toUpperCase() }}
          </div>
          <small>Reset URL: {{ environmentConfig.resetPasswordUrl }}</small>
        </div>

        <!-- 성공/실패 메시지 (모달이 표시되지 않을 때만) -->
        <div v-if="message.text && !showSignupModal" :class="`message ${message.type}`">
          {{ message.text }}

          <!-- 🆕 성공 시 재전송 버튼과 추가 안내 -->
          <div v-if="message.type === 'success'" class="success-actions">
            <button
              @click="resendResetEmail"
              class="resend-btn"
              :disabled="isLoading || resendLoading"
            >
              {{ resendLoading ? '전송 중...' : '📧 이메일 다시 보내기' }}
            </button>

            <div class="email-tips">
              <h4>💡 이메일이 도착하지 않는다면:</h4>
              <ul>
                <li>✅ <strong>스팸 메일함</strong>을 확인해주세요</li>
                <li>⏰ <strong>5-10분</strong> 정도 기다려주세요</li>
                <li>📝 이메일 주소가 <strong>정확한지</strong> 확인해주세요</li>
                <li>🚫 이메일 차단 설정이 있는지 확인해주세요</li>
                <li>📱 모바일에서는 <strong>프로모션/소셜 탭</strong>도 확인해주세요</li>
              </ul>

              <div class="support-contact">
                <p>여전히 문제가 있다면 <a href="mailto:support@example.com">고객지원</a>에 문의해주세요.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="reset-btn"
          :disabled="isLoading || checkingEmail"
        >
          {{ isLoading ? '처리 중...' : checkingEmail ? '이메일 확인 중...' : '재설정 링크 보내기' }}
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
// 🔥 환경 설정 가져오기
import {
  getEnvironmentConfig,
  logEnvironmentInfo,
  validateEnvironmentConfig,
  getResetPasswordUrl,
  isDevelopment
} from '@/config/environment'

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
      resendLoading: false,
      checkingEmail: false,
      errors: {},
      message: {
        text: '',
        type: ''
      },
      showSignupModal: false,
      emailSentAt: null, // 이메일 전송 시간 추적

      // 🆕 환경 설정 관련
      environmentConfig: {},
      showEnvironmentInfo: false // 개발 환경에서만 true
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

    // 🔥 완전히 수정된 비밀번호 재설정 처리 - 환경별 동적 URL 사용
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

        // 🆕 환경 설정 가져오기 및 검증
        const envConfig = getEnvironmentConfig()

        // 환경 설정 검증
        if (!validateEnvironmentConfig()) {
          this.message = {
            text: '🚨 환경 설정에 문제가 있습니다. 관리자에게 문의해주세요.',
            type: 'error'
          }
          return
        }

        // 디버깅 정보 출력
        logEnvironmentInfo()

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

        // 🔥 환경별 동적 resetTo URL 설정
        const resetUrl = getResetPasswordUrl() // 헬퍼 함수 사용
        console.log('🌍 환경별 Reset URL:', resetUrl)

        const { error } = await supabase.auth.resetPasswordForEmail(this.email, {
          redirectTo: resetUrl, // 🔥 동적 URL 사용
          captchaToken: null
        })

        if (error) {
          console.error('비밀번호 재설정 오류:', error)

          // 🔥 상세한 에러 처리
          if (error.message.includes('Email rate limit exceeded') || error.message.includes('rate limit')) {
            this.message = {
              text: '⏰ 이메일 전송 한도를 초과했습니다.\n\nSupabase 무료 플랜은 시간당 2개 이메일 제한이 있습니다.\n1시간 후 다시 시도해주세요.',
              type: 'error'
            }
          } else if (error.message.includes('redirectTo') || error.message.includes('redirect')) {
            this.message = {
              text: `🚨 리디렉트 URL 설정 오류\n\nSupabase Dashboard에서 다음 URL을 Redirect URLs에 추가해주세요:\n${resetUrl}\n\n현재 환경: ${envConfig.environment}`,
              type: 'error'
            }
          } else if (error.message.includes('Invalid email')) {
            this.message = {
              text: '유효하지 않은 이메일 주소입니다.',
              type: 'error'
            }
          } else if (error.message.includes('SMTP not configured')) {
            this.message = {
              text: '이메일 서비스 설정에 문제가 있습니다. 관리자에게 문의하세요.',
              type: 'error'
            }
          } else {
            this.message = {
              text: this.getErrorMessage(error.message),
              type: 'error'
            }
          }
          return
        }

        console.log('비밀번호 재설정 이메일 전송 성공')
        this.emailSentAt = new Date()

        // 🆕 환경별 상세한 성공 메시지
        this.message = {
          text: `✅ 비밀번호 재설정 링크가 ${this.email}로 전송되었습니다.\n\n📬 이메일 확인 안내:\n• 이메일이 도착하는데 최대 10분 소요될 수 있습니다\n• 스팸 메일함도 반드시 확인해주세요\n• 링크는 24시간 후 만료됩니다${envConfig.isDevelopment ? `\n\n🌍 현재 환경: ${envConfig.environment}\n📍 Reset URL: ${resetUrl}` : ''}`,
          type: 'success'
        }

        // 🔥 추가: 디버깅을 위한 상세 정보 로그
        console.log('이메일 전송 상세 정보:', {
          email: this.email,
          redirectTo: resetUrl,
          environment: envConfig.environment,
          timestamp: new Date().toISOString(),
          supabaseProject: 'gjuwbcfuadlwvxrxbgui',
          origin: envConfig.currentOrigin
        })

        // 15초 후 로그인 페이지로 이동
        setTimeout(() => {
          if (this.message.type === 'success') {
            this.$router.push('/login')
          }
        }, 15000)

      } catch (error) {
        console.error('비밀번호 재설정 처리 오류:', error)
        this.message = {
          text: '비밀번호 재설정 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          type: 'error'
        }
      } finally {
        this.isLoading = false
        this.checkingEmail = false
      }
    },

    // 🆕 환경별 동적 URL을 사용하는 재전송 기능
    async resendResetEmail() {
      if (!this.email) {
        this.message = {
          text: '이메일 주소를 먼저 입력해주세요.',
          type: 'error'
        }
        return
      }

      // 너무 빠른 재전송 방지 (30초 제한)
      if (this.emailSentAt && new Date() - this.emailSentAt < 30000) {
        const remainingTime = Math.ceil((30000 - (new Date() - this.emailSentAt)) / 1000)
        this.message = {
          text: `⏰ ${remainingTime}초 후에 다시 시도해주세요.`,
          type: 'error'
        }
        return
      }

      this.resendLoading = true

      try {
        // 🔥 환경별 동적 URL 설정
        const resetUrl = getResetPasswordUrl()
        const envConfig = getEnvironmentConfig()

        console.log('이메일 재전송 - Reset URL:', resetUrl)

        // 동일한 이메일로 재전송
        const { error } = await supabase.auth.resetPasswordForEmail(this.email, {
          redirectTo: resetUrl // 🔥 동적 URL 사용
        })

        if (error) {
          console.error('이메일 재전송 오류:', error)

          if (error.message.includes('rate limit') || error.message.includes('Email rate limit exceeded')) {
            this.message = {
              text: '⚠️ 이메일 전송 제한에 도달했습니다.\n\nSupabase 무료 플랜은 시간당 2개 이메일 제한이 있습니다.\n1시간 후 다시 시도해주세요.',
              type: 'error'
            }
          } else {
            this.message = {
              text: '이메일 재전송 중 오류가 발생했습니다.',
              type: 'error'
            }
          }
        } else {
          this.emailSentAt = new Date()
          console.log('이메일 재전송 성공:', this.email)

          this.message = {
            text: `🔄 이메일을 다시 전송했습니다!\n\n📧 ${this.email}으로 재전송되었습니다.\n스팸 메일함도 확인해주세요.${envConfig.isDevelopment ? `\n\n🌍 환경: ${envConfig.environment}` : ''}`,
            type: 'success'
          }
        }
      } catch (error) {
        console.error('이메일 재전송 예외:', error)
        this.message = {
          text: '이메일 재전송 중 오류가 발생했습니다.',
          type: 'error'
        }
      } finally {
        this.resendLoading = false
      }
    },

    // 🔥 개선된 에러 메시지 변환
    getErrorMessage(error) {
      switch (error) {
        case 'Invalid email':
          return "올바른 이메일 형식이 아닙니다"
        case 'Email not found':
          return "등록되지 않은 이메일 주소입니다"
        case 'Too many requests':
        case 'Email rate limit exceeded':
          return "⏰ 이메일 전송 한도를 초과했습니다.\n\nSupabase 무료 플랜은 시간당 2개 이메일 제한이 있습니다.\n1시간 후 다시 시도해주세요."
        case 'SMTP not configured':
          return "이메일 서비스 설정에 문제가 있습니다. 관리자에게 문의하세요"
        case 'For security purposes, you can only request this once every 60 seconds':
          return "보안을 위해 60초마다 한 번씩만 요청할 수 있습니다"
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
      this.message = { text: '', type: '' }
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
  },

  // 🆕 컴포넌트 마운트 시 환경 설정 초기화
  mounted() {
    console.log('ForgotPassword 컴포넌트 마운트됨')

    try {
      // 환경 설정 로드
      this.environmentConfig = getEnvironmentConfig()

      // 개발 환경에서만 환경 정보 표시
      this.showEnvironmentInfo = isDevelopment()

      // 환경 설정 검증
      const isValid = validateEnvironmentConfig()
      if (!isValid) {
        console.error('❌ 환경 설정에 문제가 있습니다!')
      }

      // 디버깅 정보 출력 (개발 환경에서만)
      if (this.showEnvironmentInfo) {
        logEnvironmentInfo()
      }

    } catch (error) {
      console.error('환경 설정 로드 중 오류:', error)
      this.message = {
        text: '환경 설정 로드 중 오류가 발생했습니다.',
        type: 'error'
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; /* 더 넓게 조정 */
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

/* 🆕 환경 정보 표시 */
.environment-info {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  text-align: center;
}

.env-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.env-badge.development {
  background: #d1ecf1;
  color: #0c5460;
}

.env-badge.staging {
  background: #fff3cd;
  color: #856404;
}

.env-badge.production {
  background: #d4edda;
  color: #155724;
}

.environment-info small {
  color: #6c757d;
  font-size: 0.75rem;
  word-break: break-all;
}

/* 🆕 메시지 박스 스타일 개선 */
.message {
  padding: 15px;
  border-radius: 8px;
  text-align: left; /* 왼쪽 정렬로 변경 */
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
  white-space: pre-line; /* 줄바꿈 문자 처리 */
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

/* 🆕 성공 메시지 관련 스타일 */
.success-actions {
  margin-top: 15px;
  text-align: left;
}

.resend-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  font-weight: 600;
}

.resend-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.resend-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.email-tips {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  font-size: 0.9rem;
}

.email-tips h4 {
  color: #155724;
  margin-bottom: 10px;
  font-size: 1rem;
}

.email-tips ul {
  margin: 0;
  padding-left: 20px;
  color: #495057;
}

.email-tips li {
  margin-bottom: 5px;
}

.support-contact {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #dee2e6;
  font-size: 0.85rem;
  color: #6c757d;
}

.support-contact a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.support-contact a:hover {
  text-decoration: underline;
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
    max-width: 100%;
  }

  .header h2 {
    font-size: 1.3rem;
  }

  .icon {
    font-size: 2.5rem;
  }

  .email-tips {
    padding: 12px;
  }

  .email-tips ul {
    padding-left: 15px;
  }

  .environment-info small {
    font-size: 0.7rem;
  }
}
</style>