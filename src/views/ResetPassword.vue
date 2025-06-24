<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <div class="reset-header">
        <h1>🔐 비밀번호 재설정</h1>
        <p>새로운 비밀번호를 설정하세요</p>
      </div>

      <form @submit.prevent="handleResetPassword" class="reset-form">
        <div class="form-group">
          <label for="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            placeholder="새 비밀번호를 입력하세요"
            :disabled="loading"
            required
            @input="checkPasswordStrength"
          />

          <!-- 비밀번호 강도 표시기 -->
          <div class="password-strength" v-if="newPassword">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :class="passwordStrength.level"
                :style="{ width: passwordStrength.percentage + '%' }"
              ></div>
            </div>
            <span class="strength-text" :class="passwordStrength.level">
              {{ passwordStrength.text }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            :disabled="loading"
            required
          />

          <!-- 비밀번호 일치 여부 표시 -->
          <div v-if="confirmPassword" class="password-match">
            <span v-if="passwordsMatch" class="match-success">✅ 비밀번호가 일치합니다</span>
            <span v-else class="match-error">❌ 비밀번호가 일치하지 않습니다</span>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button
          type="submit"
          class="reset-btn"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading">재설정 중...</span>
          <span v-else>비밀번호 재설정</span>
        </button>
      </form>

      <div class="back-to-login">
        <router-link to="/login">← 로그인으로 돌아가기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/config/supabase'

export default {
  name: "ResetPasswordPage",
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      loading: false,
      error: "",
      success: "",
      passwordStrength: {
        level: 'weak',
        text: '약함',
        percentage: 0
      }
    }
  },
  computed: {
    passwordsMatch() {
      return this.newPassword === this.confirmPassword
    },
    isFormValid() {
      return this.newPassword &&
        this.confirmPassword &&
        this.passwordsMatch &&
        this.newPassword.length >= 6
    }
  },
  mounted() {
    // URL에서 토큰 확인
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (!token) {
      this.error = "유효하지 않은 재설정 링크입니다"
      setTimeout(() => {
        this.$router.push('/login')
      }, 3000)
    }
  },
  methods: {
    checkPasswordStrength() {
      const password = this.newPassword
      let strength = {
        level: 'weak',
        text: '약함',
        percentage: 20
      }

      if (password.length >= 8) {
        strength.percentage = 40
      }

      if (password.length >= 8 && /[A-Z]/.test(password)) {
        strength.level = 'medium'
        strength.text = '보통'
        strength.percentage = 60
      }

      if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength.percentage = 80
      }

      if (password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)) {
        strength.level = 'strong'
        strength.text = '강함'
        strength.percentage = 100
      }

      this.passwordStrength = strength
    },

    async handleResetPassword() {
      if (!this.isFormValid) {
        this.error = "모든 필드를 올바르게 입력해주세요"
        return
      }

      this.loading = true
      this.error = ""
      this.success = ""

      try {
        // 실제 환경에서는 Supabase의 updateUser 메서드 사용
        // const { data, error } = await supabase.auth.updateUser({
        //   password: this.newPassword
        // })

        // 데모용 성공 처리
        this.success = "비밀번호가 성공적으로 변경되었습니다"

        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)

      } catch (error) {
        console.error('비밀번호 재설정 오류:', error)
        this.error = "비밀번호 재설정 중 오류가 발생했습니다"
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-password-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.reset-header {
  text-align: center;
  margin-bottom: 30px;
}

.reset-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.reset-header p {
  color: #6c757d;
  margin: 0;
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

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.password-strength {
  margin-top: 10px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #dc3545;
}

.strength-fill.medium {
  background: #ffc107;
}

.strength-fill.strong {
  background: #28a745;
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 600;
}

.strength-text.weak {
  color: #dc3545;
}

.strength-text.medium {
  color: #ffc107;
}

.strength-text.strong {
  color: #28a745;
}

.password-match {
  margin-top: 8px;
  font-size: 0.9rem;
}

.match-success {
  color: #28a745;
}

.match-error {
  color: #dc3545;
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
  background-color: #efe;
  color: #3c763d;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  font-size: 14px;
  margin-bottom: 15px;
}

.reset-btn {
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
  margin-top: 20px;
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

/* 반응형 */
@media (max-width: 480px) {
  .reset-password-card {
    padding: 30px 20px;
  }
}
</style>