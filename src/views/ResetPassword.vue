<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <h1>비밀번호 재설정</h1>
        <p>새로운 비밀번호를 입력해주세요.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleResetPassword" class="login-form">
        <!-- New Password Input -->
        <div class="form-group">
          <label for="newPassword">새 비밀번호</label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            required
            placeholder="새 비밀번호를 입력하세요"
            :disabled="loading"
            minlength="8"
          />
        </div>

        <!-- Confirm Password Input -->
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
          :disabled="loading || !newPassword || !confirmPassword"
          class="login-btn"
        >
          {{ loading ? '처리 중...' : '비밀번호 변경' }}
        </button>
      </form>

      <!-- Navigation Links -->
      <div class="navigation-links">
        <div class="back-to-login">
          <router-link to="/login">← 로그인으로 돌아가기</router-link>
        </div>
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
      error: null,
      success: null,
      sessionEstablished: false
    }
  },
  methods: {
    // 🔥 핵심 수정: URL 해시에서 세션 설정
    async establishSession() {
      try {
        console.log('비밀번호 재설정 세션 설정 시작')

        // URL 해시에서 파라미터 추출
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        console.log('URL 파라미터:', {
          type,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken
        })

        if (!accessToken || type !== 'recovery') {
          throw new Error('유효하지 않은 재설정 링크입니다')
        }

        // 🔥 핵심: Supabase 세션 수동 설정
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (error) {
          console.error('세션 설정 오류:', error)
          throw error
        }

        if (data.session) {
          console.log('세션 설정 성공:', data.session.user.email)
          this.sessionEstablished = true
        } else {
          throw new Error('세션 생성에 실패했습니다')
        }

      } catch (error) {
        console.error('세션 설정 실패:', error)
        this.error = error.message || '세션 설정에 실패했습니다. 비밀번호 재설정을 다시 요청해주세요.'

        // 3초 후 forgot-password 페이지로 리디렉트
        setTimeout(() => {
          this.$router.push('/forgot-password')
        }, 3000)
      }
    },

    async handleResetPassword() {
      // 세션이 설정되지 않았으면 먼저 설정
      if (!this.sessionEstablished) {
        this.error = '세션이 설정되지 않았습니다. 페이지를 새로고침해주세요.'
        return
      }

      // 비밀번호 확인 검증
      if (this.newPassword !== this.confirmPassword) {
        this.error = '비밀번호가 일치하지 않습니다.'
        return
      }

      // 비밀번호 길이 검증
      if (this.newPassword.length < 8) {
        this.error = '비밀번호는 최소 8자 이상이어야 합니다.'
        return
      }

      this.loading = true
      this.error = null
      this.success = null

      try {
        console.log('비밀번호 업데이트 시작')

        // 🔥 수정: 세션 상태 재확인
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('세션이 만료되었습니다. 비밀번호 재설정을 다시 요청해주세요.')
        }

        // Supabase를 통해 비밀번호 업데이트
        const { error } = await supabase.auth.updateUser({
          password: this.newPassword
        })

        if (error) {
          console.error('비밀번호 업데이트 오류:', error)

          // 세션 관련 에러 처리
          if (error.message.includes('session missing') || error.message.includes('session')) {
            throw new Error('세션이 만료되었습니다. 비밀번호 재설정을 다시 요청해주세요.')
          }

          // 동일한 비밀번호 오류 처리
          if (error.message.includes('New password should be different')) {
            this.error = '이전에 사용했던 비밀번호입니다. 다른 비밀번호를 입력해주세요.'
            return
          }

          throw error
        }

        console.log('비밀번호 변경 성공')

        // 비밀번호 변경 성공
        this.success = '비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 다시 로그인해주세요.'

        // 🔥 중요: 세션 종료하여 자동 로그인 방지
        await supabase.auth.signOut()

        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)

      } catch (error) {
        console.error('비밀번호 업데이트 처리 오류:', error)
        this.error = error.message || '비밀번호 변경 중 오류가 발생했습니다.'
      } finally {
        this.loading = false
      }
    }
  },

  // 🔥 핵심: 컴포넌트 마운트 시 세션 설정
  async mounted() {
    console.log('ResetPassword 컴포넌트 마운트됨')
    console.log('현재 URL:', window.location.href)
    console.log('URL 해시:', window.location.hash)

    // 세션 설정
    await this.establishSession()
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.login-header p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
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

/* 반응형 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 1.4rem;
  }
}
</style>