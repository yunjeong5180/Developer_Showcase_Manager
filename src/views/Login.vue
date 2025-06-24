<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🚀 Developer Showcase</h1>
        <p>포트폴리오 관리 시스템에 로그인하세요</p>
      </div>

      <!-- 이메일 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            :disabled="loading"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            :disabled="loading"
            required
          />
        </div>

        <!-- Remember Me 체크박스 -->
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span class="checkmark"></span>
            로그인 상태 유지
          </label>

          <router-link to="/forgot-password" class="forgot-password">
            비밀번호를 잊으셨나요?
          </router-link>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">로그인 중...</span>
          <span v-else>로그인</span>
        </button>
      </form>

      <!-- 소셜 로그인 버튼들 -->
      <div class="social-login-section">
        <div class="social-buttons-row">
          <button
            @click="signInWithGitHub"
            class="social-btn github-btn"
            :disabled="loading"
            title="GitHub으로 로그인"
          >
            <img src="@/assets/github.png" alt="GitHub" class="social-logo" />
          </button>

          <button
            @click="signInWithGoogle"
            class="social-btn google-btn"
            :disabled="loading"
            title="Google로 로그인"
          >
            <img src="@/assets/google.png" alt="Google" class="social-logo" />
          </button>
        </div>
      </div>

      <div class="signup-link">
        계정이 없으신가요?
        <router-link to="/register">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/config/supabase'

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      loading: false,
      error: ""
    }
  },
  mounted() {
    // Remember Me 기능 - 저장된 이메일 복원
    const savedEmail = localStorage.getItem('userEmail')
    const rememberUser = localStorage.getItem('rememberUser')

    if (rememberUser === 'true' && savedEmail) {
      this.email = savedEmail
      this.rememberMe = true
    }

    // 이미 로그인된 경우 대시보드로 리디렉션
    this.checkExistingSession()
  },
  methods: {
    async checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          this.$router.push('/dashboard')
        }
      } catch (error) {
        console.error('세션 확인 오류:', error)
      }
    },

    async handleLogin() {
      if (!this.email || !this.password) {
        this.error = "이메일과 비밀번호를 입력해주세요"
        return
      }

      this.loading = true
      this.error = ""

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        })

        if (error) {
          this.error = this.getErrorMessage(error.message)
          return
        }

        // Remember Me 기능
        if (this.rememberMe) {
          localStorage.setItem('rememberUser', 'true')
          localStorage.setItem('userEmail', this.email)
        } else {
          localStorage.removeItem('rememberUser')
          localStorage.removeItem('userEmail')
        }

        // 사용자 정보 저장
        localStorage.setItem('user', JSON.stringify(data.user))

        // 2FA 확인 필요한지 체크 (실제 구현에서는 서버에서 확인)
        const needs2FA = false // 데모용으로 false

        if (needs2FA) {
          this.$router.push('/two-factor-auth?mode=verify')
        } else {
          this.$router.push('/dashboard')
        }

      } catch (error) {
        console.error('로그인 오류:', error)
        this.error = "로그인 중 오류가 발생했습니다"
      } finally {
        this.loading = false
      }
    },

    async signInWithGitHub() {
      this.loading = true
      this.error = ""

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) {
          this.error = "GitHub 로그인 중 오류가 발생했습니다"
          console.error('GitHub 로그인 오류:', error)
        }
      } catch (error) {
        console.error('GitHub 로그인 오류:', error)
        this.error = "GitHub 로그인 중 오류가 발생했습니다"
      } finally {
        this.loading = false
      }
    },

    async signInWithGoogle() {
      this.loading = true
      this.error = ""

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) {
          this.error = "Google 로그인 중 오류가 발생했습니다"
          console.error('Google 로그인 오류:', error)
        }
      } catch (error) {
        console.error('Google 로그인 오류:', error)
        this.error = "Google 로그인 중 오류가 발생했습니다"
      } finally {
        this.loading = false
      }
    },

    getErrorMessage(error) {
      switch (error) {
        case 'Invalid login credentials':
          return "이메일 또는 비밀번호가 올바르지 않습니다"
        case 'Email not confirmed':
          return "이메일 인증이 필요합니다"
        case 'Too many requests':
          return "너무 많은 요청입니다. 잠시 후 다시 시도해주세요"
        default:
          return "로그인 중 오류가 발생했습니다"
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6c757d;
}

.remember-me input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.1);
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #5a6fd8;
  text-decoration: underline;
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

/* 구분선 */
.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #6c757d;
  font-size: 0.9rem;
}

/* 소셜 로그인 섹션 */
.social-login-section {
  margin-bottom: 25px;
}

.social-buttons-row {
  display: flex;
  gap: 15px;
  justify-content: center;
  width: 100%;
}

.social-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.github-btn {
  background: #24292e;
  border: 2px solid transparent;
}

.github-btn:hover:not(:disabled) {
  background: #1a1e22;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(36, 41, 46, 0.4);
}

.google-btn {
  background: white;
  border: 2px solid #dadce0;
}

.google-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #c1c7cd;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.social-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.social-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

/* GitHub 버튼의 이미지를 하얀색으로 */
.github-btn .social-logo {
  filter: brightness(0) invert(1);
}

/* 버튼 호버 시 이미지 확대 */
.social-btn:hover:not(:disabled) .social-logo {
  transform: scale(1.2);
}

/* 버튼 활성화 효과 */
.social-btn:active {
  transform: translateY(-1px);
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

/* 반응형 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 1.4rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .social-buttons-row {
    gap: 12px;
  }

  .social-btn {
    width: 45px;
    height: 45px;
    border-radius: 10px;
  }

  .social-logo {
    width: 22px;
    height: 22px;
  }
}
</style>