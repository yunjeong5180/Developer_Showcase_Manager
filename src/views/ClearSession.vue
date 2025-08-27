<template>
  <div class="clear-session-container">
    <div class="clear-session-card">
      <h1>🧹 세션 클리어 도구</h1>
      <p class="description">
        테스트를 위한 모든 인증 세션과 캐시를 삭제합니다
      </p>

      <div class="session-info">
        <h3>현재 세션 상태</h3>
        <div class="status-item">
          <span class="label">Supabase 세션:</span>
          <span :class="['value', currentSession ? 'active' : 'inactive']">
            {{ currentSession ? "활성" : "비활성" }}
          </span>
        </div>
        <div class="status-item">
          <span class="label">로컬 스토리지 항목:</span>
          <span class="value">{{ localStorageCount }}개</span>
        </div>
        <div class="status-item">
          <span class="label">세션 스토리지 항목:</span>
          <span class="value">{{ sessionStorageCount }}개</span>
        </div>
        <div class="status-item">
          <span class="label">쿠키:</span>
          <span class="value">{{ cookieCount }}개</span>
        </div>
      </div>

      <div class="clear-options">
        <h3>클리어 옵션</h3>
        <label class="checkbox-item">
          <input type="checkbox" v-model="clearOptions.supabase" />
          <span>Supabase 세션 (GitHub, Google 로그인 포함)</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="clearOptions.localStorage" />
          <span>로컬 스토리지</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="clearOptions.sessionStorage" />
          <span>세션 스토리지</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="clearOptions.cookies" />
          <span>쿠키 (가능한 범위)</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="clearOptions.indexedDB" />
          <span>IndexedDB</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="clearOptions.cache" />
          <span>캐시 스토리지</span>
        </label>
      </div>

      <div class="action-buttons">
        <button @click="clearAll" class="btn btn-danger">🗑️ 전체 클리어</button>
        <button @click="clearSelected" class="btn btn-primary">
          ✨ 선택 항목 클리어
        </button>
        <button @click="refreshStatus" class="btn btn-secondary">
          🔄 상태 새로고침
        </button>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <div class="additional-actions">
        <h3>추가 도구</h3>
        <button @click="clearGitHubAuth" class="btn btn-github">
          <img src="@/assets/github.png" alt="GitHub" class="icon" />
          GitHub 인증 클리어
        </button>
        <button @click="clearGoogleAuth" class="btn btn-google">
          <img src="@/assets/google.png" alt="Google" class="icon" />
          Google 인증 클리어
        </button>
        <button @click="testLogin" class="btn btn-test">
          🧪 테스트 로그인 페이지로
        </button>
      </div>

      <div class="debug-info">
        <h3>디버그 정보</h3>
        <pre>{{ debugInfo }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/config/supabase";

export default {
  name: "ClearSession",
  data() {
    return {
      currentSession: null,
      localStorageCount: 0,
      sessionStorageCount: 0,
      cookieCount: 0,
      clearOptions: {
        supabase: true,
        localStorage: true,
        sessionStorage: true,
        cookies: true,
        indexedDB: true,
        cache: true,
      },
      message: "",
      messageType: "success",
      debugInfo: "",
    };
  },
  mounted() {
    this.refreshStatus();
  },
  methods: {
    async refreshStatus() {
      // Supabase 세션 확인
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        this.currentSession = session;
      } catch (error) {
        console.error("세션 확인 오류:", error);
        this.currentSession = null;
      }

      // 로컬 스토리지 카운트
      this.localStorageCount = localStorage.length;

      // 세션 스토리지 카운트
      this.sessionStorageCount = sessionStorage.length;

      // 쿠키 카운트
      this.cookieCount = document.cookie
        .split(";")
        .filter((c) => c.trim()).length;

      // 디버그 정보 수집
      this.collectDebugInfo();
    },

    collectDebugInfo() {
      const info = {
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage),
        cookies: document.cookie.split(";").map((c) => c.trim().split("=")[0]),
        supabaseKeys: Object.keys(localStorage).filter(
          (key) => key.includes("supabase") || key.includes("auth")
        ),
      };
      this.debugInfo = JSON.stringify(info, null, 2);
    },

    async clearAll() {
      this.clearOptions = {
        supabase: true,
        localStorage: true,
        sessionStorage: true,
        cookies: true,
        indexedDB: true,
        cache: true,
      };
      await this.clearSelected();
    },

    async clearSelected() {
      let cleared = [];

      try {
        // Supabase 세션 클리어
        if (this.clearOptions.supabase) {
          await supabase.auth.signOut();

          // Supabase 관련 localStorage 키 강제 삭제
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes("supabase") || key.includes("auth"))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key));

          cleared.push("Supabase 세션");
        }

        // 로컬 스토리지 클리어
        if (this.clearOptions.localStorage) {
          localStorage.clear();
          cleared.push("로컬 스토리지");
        }

        // 세션 스토리지 클리어
        if (this.clearOptions.sessionStorage) {
          sessionStorage.clear();
          cleared.push("세션 스토리지");
        }

        // 쿠키 클리어
        if (this.clearOptions.cookies) {
          document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name =
              eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          });
          cleared.push("쿠키");
        }

        // IndexedDB 클리어
        if (this.clearOptions.indexedDB) {
          if ("indexedDB" in window) {
            const databases = await indexedDB.databases();
            for (const db of databases) {
              await indexedDB.deleteDatabase(db.name);
            }
            cleared.push("IndexedDB");
          }
        }

        // 캐시 클리어
        if (this.clearOptions.cache) {
          if ("caches" in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
            cleared.push("캐시 스토리지");
          }
        }

        this.message = `✅ 클리어 완료: ${cleared.join(", ")}`;
        this.messageType = "success";

        // 상태 새로고침
        setTimeout(() => this.refreshStatus(), 500);
      } catch (error) {
        console.error("클리어 중 오류:", error);
        this.message = `❌ 오류 발생: ${error.message}`;
        this.messageType = "error";
      }
    },

    async clearGitHubAuth() {
      try {
        // GitHub OAuth 관련 세션 클리어
        await supabase.auth.signOut();

        // GitHub 관련 localStorage 키 삭제
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes("github") || key.includes("oauth"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));

        // GitHub OAuth 쿠키 삭제
        document.cookie =
          "sb-access-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie =
          "sb-refresh-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

        this.message = "✅ GitHub 인증이 클리어되었습니다";
        this.messageType = "success";

        // GitHub 로그아웃 페이지로 리다이렉트 (선택적)
        // window.open('https://github.com/logout', '_blank')

        setTimeout(() => this.refreshStatus(), 500);
      } catch (error) {
        console.error("GitHub 인증 클리어 오류:", error);
        this.message = `❌ 오류 발생: ${error.message}`;
        this.messageType = "error";
      }
    },

    async clearGoogleAuth() {
      try {
        // Google OAuth 관련 세션 클리어
        await supabase.auth.signOut();

        // Google 관련 localStorage 키 삭제
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes("google") || key.includes("gsi"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));

        this.message = "✅ Google 인증이 클리어되었습니다";
        this.messageType = "success";

        setTimeout(() => this.refreshStatus(), 500);
      } catch (error) {
        console.error("Google 인증 클리어 오류:", error);
        this.message = `❌ 오류 발생: ${error.message}`;
        this.messageType = "error";
      }
    },

    testLogin() {
      // 새 탭에서 로그인 페이지 열기 (테스트용)
      window.open("/login", "_blank");
    },
  },
};
</script>

<style scoped>
.clear-session-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.clear-session-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 2rem;
}

.description {
  color: #718096;
  margin-bottom: 30px;
}

.session-info {
  background: #f7fafc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}

.session-info h3 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.status-item:last-child {
  border-bottom: none;
}

.label {
  color: #4a5568;
  font-weight: 500;
}

.value {
  color: #2d3748;
  font-weight: 600;
}

.value.active {
  color: #48bb78;
}

.value.inactive {
  color: #a0aec0;
}

.clear-options {
  background: #f7fafc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}

.clear-options h3 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-item span {
  color: #4a5568;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-danger {
  background: #f56565;
  color: white;
}

.btn-danger:hover {
  background: #e53e3e;
  transform: translateY(-2px);
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #718096;
  color: white;
}

.btn-secondary:hover {
  background: #4a5568;
  transform: translateY(-2px);
}

.btn-github {
  background: #24292e;
  color: white;
}

.btn-github:hover {
  background: #1a1e22;
  transform: translateY(-2px);
}

.btn-google {
  background: #4285f4;
  color: white;
}

.btn-google:hover {
  background: #357ae8;
  transform: translateY(-2px);
}

.btn-test {
  background: #48bb78;
  color: white;
}

.btn-test:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.icon {
  width: 20px;
  height: 20px;
}

.message {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 500;
}

.message.success {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.message.error {
  background: #fed7d7;
  color: #742a2a;
  border: 1px solid #fc8181;
}

.additional-actions {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e2e8f0;
}

.additional-actions h3 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.additional-actions .btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

.debug-info {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e2e8f0;
}

.debug-info h3 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.debug-info pre {
  background: #2d3748;
  color: #a0aec0;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .clear-session-card {
    padding: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
