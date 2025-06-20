<template>
  <div class="signup-container">
    <div class="signup-box">
      <div class="logo-section">
        <h1>🚀 Developer Showcase</h1>
        <p>관리자 계정 생성</p>
      </div>

      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-group">
          <label for="name">개발자 닉네임 (영어)</label>
          <input
            id="name"
            v-model="signupForm.name"
            type="text"
            placeholder="예: john_developer"
            required
            pattern="[a-zA-Z0-9_]+"
            title="영문, 숫자, 언더스코어(_)만 사용 가능합니다"
          />
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input
            id="email"
            v-model="signupForm.email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="signupForm.password"
            type="password"
            placeholder="영문대문자, 특수문자, 숫자 포함 8자 이상"
            required
            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$"
            title="영문대문자, 특수문자, 숫자를 포함하여 8자 이상이어야 합니다"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            v-model="signupForm.confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
          <span v-if="passwordMismatch" class="error-message">
            비밀번호가 일치하지 않습니다.
          </span>
        </div>

        <button
          type="submit"
          class="signup-btn"
          :disabled="isLoading || passwordMismatch"
        >
          {{ isLoading ? "가입 중..." : "회원가입" }}
        </button>
      </form>

      <div class="form-footer">
        <p>
          이미 계정이 있으신가요?
          <router-link to="/login" class="login-link">로그인</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupPage",
  data() {
    return {
      signupForm: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      isLoading: false,
    };
  },
  computed: {
    passwordMismatch() {
      return (
        this.signupForm.password &&
        this.signupForm.confirmPassword &&
        this.signupForm.password !== this.signupForm.confirmPassword
      );
    },
  },
  methods: {
    async handleSignup() {
      if (this.passwordMismatch) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      this.isLoading = true;

      // 임시 회원가입 로직 (나중에 API 연동)
      console.log("회원가입 시도:", {
        name: this.signupForm.name,
        email: this.signupForm.email,
        // 비밀번호는 로그에 남기지 않음
      });

      setTimeout(() => {
        this.isLoading = false;
        alert("회원가입이 완료되었습니다!");
        this.$router.push("/login");
      }, 1000);
    },
  },
};
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

.signup-box {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
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

.signup-form {
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

.form-group input:invalid:not(:focus) {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
}

.signup-btn {
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

.signup-btn:hover:not(:disabled) {
  background: #369870;
}

.signup-btn:disabled {
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

.login-link {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
