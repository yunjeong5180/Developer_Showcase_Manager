<!-- src/components/SecuritySettings.vue -->
<template>
  <div class="security-settings">
    <h3>보안 설정</h3>

    <!-- 2단계 인증 섹션 -->
    <div class="security-section">
      <div class="security-item">
        <div class="security-info">
          <div class="security-icon">🔐</div>
          <div class="security-details">
            <h4>2단계 인증 (2FA)</h4>
            <p>계정 보안을 강화하기 위해 2단계 인증을 활성화하세요.</p>
            <div class="status-badge" :class="twoFactorStatus.class">
              {{ twoFactorStatus.text }}
            </div>
          </div>
        </div>

        <div class="security-actions">
          <button
            v-if="!user2FA.enabled"
            @click="enable2FA"
            class="btn-enable"
            :disabled="loading"
          >
            활성화
          </button>

          <div v-else class="enabled-actions">
            <button @click="show2FABackupCodes" class="btn-backup">
              백업 코드 보기
            </button>
            <button @click="disable2FA" class="btn-disable" :disabled="loading">
              비활성화
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 비밀번호 변경 섹션 -->
    <div class="security-section">
      <div class="security-item">
        <div class="security-info">
          <div class="security-icon">🔑</div>
          <div class="security-details">
            <h4>비밀번호 변경</h4>
            <p>정기적으로 비밀번호를 변경하여 계정을 안전하게 보호하세요.</p>
            <small class="last-changed">
              마지막 변경: {{ formatDate(user.lastPasswordChange) }}
            </small>
          </div>
        </div>

        <div class="security-actions">
          <button @click="changePassword" class="btn-change">
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>

    <!-- 로그인 기록 섹션 -->
    <div class="security-section">
      <div class="security-item">
        <div class="security-info">
          <div class="security-icon">📱</div>
          <div class="security-details">
            <h4>로그인 기록</h4>
            <p>최근 로그인 활동을 확인하여 의심스러운 접근을 모니터링하세요.</p>
          </div>
        </div>

        <div class="security-actions">
          <button @click="viewLoginHistory" class="btn-view">
            기록 보기
          </button>
        </div>
      </div>
    </div>

    <!-- 계정 연결 섹션 -->
    <div class="security-section">
      <div class="security-item">
        <div class="security-info">
          <div class="security-icon">🔗</div>
          <div class="security-details">
            <h4>계정 연결</h4>
            <p>소셜 계정을 연결하여 편리하게 로그인하세요.</p>
          </div>
        </div>

        <div class="security-actions">
          <div class="connected-accounts">
            <div class="account-item" v-for="provider in socialProviders" :key="provider.name">
              <span class="provider-icon">{{ provider.icon }}</span>
              <span class="provider-name">{{ provider.name }}</span>
              <button
                v-if="!provider.connected"
                @click="connectAccount(provider.name)"
                class="btn-connect"
              >
                연결
              </button>
              <button
                v-else
                @click="disconnectAccount(provider.name)"
                class="btn-disconnect"
              >
                연결 해제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 비밀번호 변경 모달 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>비밀번호 변경</h3>
          <button @click="closePasswordModal" class="modal-close">&times;</button>
        </div>

        <form @submit.prevent="submitPasswordChange" class="password-form">
          <div class="form-group">
            <label for="currentPassword">현재 비밀번호</label>
            <input
              id="currentPassword"
              v-model="passwordForm.current"
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              required
              :disabled="passwordLoading"
            />
          </div>

          <div class="form-group">
            <label for="newPassword">새 비밀번호</label>
            <input
              id="newPassword"
              v-model="passwordForm.new"
              type="password"
              placeholder="새 비밀번호를 입력하세요"
              required
              :disabled="passwordLoading"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">새 비밀번호 확인</label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirm"
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              required
              :disabled="passwordLoading"
            />
          </div>

          <div v-if="passwordError" class="error-message">
            {{ passwordError }}
          </div>

          <div class="modal-actions">
            <button type="button" @click="closePasswordModal" class="btn-cancel">
              취소
            </button>
            <button
              type="submit"
              class="btn-save"
              :disabled="passwordLoading || !isPasswordFormValid"
            >
              <span v-if="passwordLoading">변경 중...</span>
              <span v-else>변경하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 로그인 기록 모달 -->
    <div v-if="showLoginHistoryModal" class="modal-overlay" @click="closeLoginHistoryModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>로그인 기록</h3>
          <button @click="closeLoginHistoryModal" class="modal-close">&times;</button>
        </div>

        <div class="login-history">
          <div class="history-item" v-for="log in loginHistory" :key="log.id">
            <div class="history-info">
              <div class="history-main">
                <span class="device">{{ log.device }}</span>
                <span class="location">{{ log.location }}</span>
              </div>
              <div class="history-meta">
                <span class="time">{{ formatDateTime(log.timestamp) }}</span>
                <span class="ip">{{ log.ip }}</span>
                <span class="status" :class="log.success ? 'success' : 'failed'">
                  {{ log.success ? '성공' : '실패' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/config/supabase'

export default {
  name: 'SecuritySettings',
  data() {
    return {
      loading: false,
      passwordLoading: false,
      showPasswordModal: false,
      showLoginHistoryModal: false,
      passwordError: '',
      passwordForm: {
        current: '',
        new: '',
        confirm: ''
      },
      user2FA: {
        enabled: false,
        backupCodes: []
      },
      user: {
        lastPasswordChange: '2024-01-15T10:30:00Z'
      },
      socialProviders: [
        {
          name: 'GitHub',
          icon: '🐙',
          connected: false
        },
        {
          name: 'Google',
          icon: '🔍',
          connected: true
        }
      ],
      loginHistory: [
        {
          id: 1,
          device: 'Chrome on Windows',
          location: 'Seoul, South Korea',
          ip: '192.168.1.1',
          timestamp: '2024-06-24T14:30:00Z',
          success: true
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          location: 'Seoul, South Korea',
          ip: '192.168.1.2',
          timestamp: '2024-06-23T09:15:00Z',
          success: true
        },
        {
          id: 3,
          device: 'Unknown Device',
          location: 'Unknown Location',
          ip: '203.123.456.789',
          timestamp: '2024-06-22T23:45:00Z',
          success: false
        }
      ]
    }
  },
  computed: {
    twoFactorStatus() {
      if (this.user2FA.enabled) {
        return {
          class: 'enabled',
          text: '활성화됨'
        }
      } else {
        return {
          class: 'disabled',
          text: '비활성화됨'
        }
      }
    },
    isPasswordFormValid() {
      return this.passwordForm.current &&
        this.passwordForm.new &&
        this.passwordForm.confirm &&
        this.passwordForm.new === this.passwordForm.confirm &&
        this.passwordForm.new.length >= 6
    }
  },
  methods: {
    enable2FA() {
      this.$router.push('/two-factor-auth?mode=setup')
    },

    async disable2FA() {
      if (!confirm('2단계 인증을 비활성화하시겠습니까? 계정 보안이 약해질 수 있습니다.')) {
        return
      }

      this.loading = true
      try {
        // 실제로는 서버 API 호출
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.user2FA.enabled = false
        alert('2단계 인증이 비활성화되었습니다.')
      } catch (error) {
        console.error('2FA 비활성화 오류:', error)
        alert('2단계 인증 비활성화에 실패했습니다.')
      } finally {
        this.loading = false
      }
    },

    show2FABackupCodes() {
      alert('백업 코드 보기 기능 구현 예정')
    },

    changePassword() {
      this.showPasswordModal = true
      this.passwordForm = {
        current: '',
        new: '',
        confirm: ''
      }
      this.passwordError = ''
    },

    closePasswordModal() {
      this.showPasswordModal = false
    },

    async submitPasswordChange() {
      if (!this.isPasswordFormValid) {
        this.passwordError = '모든 필드를 올바르게 입력해주세요.'
        return
      }

      if (this.passwordForm.new !== this.passwordForm.confirm) {
        this.passwordError = '새 비밀번호가 일치하지 않습니다.'
        return
      }

      this.passwordLoading = true
      this.passwordError = ''

      try {
        // 실제로는 현재 비밀번호 확인 후 새 비밀번호로 변경
        const result = await authAPI.updatePassword(this.passwordForm.new)

        if (result.success) {
          alert('비밀번호가 성공적으로 변경되었습니다.')
          this.closePasswordModal()
          this.user.lastPasswordChange = new Date().toISOString()
        } else {
          this.passwordError = result.error || '비밀번호 변경에 실패했습니다.'
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error)
        this.passwordError = '비밀번호 변경 중 오류가 발생했습니다.'
      } finally {
        this.passwordLoading = false
      }
    },

    viewLoginHistory() {
      this.showLoginHistoryModal = true
    },

    closeLoginHistoryModal() {
      this.showLoginHistoryModal = false
    },

    async connectAccount(provider) {
      try {
        if (provider === 'GitHub') {
          await authAPI.signInWithGitHub()
        } else if (provider === 'Google') {
          await authAPI.signInWithGoogle()
        }
      } catch (error) {
        console.error(`${provider} 연결 오류:`, error)
        alert(`${provider} 계정 연결에 실패했습니다.`)
      }
    },

    async disconnectAccount(provider) {
      if (!confirm(`${provider} 계정 연결을 해제하시겠습니까?`)) {
        return
      }

      try {
        // 실제로는 서버 API 호출
        await new Promise(resolve => setTimeout(resolve, 500))

        const providerObj = this.socialProviders.find(p => p.name === provider)
        if (providerObj) {
          providerObj.connected = false
        }

        alert(`${provider} 계정 연결이 해제되었습니다.`)
      } catch (error) {
        console.error(`${provider} 연결 해제 오류:`, error)
        alert(`${provider} 계정 연결 해제에 실패했습니다.`)
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.security-settings {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.security-settings h3 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.4rem;
}

.security-section {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e9ecef;
}

.security-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.security-info {
  display: flex;
  gap: 15px;
  flex: 1;
}

.security-icon {
  font-size: 1.5rem;
  margin-top: 5px;
}

.security-details h4 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.security-details p {
  color: #6c757d;
  margin-bottom: 8px;
  line-height: 1.5;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.enabled {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.disabled {
  background: #f8d7da;
  color: #721c24;
}

.last-changed {
  color: #6c757d;
  font-size: 0.9rem;
}

.security-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;
}

.enabled-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-enable,
.btn-disable,
.btn-change,
.btn-view,
.btn-backup {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-enable {
  background: #28a745;
  color: white;
}

.btn-enable:hover:not(:disabled) {
  background: #218838;
}

.btn-disable {
  background: #dc3545;
  color: white;
}

.btn-disable:hover:not(:disabled) {
  background: #c82333;
}

.btn-change,
.btn-view {
  background: #007bff;
  color: white;
}

.btn-change:hover,
.btn-view:hover {
  background: #0056b3;
}

.btn-backup {
  background: #6c757d;
  color: white;
  font-size: 0.8rem;
  padding: 6px 12px;
}

.btn-backup:hover {
  background: #5a6268;
}

.btn-enable:disabled,
.btn-disable:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 연결된 계정 */
.connected-accounts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.provider-icon {
  font-size: 1.2rem;
}

.provider-name {
  flex: 1;
  font-weight: 500;
  color: #495057;
}

.btn-connect,
.btn-disconnect {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-connect {
  background: #28a745;
  color: white;
}

.btn-connect:hover {
  background: #218838;
}

.btn-disconnect {
  background: #dc3545;
  color: white;
}

.btn-disconnect:hover {
  background: #c82333;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.modal-close:hover {
  background: #f8f9fa;
}

/* 비밀번호 폼 */
.password-form {
  padding: 20px;
}

.password-form .form-group {
  margin-bottom: 20px;
}

.password-form .form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.password-form .form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.password-form .form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.password-form .form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #c33;
  font-size: 14px;
  margin-bottom: 15px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel,
.btn-save {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-save {
  background: #007bff;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #0056b3;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 로그인 기록 */
.login-history {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background 0.3s ease;
}

.history-item:hover {
  background: #f8f9fa;
}

.history-item:last-child {
  margin-bottom: 0;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-main {
  display: flex;
  gap: 15px;
  align-items: center;
}

.device {
  font-weight: 600;
  color: #2c3e50;
}

.location {
  color: #6c757d;
}

.history-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 0.9rem;
}

.time {
  color: #6c757d;
}

.ip {
  color: #6c757d;
  font-family: 'Courier New', monospace;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.success {
  background: #d1ecf1;
  color: #0c5460;
}

.status.failed {
  background: #f8d7da;
  color: #721c24;
}

/* 반응형 */
@media (max-width: 768px) {
  .security-item {
    flex-direction: column;
    gap: 15px;
  }

  .security-info {
    gap: 12px;
  }

  .security-actions {
    align-self: stretch;
  }

  .enabled-actions {
    flex-direction: row;
  }

  .connected-accounts {
    min-width: auto;
  }

  .modal-content {
    margin: 20px;
    width: calc(100% - 40px);
  }

  .modal-actions {
    flex-direction: column;
  }

  .history-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .history-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
}