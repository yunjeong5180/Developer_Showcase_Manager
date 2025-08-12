<template>
  <div class="two-factor-container">
    <div class="two-factor-card">
      <!-- 2FA 설정 모드 -->
      <div v-if="mode === 'setup'" class="setup-mode">
        <!-- 단계 표시기 -->
        <div class="step-indicator">
          <div
            v-for="step in 3"
            :key="step"
            class="step"
            :class="{
              active: currentStep >= step,
              completed: currentStep > step,
            }"
          >
            {{ step }}
          </div>
        </div>

        <!-- 1단계: 앱 다운로드 안내 -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="step-header">
            <h2>📱 1단계: 인증 앱 준비</h2>
            <p>2단계 인증을 위해 인증 앱이 필요합니다</p>
          </div>

          <div class="app-recommendations">
            <div class="app-item">
              <span class="app-icon">📱</span>
              <div class="app-info">
                <h4>Google Authenticator</h4>
                <p>Google에서 제공하는 무료 인증 앱</p>
              </div>
            </div>

            <div class="app-item">
              <span class="app-icon">🔐</span>
              <div class="app-info">
                <h4>Authy</h4>
                <p>다중 기기 동기화가 가능한 인증 앱</p>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button @click="nextStep" class="next-btn">
              앱 설치 완료, 다음 단계로
            </button>
          </div>
        </div>

        <!-- 2단계: QR 코드 스캔 -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="step-header">
            <h2>📷 2단계: QR 코드 스캔</h2>
            <p>인증 앱으로 아래 QR 코드를 스캔하세요</p>
          </div>

          <div class="qr-section">
            <!-- QR 코드 (실제로는 QR 라이브러리 사용) -->
            <div class="qr-code-placeholder">
              <div class="qr-pattern">
                <div class="qr-corner top-left"></div>
                <div class="qr-corner top-right"></div>
                <div class="qr-corner bottom-left"></div>
                <div class="qr-dots">
                  <div v-for="i in 49" :key="i" class="qr-dot"></div>
                </div>
              </div>
              <p class="qr-text">QR 코드</p>
            </div>

            <div class="manual-setup">
              <p>QR 코드를 스캔할 수 없나요?</p>
              <div class="secret-key">
                <label>수동으로 이 키를 입력하세요:</label>
                <div class="key-display">
                  <code>{{ secretKey }}</code>
                  <button
                    @click="copyToClipboard"
                    class="copy-btn"
                    title="클립보드에 복사"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button @click="prevStep" class="prev-btn">이전</button>
            <button @click="nextStep" class="next-btn">
              스캔 완료, 다음 단계로
            </button>
          </div>
        </div>

        <!-- 3단계: 인증 코드 확인 -->
        <div v-if="currentStep === 3" class="step-content">
          <div class="step-header">
            <h2>🔢 3단계: 인증 코드 입력</h2>
            <p>인증 앱에 표시된 6자리 코드를 입력하세요</p>
          </div>

          <form
            @submit.prevent="verifyAndActivate2FA"
            class="verification-form"
          >
            <div class="code-input-group">
              <input
                v-for="(digit, index) in verificationCode"
                :key="index"
                :ref="`codeInput${index}`"
                type="text"
                maxlength="1"
                class="code-input"
                v-model="verificationCode[index]"
                @input="handleCodeInput(index)"
                @keydown="handleKeyDown(index, $event)"
                :disabled="loading"
              />
            </div>

            <div v-if="verificationError" class="error-message">
              {{ verificationError }}
            </div>

            <div class="step-actions">
              <button @click="prevStep" type="button" class="prev-btn">
                이전
              </button>
              <button
                type="submit"
                class="activate-btn"
                :disabled="!isCodeComplete || loading"
              >
                <span v-if="loading">확인 중...</span>
                <span v-else>2단계 인증 활성화</span>
              </button>
            </div>
          </form>
        </div>

        <!-- 설정 완료 -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="success-header">
            <div class="success-icon">✅</div>
            <h2>2단계 인증 활성화 완료!</h2>
            <p>계정이 더욱 안전해졌습니다</p>
          </div>

          <div class="backup-codes">
            <h3>🔐 백업 코드</h3>
            <p>
              인증 앱에 접근할 수 없을 때 사용할 수 있는 백업 코드입니다. 안전한
              곳에 보관하세요.
            </p>

            <div class="codes-grid">
              <div v-for="code in backupCodes" :key="code" class="backup-code">
                {{ code }}
              </div>
            </div>

            <div class="backup-actions">
              <button @click="downloadBackupCodes" class="download-btn">
                💾 백업 코드 다운로드
              </button>
              <button @click="printBackupCodes" class="print-btn">
                🖨️ 백업 코드 인쇄
              </button>
            </div>
          </div>

          <div class="final-actions">
            <button @click="goToDashboard" class="complete-btn">
              대시보드로 이동
            </button>
          </div>
        </div>
      </div>

      <!-- 2FA 인증 모드 (로그인 시) -->
      <div v-if="mode === 'verify'" class="verify-mode">
        <div class="verify-header">
          <h2>🔐 2단계 인증</h2>
          <p>인증 앱에 표시된 6자리 코드를 입력하세요</p>
        </div>

        <form @submit.prevent="verify2FACode" class="verification-form">
          <div class="code-input-group">
            <input
              v-for="(digit, index) in verificationCode"
              :key="index"
              :ref="`codeInput${index}`"
              type="text"
              maxlength="1"
              class="code-input"
              v-model="verificationCode[index]"
              @input="handleCodeInput(index)"
              @keydown="handleKeyDown(index, $event)"
              :disabled="loading"
            />
          </div>

          <div v-if="verificationError" class="error-message">
            {{ verificationError }}
          </div>

          <button
            type="submit"
            class="verify-btn"
            :disabled="!isCodeComplete || loading"
          >
            <span v-if="loading">인증 중...</span>
            <span v-else>인증하기</span>
          </button>
        </form>

        <div class="alternative-options">
          <button @click="useBackupCode" class="backup-code-btn">
            백업 코드 사용하기
          </button>
        </div>

        <!-- 백업 코드 입력 -->
        <div v-if="showBackupCodeInput" class="backup-code-section">
          <h3>백업 코드 입력</h3>
          <input
            type="text"
            v-model="backupCodeInput"
            placeholder="백업 코드를 입력하세요"
            class="backup-code-input"
            :disabled="loading"
          />
          <div class="backup-code-actions">
            <button
              @click="verifyBackupCode"
              :disabled="!backupCodeInput || loading"
            >
              백업 코드로 인증
            </button>
            <button @click="showBackupCodeInput = false" type="button">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TwoFactorAuthPage",
  data() {
    return {
      mode: "setup", // 'setup' or 'verify'
      currentStep: 1,
      secretKey: "JBSWY3DPEHPK3PXP", // 실제로는 서버에서 생성
      verificationCode: ["", "", "", "", "", ""],
      verificationError: "",
      loading: false,
      backupCodes: [
        "ABC123DEF456",
        "GHI789JKL012",
        "MNO345PQR678",
        "STU901VWX234",
        "YZA567BCD890",
        "EFG123HIJ456",
        "KLM789NOP012",
        "QRS345TUV678",
      ],
      showBackupCodeInput: false,
      backupCodeInput: "",
    };
  },
  computed: {
    isCodeComplete() {
      return this.verificationCode.every((digit) => digit !== "");
    },
  },
  mounted() {
    // URL 파라미터에서 모드 확인
    const urlParams = new URLSearchParams(window.location.search);
    this.mode = urlParams.get("mode") || "setup";

    // 첫 번째 입력 필드에 포커스
    this.$nextTick(() => {
      if (this.$refs.codeInput0 && this.$refs.codeInput0[0]) {
        this.$refs.codeInput0[0].focus();
      }
    });
  },
  methods: {
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++;
        this.verificationError = "";

        // 3단계에서 첫 번째 입력 필드에 포커스
        if (this.currentStep === 3) {
          this.$nextTick(() => {
            if (this.$refs.codeInput0 && this.$refs.codeInput0[0]) {
              this.$refs.codeInput0[0].focus();
            }
          });
        }
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.verificationError = "";
      }
    },

    handleCodeInput(index) {
      // 숫자만 입력 허용
      this.verificationCode[index] = this.verificationCode[index].replace(
        /[^0-9]/g,
        ""
      );

      // 다음 입력 필드로 자동 이동
      if (this.verificationCode[index] && index < 5) {
        const nextInput = this.$refs[`codeInput${index + 1}`];
        if (nextInput && nextInput[0]) {
          nextInput[0].focus();
        }
      }
    },

    handleKeyDown(index, event) {
      // 백스페이스 키로 이전 필드로 이동
      if (
        event.key === "Backspace" &&
        !this.verificationCode[index] &&
        index > 0
      ) {
        const prevInput = this.$refs[`codeInput${index - 1}`];
        if (prevInput && prevInput[0]) {
          prevInput[0].focus();
        }
      }
    },

    async verifyAndActivate2FA() {
      this.loading = true;
      this.verificationError = "";

      try {
        const code = this.verificationCode.join("");

        // 데모용으로 '123456' 코드 허용
        if (code === "123456") {
          this.currentStep = 4;
        } else {
          this.verificationError = "인증 코드가 올바르지 않습니다";
        }
      } catch (error) {
        console.error("2FA 활성화 오류:", error);
        this.verificationError = "2단계 인증 활성화 중 오류가 발생했습니다";
      } finally {
        this.loading = false;
      }
    },

    async verify2FACode() {
      this.loading = true;
      this.verificationError = "";

      try {
        const code = this.verificationCode.join("");

        // 데모용으로 '123456' 코드 허용
        if (code === "123456") {
          // 로그인 완료 처리
          this.$router.push("/dashboard");
        } else {
          this.verificationError = "인증 코드가 올바르지 않습니다";
          // 입력 필드 초기화
          this.verificationCode = ["", "", "", "", "", ""];
          this.$nextTick(() => {
            if (this.$refs.codeInput0 && this.$refs.codeInput0[0]) {
              this.$refs.codeInput0[0].focus();
            }
          });
        }
      } catch (error) {
        console.error("2FA 인증 오류:", error);
        this.verificationError = "인증 중 오류가 발생했습니다";
      } finally {
        this.loading = false;
      }
    },

    useBackupCode() {
      this.showBackupCodeInput = true;
    },

    async verifyBackupCode() {
      this.loading = true;
      this.verificationError = "";

      try {
        // 데모용으로 백업 코드 목록에 있는 코드 허용
        if (this.backupCodes.includes(this.backupCodeInput.toUpperCase())) {
          this.$router.push("/dashboard");
        } else {
          this.verificationError = "올바르지 않은 백업 코드입니다";
        }
      } catch (error) {
        console.error("백업 코드 인증 오류:", error);
        this.verificationError = "백업 코드 인증 중 오류가 발생했습니다";
      } finally {
        this.loading = false;
      }
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.secretKey);
        // 임시로 버튼 텍스트 변경
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = "✅";
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      } catch (error) {
        console.error("클립보드 복사 실패:", error);
      }
    },

    downloadBackupCodes() {
      const codesText = this.backupCodes.join("\n");
      const blob = new Blob(
        [
          `My Codit - 2단계 인증 백업 코드\n\n${codesText}\n\n이 코드들을 안전한 곳에 보관하세요.`,
        ],
        { type: "text/plain" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "developer-showcase-backup-codes.txt";
      a.click();
      URL.revokeObjectURL(url);
    },

    printBackupCodes() {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>My Codit - 백업 코드</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .codes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0; }
              .code { padding: 10px; background: #f5f5f5; border: 1px solid #ddd; text-align: center; font-family: monospace; }
            </style>
          </head>
          <body>
            <h1>My Codit</h1>
            <h2>2단계 인증 백업 코드</h2>
            <p>이 코드들을 안전한 곳에 보관하세요. 각 코드는 한 번만 사용할 수 있습니다.</p>
            <div class="codes">
              ${this.backupCodes
                .map((code) => `<div class="code">${code}</div>`)
                .join("")}
            </div>
            <p><small>생성일: ${new Date().toLocaleDateString()}</small></p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    },

    goToDashboard() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
.two-factor-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.two-factor-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

/* 단계 표시기 */
.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 20px;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active {
  background: #667eea;
  color: white;
}

.step.completed {
  background: #28a745;
  color: white;
}

/* 단계 내용 */
.step-content {
  text-align: center;
}

.step-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.step-header p {
  color: #6c757d;
  margin-bottom: 30px;
}

/* 앱 추천 */
.app-recommendations {
  margin: 30px 0;
}

.app-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;
}

.app-item:hover {
  border-color: #667eea;
}

.app-icon {
  font-size: 2rem;
}

.app-info {
  text-align: left;
}

.app-info h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.app-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* QR 코드 */
.qr-section {
  margin: 30px 0;
}

.qr-code-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.qr-pattern {
  width: 200px;
  height: 200px;
  border: 2px solid #000;
  position: relative;
  background: white;
  margin-bottom: 10px;
}

.qr-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 4px solid #000;
}

.qr-corner.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.qr-corner.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.qr-corner.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.qr-dots {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  position: absolute;
  top: 60px;
  left: 60px;
  right: 60px;
  bottom: 60px;
}

.qr-dot {
  background: #000;
  width: 100%;
  height: 100%;
}

.qr-dot:nth-child(even) {
  background: white;
}

.qr-text {
  color: #6c757d;
  margin: 0;
}

/* 수동 설정 */
.manual-setup {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
}

.manual-setup p {
  margin: 0 0 15px 0;
  color: #6c757d;
  text-align: center;
}

.secret-key label {
  display: block;
  margin-bottom: 10px;
  color: #2c3e50;
  font-weight: 600;
}

.key-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.key-display code {
  flex: 1;
  background: white;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
}

.copy-btn {
  padding: 8px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.copy-btn:hover {
  background: #5a6fd8;
}

/* 인증 코드 입력 */
.verification-form {
  margin: 30px 0;
}

.code-input-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.code-input {
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}

.code-input:focus {
  outline: none;
  border-color: #667eea;
}

.code-input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

/* 백업 코드 */
.backup-codes {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  margin: 30px 0;
  text-align: left;
}

.backup-codes h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.backup-codes p {
  color: #6c757d;
  margin-bottom: 20px;
}

.codes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.backup-code {
  background: white;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  font-family: "Courier New", monospace;
  font-weight: 600;
}

.backup-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.download-btn,
.print-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn {
  background: #28a745;
  color: white;
}

.download-btn:hover {
  background: #218838;
}

.print-btn {
  background: #6c757d;
  color: white;
}

.print-btn:hover {
  background: #5a6268;
}

/* 버튼들 */
.step-actions,
.final-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.prev-btn,
.next-btn,
.activate-btn,
.verify-btn,
.complete-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-btn {
  background: #6c757d;
  color: white;
}

.prev-btn:hover {
  background: #5a6268;
}

.next-btn,
.activate-btn,
.verify-btn,
.complete-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.next-btn:hover:not(:disabled),
.activate-btn:hover:not(:disabled),
.verify-btn:hover:not(:disabled),
.complete-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.activate-btn:disabled,
.verify-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 성공 화면 */
.success-header {
  text-align: center;
  margin-bottom: 30px;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

/* 인증 모드 */
.verify-mode {
  text-align: center;
}

.verify-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.verify-header p {
  color: #6c757d;
  margin-bottom: 30px;
}

.alternative-options {
  margin-top: 20px;
}

.backup-code-btn {
  background: none;
  border: none;
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}

.backup-code-btn:hover {
  color: #5a6fd8;
}

/* 백업 코드 섹션 */
.backup-code-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.backup-code-section h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.backup-code-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.backup-code-input:focus {
  outline: none;
  border-color: #667eea;
}

.backup-code-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.backup-code-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.backup-code-actions button:first-child {
  background: #667eea;
  color: white;
}

.backup-code-actions button:first-child:hover:not(:disabled) {
  background: #5a6fd8;
}

.backup-code-actions button:last-child {
  background: #6c757d;
  color: white;
}

.backup-code-actions button:last-child:hover {
  background: #5a6268;
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

/* 반응형 */
@media (max-width: 768px) {
  .two-factor-card {
    padding: 30px 20px;
  }

  .code-input-group {
    gap: 5px;
  }

  .code-input {
    width: 40px;
    height: 50px;
    font-size: 1.2rem;
  }

  .codes-grid {
    grid-template-columns: 1fr;
  }

  .backup-actions {
    flex-direction: column;
  }

  .step-actions {
    flex-direction: column;
  }
}
</style>
