<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <h1>비밀번호 재설정</h1>
        <p>새로운 비밀번호를 입력해주세요.</p>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-message">
        <div class="spinner"></div>
        <p>세션을 설정하고 있습니다...</p>
      </div>

      <!-- 메인 폼 -->
      <form v-else @submit.prevent="handleResetPassword" class="login-form">
        <div class="form-group">
          <label for="newPassword">새 비밀번호</label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            required
            placeholder="새 비밀번호를 입력하세요 (8자 이상)"
            :disabled="loading"
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="비밀번호를 다시 입력하세요"
            :disabled="loading"
            minlength="8"
          />
        </div>

        <!-- 메시지 -->
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>

        <!-- 제출 버튼 -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="login-btn"
        >
          {{ loading ? '처리 중...' : '비밀번호 변경' }}
        </button>
      </form>

      <!-- 네비게이션 -->
      <div class="navigation-links">
        <router-link to="/login">← 로그인으로 돌아가기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/config/supabase'

export default {
  name: 'ResetPassword',
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      loading: false,
      isLoading: true,
      error: null,
      success: null,
      sessionReady: false
    }
  },
  computed: {
    isFormValid() {
      return this.newPassword &&
        this.confirmPassword &&
        this.newPassword.length >= 8 &&
        this.sessionReady
    }
  },
  async mounted() {
    this.debugLog('ResetPassword 컴포넌트 마운트됨')
    this.debugLog('현재 URL:', window.location.href)
    this.debugLog('URL 해시:', window.location.hash)
    await this.initializeSession()
  },
  methods: {
    // 🔍 개발 환경 디버깅 로그
    debugLog(...args) {
      if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_DEBUG === 'true') {
        console.log('[ResetPassword Debug]', ...args)
      }
    },

    async initializeSession() {
      try {
        this.debugLog('세션 설정 시작')

        // URL 해시에서 토큰 추출
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)

        this.debugLog('URL 파라미터:', Object.fromEntries(params))

        // 에러 체크
        const error = params.get('error')
        if (error) {
          this.debugLog('URL에서 에러 발견:', error, params.get('error_code'))
          throw new Error(this.getErrorMessage(error, params.get('error_code')))
        }

        // 토큰 확인
        const accessToken = params.get('access_token')
        const tokenType = params.get('type')

        this.debugLog('토큰 정보:', {
          hasAccessToken: !!accessToken,
          tokenType,
          tokenLength: accessToken?.length || 0
        })

        if (!accessToken || tokenType !== 'recovery') {
          throw new Error('유효하지 않은 재설정 링크입니다.')
        }

        // 세션 설정
        this.debugLog('Supabase 세션 설정 시도...')
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: params.get('refresh_token') || accessToken
        })

        if (sessionError) {
          this.debugLog('세션 설정 오류:', sessionError)
          throw sessionError
        }

        // 세션 확인
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          this.debugLog('세션 확인 실패')
          throw new Error('세션 설정에 실패했습니다.')
        }

        this.debugLog('세션 설정 성공:', {
          userEmail: session.user.email,
          expiresAt: session.expires_at
        })

        this.sessionReady = true

      } catch (err) {
        this.debugLog('세션 설정 실패:', err.message)
        this.error = err.message
        setTimeout(() => this.$router.push('/forgot-password'), 3000)
      } finally {
        this.isLoading = false
      }
    },

    async handleResetPassword() {
      if (!this.validateForm()) return

      this.loading = true
      this.error = null
      this.debugLog('비밀번호 업데이트 시작')

      try {
        // 세션 재확인
        const { data: { session } } = await supabase.auth.getSession()
        this.debugLog('세션 재확인:', {
          hasSession: !!session,
          userEmail: session?.user?.email
        })

        const { error } = await supabase.auth.updateUser({
          password: this.newPassword
        })

        if (error) {
          this.debugLog('비밀번호 업데이트 오류:', error)
          throw error
        }

        this.debugLog('비밀번호 변경 성공')
        this.success = '비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.'

        // 세션 종료 및 리디렉트
        await supabase.auth.signOut()
        this.debugLog('세션 종료 완료, 로그인 페이지로 이동')
        setTimeout(() => this.$router.push('/login'), 2000)

      } catch (err) {
        this.debugLog('비밀번호 업데이트 실패:', err.message)
        this.error = this.getUpdateErrorMessage(err.message)
      } finally {
        this.loading = false
      }
    },

    validateForm() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = '비밀번호가 일치하지 않습니다.'
        return false
      }
      if (this.newPassword.length < 8) {
        this.error = '비밀번호는 최소 8자 이상이어야 합니다.'
        return false
      }
      return true
    },

    getErrorMessage(error, errorCode) {
      if (errorCode === 'otp_expired' || error === 'access_denied') {
        return '비밀번호 재설정 링크가 만료되었습니다. 새로운 링크를 요청해주세요.'
      }
      return '재설정 링크에 문제가 있습니다. 새로운 링크를 요청해주세요.'
    },

    getUpdateErrorMessage(message) {
      if (message.includes('session') || message.includes('expired')) {
        return '세션이 만료되었습니다. 다시 시도해주세요.'
      }
      if (message.includes('same password')) {
        return '이전과 다른 비밀번호를 입력해주세요.'
      }
      return '비밀번호 변경 중 오류가 발생했습니다.'
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
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.6rem;
}

.login-header p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.loading-message {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-form {
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

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.error-message, .success-message {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.4;
}

.error-message {
  background-color: #fee;
  color: #c33;
  border-left: 4px solid #c33;
}

.success-message {
  background-color: #f0f9e9;
  color: #4a7c44;
  border-left: 4px solid #4caf50;
}

.login-btn {
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

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.navigation-links {
  text-align: center;
}

.navigation-links a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

.navigation-links a:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 1.4rem;
  }
}
</style>