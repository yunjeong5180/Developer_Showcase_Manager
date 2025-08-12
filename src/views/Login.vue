<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🚀 My Codit</h1>
        <p>포트폴리오 관리 시스템에 로그인하세요</p>
      </div>

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

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            로그인 상태 유지
          </label>

          <router-link to="/forgot-password" class="forgot-password">
            비밀번호를 잊으셨나요?
          </router-link>
        </div>

        <!-- 🔥 수정: 모달이 표시되지 않을 때만 에러 메시지 표시 -->
        <div v-if="error && !showSignupModal" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span class="btn-text" v-if="loading">로그인 중...</span>
          <span class="btn-text" v-else>로그인</span>
        </button>
      </form>

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
        <router-link to="/signup">회원가입</router-link>
      </div>
    </div>

    <!-- ✨ 회원가입 유도 모달 -->
    <SignupModal
      :isVisible="showSignupModal"
      :email="email"
      @close="closeSignupModal"
      @goToSignup="goToSignupWithEmail"
      @retryLogin="retryLogin"
    />
  </div>
</template>

<script>
import { supabase } from "@/config/supabase";
import SignupModal from "@/components/SignupModal.vue";

export default {
  name: "LoginPage",
  components: {
    SignupModal,
  },
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      loading: false,
      error: "",
      showSignupModal: false, // 모달 표시 상태
    };
  },
  mounted() {
    // '로그인 상태 유지'를 선택했던 사용자의 이메일을 자동으로 채워주는 기능
    const savedEmail = localStorage.getItem("userEmail");
    const rememberUser = localStorage.getItem("rememberUser") === "true";

    if (rememberUser && savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        this.error = "이메일과 비밀번호를 입력해주세요";
        this.showSignupModal = false;
        return;
      }

      this.loading = true;
      this.error = "";
      this.showSignupModal = false;

      try {
        // '로그인 상태 유지' 선택 여부를 localStorage에 저장
        if (this.rememberMe) {
          localStorage.setItem("rememberUser", "true");
          localStorage.setItem("userEmail", this.email);
        } else {
          localStorage.setItem("rememberUser", "true"); // ✅ 기본적으로 세션 유지
          localStorage.removeItem("userEmail"); // 이메일만 기억 안함
        }

        // Vuex store를 통한 로그인 시도
        const result = await this.$store.dispatch("auth/signIn", {
          email: this.email,
          password: this.password,
        });

        if (!result.success) {
          const error = { message: result.error };
          console.log("로그인 에러:", error.message);

          // 🔥 핵심 수정: 로그인 실패 후 이메일 존재 여부 확인
          if (error.message === "Invalid login credentials") {
            const emailExists = await this.checkEmailExistsInDB(this.email);
            console.log("이메일 존재 여부 최종 결과:", emailExists);

            // 🎯 핵심 수정: 정확한 분기 처리
            if (emailExists) {
              // 이메일은 존재하지만 비밀번호가 틀림 - 일반 에러 메시지
              this.error = "비밀번호가 올바르지 않습니다. 다시 시도해주세요.";
              this.showSignupModal = false;
              console.log(
                "👤 가입된 이메일 + 틀린 비밀번호 → 에러 메시지 표시"
              );
            } else {
              // 이메일이 존재하지 않음 - 회원가입 모달
              this.error = "";
              this.showSignupModal = true;
              console.log("👻 미가입 이메일 → 회원가입 모달 표시");
              // rememberUser 설정 초기화
              localStorage.removeItem("rememberUser");
              localStorage.removeItem("userEmail");
            }
          } else {
            // 다른 에러는 바로 표시
            this.error = this.getErrorMessage(error.message);
            this.showSignupModal = false;
          }
          return;
        }

        // 로그인 성공 - store가 자동으로 업데이트됨
        console.log("로그인 성공, 대시보드로 이동");
        // 약간의 지연 후 이동 (store 업데이트 대기)
        setTimeout(() => {
          this.$router.push("/admin/dashboard");
        }, 100);
      } catch (error) {
        console.error("로그인 오류:", error);
        this.error = "로그인 중 오류가 발생했습니다";
        this.showSignupModal = false;
      } finally {
        this.loading = false;
      }
    },

    // 🔥 실제 DB 확인: Supabase로 이메일 존재 여부 확인
    async checkEmailExistsInDB(email) {
      try {
        console.log("📊 실제 DB에서 이메일 존재 여부 확인:", email);

        const normalizedEmail = email.toLowerCase().trim();

        // 🎯 방법 1: localStorage에서 최근 회원가입한 이메일 확인 (최우선)
        const recentSignups = JSON.parse(
          localStorage.getItem("recentSignups") || "[]"
        );
        if (recentSignups.includes(normalizedEmail)) {
          console.log(
            "✅ localStorage에서 가입된 이메일 확인:",
            normalizedEmail
          );
          return true;
        }

        // 🎯 방법 2: Supabase DB에서 실제 사용자 확인
        const { data, error } = await supabase
          .from("users")
          .select("email")
          .eq("email", normalizedEmail)
          .single();

        if (error) {
          // 사용자가 없으면 error가 발생함 (정상)
          if (error.code === "PGRST116" || error.message.includes("No rows")) {
            console.log("❌ DB에서 미가입 이메일 확인:", normalizedEmail);
            return false;
          }

          // 다른 에러는 로그만 출력하고 안전하게 처리
          console.warn("DB 확인 중 오류:", error);
          return false;
        }

        if (data && data.email) {
          console.log("✅ DB에서 가입된 이메일 확인:", normalizedEmail);
          return true;
        }

        console.log("❌ DB에서 미가입 이메일 확인:", normalizedEmail);
        return false;
      } catch (error) {
        console.error("이메일 존재 확인 중 오류:", error);
        // 확인할 수 없는 경우 안전하게 미가입으로 판단
        return false;
      }
    },

    // 에러 메시지 변환
    getErrorMessage(error) {
      switch (error) {
        case "Invalid login credentials":
          return "로그인 정보가 올바르지 않습니다.";
        case "Email not confirmed":
          return "이메일 인증이 필요합니다. 이메일을 확인해주세요.";
        case "Too many requests":
          return "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.";
        default:
          return "로그인 중 오류가 발생했습니다.";
      }
    },

    async handleSocialLogin(provider) {
      this.loading = true;
      this.error = "";
      this.showSignupModal = false;
      // 소셜 로그인은 항상 '상태 유지'로 간주
      localStorage.setItem("rememberUser", "true");

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: { redirectTo: `${window.location.origin}/auth/callback` },
        });

        if (error) {
          this.error = `${provider} 로그인 중 오류가 발생했습니다`;
          console.error(`${provider} 로그인 오류:`, error);
        }
      } catch (error) {
        console.error(`${provider} 로그인 오류:`, error);
        this.error = `${provider} 로그인 중 오류가 발생했습니다`;
      } finally {
        this.loading = false;
      }
    },

    signInWithGitHub() {
      this.handleSocialLogin("github");
    },

    signInWithGoogle() {
      this.handleSocialLogin("google");
    },

    // 모달 관련 메서드들
    closeSignupModal() {
      this.showSignupModal = false;
    },

    goToSignupWithEmail(email) {
      // 이메일을 쿼리 파라미터로 전달하여 회원가입 페이지로 이동
      this.$router.push({
        path: "/signup",
        query: { email: email },
      });
    },

    retryLogin() {
      this.showSignupModal = false;
      this.password = ""; // 비밀번호 초기화
      this.$nextTick(() => {
        // 비밀번호 입력 필드에 포커스
        document.getElementById("password")?.focus();
      });
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
  background: linear-gradient(
    135deg,
    #f7f7f7 0%,
    #e5e5e5 100%
  ); /* 깨끗한 회색 그라디언트 */
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
  border-color: #3b82f6; /* 포커스 시 블루 */
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
  color: #3b82f6; /* 모던 블루 */
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #2563eb; /* 블루 호버 */
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
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #1a1a1a 100%
  ); /* 차콜 블랙 그라디언트 */
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.login-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 100%);
}

.btn-text {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
}

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
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
}

.github-btn:hover:not(:disabled) {
  background: #0a0a0a;
  border-color: #0a0a0a;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.google-btn {
  background: white;
  border: 2px solid #e5e5e5;
}

.google-btn:hover:not(:disabled) {
  background: #fafafa;
  border-color: #d0d0d0;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
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

.github-btn .social-logo {
  filter: brightness(0) invert(1);
}

.social-btn:hover:not(:disabled) .social-logo {
  transform: scale(1.2);
}

.social-btn:active {
  transform: translateY(-1px);
}

.signup-link {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.signup-link a {
  color: #3b82f6; /* 모던 블루 */
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #2563eb; /* 블루 호버 */
  text-decoration: underline;
}

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
