<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-section">
        <h1>🚀 Developer Showcase</h1>
        <p>관리자 로그인</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? "로그인 중..." : "로그인" }}
        </button>
      </form>

      <div class="form-footer">
        <p>
          계정이 없으신가요?
          <router-link to="/signup" class="signup-link">회원가입</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      isLoading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;

      // 임시 로그인 로직 (나중에 API 연동)
      console.log("로그인 시도:", this.loginForm);

      setTimeout(() => {
        this.isLoading = false;
        // 임시로 대시보드로 이동
        this.$router.push("/dashboard");
      }, 1000);
    },
  },
};
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

.login-box {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-section h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.logo-section p {
  color: #7f8c8d;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #42b883;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: #369870;
}

.login-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
}

.form-footer p {
  color: #7f8c8d;
  margin: 0;
}

.signup-link {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
