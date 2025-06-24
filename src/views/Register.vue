<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>📝 회원가입</h1>
        <p>Developer Showcase에 가입하여 포트폴리오를 관리하세요</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">이름</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="이름을 입력하세요"
            :disabled="loading"
            required
          />
        </div>

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
            placeholder="비밀번호를 입력하세요 (최소 6자)"
            :disabled="loading"
            required
            minlength="6"
          />
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
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button type="submit" class="register-btn" :disabled="loading || !isFormValid">
          <span v-if="loading">가입 중...</span>
          <span v-else>회원가입</span>
        </button>
      </form>

      <div class="login-link">
        이미 계정이 있으신가요?
        <router-link to="/login">로그인</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/config/supabase'

export default {
  name: "RegisterPage",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      error: "",
      success: ""
    }
  },
  computed: {
    isFormValid() {
      return this.name &&
        this.email &&
        this.password &&
        this.confirmPassword &&
        this.password === this.confirmPassword &&
        this.password.length >= 6
    }
  },
  methods: {
    async handleRegister() {
      if (!this.isFormValid) {
        this.error = "모든 필드를 올바르게 입력해주세요"
        return
      }

      if (this.password !== this.confirmPassword) {
        this.error = "비밀번호가 일치하지 않습니다"
        return
      }

      this.loading = true
      this.error = ""
      this.success = ""

      try {
        const { data, error } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
          options: {
            data: {
              full_name: this.name
            }
          }
        })

        if (error) {
          this.error = this.getErrorMessage(error.message)
          return
        }

        this.success = "회원가입이 완료되었습니다! 이메일을 확인해주세요."

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)

      } catch (error) {
        console.error('회원가입 오류:', error)
        this.error = "회원가입 중 오류가 발생했습니다"
      } finally {
        this.loading = false
      }
    },

    getErrorMessage(error) {
      switch (error) {
        case 'User already registered':
          return "이미 가입된 이메일입니다"
        case 'Password should be at least 6 characters':
          return "비밀번호는 최소 6자 이상이어야 합니다"
        case 'Invalid email':
          return "올바른 이메일 형식이 아닙니다"
        default:
          return "회원가입 중 오류가 발생했습니다"
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.register-header p {
  color: #6c757d;
  margin: 0;
}

.register-form {
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
  background-color: #efe;
  color: #3c763d;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  font-size: 14px;
  margin-bottom: 15px;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
}
</style>