<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="signup-header">
        <h2>📝 회원가입</h2>
        <p>My Codit Manager에 오신 것을 환영합니다!</p>
      </div>

      <form @submit.prevent="handleSignUp" class="signup-form">
        <!-- 이름 입력 -->
        <div class="form-group">
          <label for="name">이름 *</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            :class="{ 'error': errors.name }"
            :disabled="isLoading"
            placeholder="실명을 입력하세요"
            required
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <!-- 닉네임 입력 -->
        <div class="form-group">
          <label for="nickname">닉네임 *</label>
          <input
            type="text"
            id="nickname"
            v-model="formData.nickname"
            :class="{ 'error': errors.nickname }"
            :disabled="isLoading"
            placeholder="2-20자의 닉네임을 입력하세요"
            @blur="checkNicknameDuplicate"
            required
          >
          <!-- 닉네임 입력 전 안내 -->
          <div v-if="!formData.nickname && !nicknameAvailable" class="field-info">
            <small>영문, 한글, 숫자, 언더스코어(_), 하이픈(-), 작은따옴표(') 사용 가능 (2-20자)</small>
          </div>
          <span v-if="errors.nickname" class="error-message">{{ errors.nickname }}</span>
          <div v-if="nicknameChecking" class="field-checking">닉네임 중복 확인 중...</div>
          <div v-if="nicknameAvailable" class="field-success">사용 가능한 닉네임입니다</div>
        </div>

        <!-- 이메일 입력 -->
        <div class="form-group">
          <label for="email">이메일 *</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="{ 'error': errors.email }"
            :disabled="isLoading"
            placeholder="example@email.com"
            @blur="checkEmailDuplicate"
            required
          >
          <!-- 🆕 이메일이 자동 입력되었을 때 안내 -->
          <div v-if="isEmailAutoFilled" class="field-info">
            <small>✨ 로그인 시 입력한 이메일이 자동으로 입력되었습니다</small>
          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          <div v-if="emailChecking" class="field-checking">이메일 중복 확인 중...</div>
          <div v-if="emailAvailable" class="field-success">사용 가능한 이메일입니다</div>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-group">
          <label for="password">비밀번호 *</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            :class="{ 'error': errors.password }"
            :disabled="isLoading"
            placeholder="비밀번호를 입력하세요"
            @input="validatePassword"
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
            required
          >

          <!-- 비밀번호가 없고 모든 요구사항이 충족되지 않았을 때만 힌트 표시 -->
          <div v-if="!formData.password && !isPasswordStrong" class="password-hint">
            8자 이상, 영문 대/소문자, 숫자, 특수문자 포함
          </div>

          <!-- 비밀번호 입력 중이고 아직 완성되지 않았을 때만 상세 요구사항 표시 -->
          <div v-if="formData.password && passwordFocused && !isPasswordStrong" class="password-requirements">
            <div class="requirement" :class="{ 'met': passwordChecks.length }">
              <span class="check-icon">{{ passwordChecks.length ? '✓' : '○' }}</span>
              8자 이상
            </div>
            <div class="requirement" :class="{ 'met': passwordChecks.uppercase }">
              <span class="check-icon">{{ passwordChecks.uppercase ? '✓' : '○' }}</span>
              영문 대문자 포함
            </div>
            <div class="requirement" :class="{ 'met': passwordChecks.lowercase }">
              <span class="check-icon">{{ passwordChecks.lowercase ? '✓' : '○' }}</span>
              영문 소문자 포함
            </div>
            <div class="requirement" :class="{ 'met': passwordChecks.number }">
              <span class="check-icon">{{ passwordChecks.number ? '✓' : '○' }}</span>
              숫자 포함
            </div>
            <div class="requirement" :class="{ 'met': passwordChecks.special }">
              <span class="check-icon">{{ passwordChecks.special ? '✓' : '○' }}</span>
              특수문자 포함
            </div>
          </div>

          <!-- 비밀번호가 완성되었을 때 성공 메시지 표시 -->
          <div v-if="formData.password && isPasswordStrong" class="field-success">
            강력한 비밀번호입니다
          </div>

          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인 *</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :class="{ 'error': errors.confirmPassword }"
            :disabled="isLoading"
            placeholder="비밀번호를 다시 입력하세요"
            @input="validatePasswordConfirm"
            required
          >
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          <div v-if="passwordsMatch && formData.confirmPassword" class="field-success">비밀번호가 일치합니다</div>
        </div>

        <!-- 회원가입 버튼 -->
        <button
          type="submit"
          class="signup-btn"
          :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? '가입 중...' : '회원가입' }}
        </button>

        <!-- 성공/실패 메시지 -->
        <div v-if="message.text" :class="`message ${message.type}`">
          {{ message.text }}
        </div>
      </form>

      <!-- 로그인 링크 -->
      <div class="login-link">
        <p>이미 계정이 있으신가요?
          <router-link to="/login">로그인하기</router-link>
        </p>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="handleModalCancel">
      <div class="modal-content" @click.stop>
        <h3>{{ modalTitle }}</h3>
        <p>{{ modalMessage }}</p>
        <div class="modal-buttons">
          <button @click="handleModalConfirm" class="modal-btn-primary">확인</button>
          <button @click="handleModalCancel" class="modal-btn-secondary">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/shared/services'
import { authUtils } from '@/shared/utils'

export default {
  name: 'SignUp',
  data() {
    return {
      formData: {
        name: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {},
      message: {
        text: '',
        type: ''
      },
      isLoading: false,

      // 중복 확인 상태
      nicknameChecking: false,
      emailChecking: false,
      nicknameAvailable: false,
      emailAvailable: false,

      // 비밀번호 포커스 상태
      passwordFocused: false,

      // 비밀번호 강도 확인
      passwordChecks: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      },

      // 🆕 이메일 자동 입력 상태
      isEmailAutoFilled: false,

      // 모달 상태
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalRedirectTo: null
    }
  },

  // 🆕 마운트 시 이메일 자동 입력 처리
  mounted() {
    console.log('Signup 페이지 마운트, 쿼리 확인:', this.$route.query)

    // 쿼리 파라미터에서 이메일 자동 입력
    const emailQuery = this.$route.query.email
    if (emailQuery) {
      console.log('이메일 자동 입력:', emailQuery)

      this.formData.email = emailQuery
      this.isEmailAutoFilled = true

      // 이메일이 자동 입력되었으면 중복 확인도 실행
      this.$nextTick(() => {
        this.checkEmailDuplicate()
      })

      // 5초 후 자동 입력 안내 메시지 숨김
      setTimeout(() => {
        this.isEmailAutoFilled = false
      }, 5000)
    }
  },

  computed: {
    isFormValid() {
      return this.formData.name &&
        this.formData.nickname &&
        this.formData.email &&
        this.formData.password &&
        this.formData.confirmPassword &&
        !this.errors.name &&
        !this.errors.nickname &&
        !this.errors.email &&
        !this.errors.password &&
        !this.errors.confirmPassword &&
        this.nicknameAvailable &&
        this.emailAvailable &&
        this.isPasswordStrong &&
        this.passwordsMatch
    },

    isPasswordStrong() {
      return Object.values(this.passwordChecks).every(check => check === true)
    },

    passwordsMatch() {
      return this.formData.password && this.formData.confirmPassword &&
        this.formData.password === this.formData.confirmPassword
    }
  },

  methods: {
    // 이름 유효성 검사
    validateName() {
      this.errors.name = ""

      if (!authUtils.validateName(this.formData.name)) {
        this.errors.name = "이름은 2자 이상 입력해주세요"
        return false
      }

      return true
    },

    // 닉네임 유효성 검사 - 🔧 수정: 새로운 validateNickname 함수 사용
    validateNickname() {
      this.errors.nickname = ""

      if (!this.formData.nickname.trim()) {
        this.errors.nickname = "닉네임을 입력해주세요"
        return false
      }

      // 🔧 수정: authUtils.validateNickname이 객체를 반환하므로 수정
      const nicknameValidation = authUtils.validateNickname(this.formData.nickname)
      if (!nicknameValidation.isValid) {
        this.errors.nickname = nicknameValidation.error
        return false
      }

      return true
    },

    // 이메일 유효성 검사
    validateEmail() {
      this.errors.email = ""

      if (!this.formData.email.trim()) {
        this.errors.email = "이메일을 입력해주세요"
        return false
      }

      if (!authUtils.validateEmail(this.formData.email)) {
        this.errors.email = "올바른 이메일 형식을 입력해주세요"
        return false
      }

      return true
    },

    // 비밀번호 유효성 검사 - 🔧 수정: authUtils.validateStrongPassword 사용
    validatePassword() {
      this.errors.password = ""

      const password = this.formData.password

      // 길이 확인 (8자 이상)
      this.passwordChecks.length = password.length >= 8

      // 대문자 확인
      this.passwordChecks.uppercase = /[A-Z]/.test(password)

      // 소문자 확인
      this.passwordChecks.lowercase = /[a-z]/.test(password)

      // 숫자 확인
      this.passwordChecks.number = /[0-9]/.test(password)

      // 특수문자 확인
      this.passwordChecks.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

      // 🔧 수정: authUtils의 강화된 비밀번호 검증 사용
      if (!authUtils.validateStrongPassword(password)) {
        this.errors.password = "비밀번호 요구사항을 모두 충족해야 합니다"
        return false
      }

      return true
    },

    // 비밀번호 확인 유효성 검사
    validatePasswordConfirm() {
      this.errors.confirmPassword = ""

      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = "비밀번호 확인을 입력해주세요"
        return false
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = "비밀번호가 일치하지 않습니다"
        return false
      }

      return true
    },

    // 🔄 실제 DB 연동 닉네임 중복 확인
    async checkNicknameDuplicate() {
      if (!this.validateNickname()) return

      this.nicknameChecking = true
      this.nicknameAvailable = false

      try {
        console.log('닉네임 중복 확인:', this.formData.nickname.trim())

        // 실제 Supabase에서 닉네임 중복 확인
        const { data, error } = await authService.checkNicknameDuplicate(this.formData.nickname.trim())

        if (error) {
          console.error('닉네임 중복 확인 오류:', error)
          this.errors.nickname = "닉네임 확인 중 오류가 발생했습니다"
          this.nicknameAvailable = false
        } else if (data.exists) {
          this.errors.nickname = "이미 사용 중인 닉네임입니다"
          this.nicknameAvailable = false
        } else {
          this.errors.nickname = ""
          this.nicknameAvailable = true
        }

        console.log('닉네임 확인 완료:', this.formData.nickname.trim(), '사용가능:', this.nicknameAvailable)

      } catch (error) {
        console.error('닉네임 중복 확인 예외:', error)
        this.errors.nickname = "닉네임 확인 중 오류가 발생했습니다"
        this.nicknameAvailable = false
      } finally {
        this.nicknameChecking = false
      }
    },

    // 🔄 실제 DB 연동 이메일 중복 확인
    async checkEmailDuplicate() {
      if (!this.validateEmail()) return

      this.emailChecking = true
      this.emailAvailable = false

      try {
        console.log('이메일 중복 확인:', this.formData.email.trim())

        // 실제 Supabase에서 이메일 중복 확인
        const { data, error } = await authService.checkEmailDuplicate(this.formData.email.trim())

        if (error) {
          console.error('이메일 중복 확인 오류:', error)
          this.errors.email = "이메일 확인 중 오류가 발생했습니다"
          this.emailAvailable = false
        } else if (data.exists) {
          if (data.forbidden) {
            this.errors.email = "사용할 수 없는 이메일입니다"
          } else {
            this.errors.email = "이미 가입된 이메일입니다"
          }
          this.emailAvailable = false
        } else {
          this.errors.email = ""
          this.emailAvailable = true
        }

        console.log('이메일 확인 완료:', this.formData.email.trim(), '사용가능:', this.emailAvailable)

      } catch (error) {
        console.error('이메일 중복 확인 예외:', error)
        this.errors.email = "이메일 확인 중 오류가 발생했습니다"
        this.emailAvailable = false
      } finally {
        this.emailChecking = false
      }
    },

    // 폼 유효성 검사
    validateForm() {
      const nameValid = this.validateName()
      const nicknameValid = this.validateNickname()
      const emailValid = this.validateEmail()
      const passwordValid = this.validatePassword()
      const confirmPasswordValid = this.validatePasswordConfirm()

      return nameValid && nicknameValid && emailValid && passwordValid && confirmPasswordValid
    },

    // 🔥 회원가입 처리 - 이메일 추적 기능 포함
    async handleSignUp() {
      // 유효성 검사
      if (!this.validateForm()) {
        this.message = {
          text: '입력 정보를 확인해주세요',
          type: 'error'
        }
        return
      }

      if (!this.nicknameAvailable) {
        this.message = {
          text: '닉네임 중복 확인을 완료해주세요',
          type: 'error'
        }
        return
      }

      if (!this.emailAvailable) {
        this.message = {
          text: '이메일 중복 확인을 완료해주세요',
          type: 'error'
        }
        return
      }

      this.isLoading = true
      this.message = { text: '', type: '' }

      try {
        console.log('회원가입 시도:', {
          name: this.formData.name,
          nickname: this.formData.nickname,
          email: this.formData.email
        })

        // 🔒 RLS 정책으로 인해 사전 중복 확인 불가, 회원가입 시 확인
        console.log('회원가입 진행 (중복 확인은 회원가입 시 처리)')

        // 🚀 실제 회원가입 (한 번만!)
        const result = await authService.signUp({
          name: this.formData.name.trim(),
          nickname: this.formData.nickname.trim(),
          email: this.formData.email.toLowerCase().trim(),
          password: this.formData.password
        })

        if (result.success) {
          // 폼 초기화
          this.resetForm()

          // 모달로 사용자에게 선택권 제공
          this.showSuccessModal('회원가입 완료', '회원가입이 완료되었습니다! 로그인 페이지로 이동하시겠습니까?', '/login')
        } else {
          this.message = {
            text: this.getErrorMessage(result.error),
            type: 'error'
          }
        }
      } catch (error) {
        this.message = {
          text: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
          type: 'error'
        }
        console.error('SignUp Error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 폼 초기화
    resetForm() {
      this.formData = {
        name: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
      this.errors = {}
      this.nicknameAvailable = false
      this.emailAvailable = false
      this.isEmailAutoFilled = false
      this.passwordChecks = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    },

    // 에러 메시지 변환
    getErrorMessage(error) {
      switch (error) {
        case 'User already registered':
          return "이미 가입된 이메일입니다"
        case 'Password should be at least 6 characters':
          return "비밀번호는 최소 6자 이상이어야 합니다"
        case 'Invalid email':
          return "올바른 이메일 형식이 아닙니다"
        default:
          return `회원가입 실패: ${error}`
      }
    },

    showSuccessModal(title, message, redirectTo) {
      this.modalTitle = title
      this.modalMessage = message
      this.modalRedirectTo = redirectTo
      this.showModal = true
      this.message = { text: '', type: '' }
    },

    handleModalConfirm() {
      this.showModal = false
      if (this.modalRedirectTo) {
        this.$router.push(this.modalRedirectTo)
      }
    },

    handleModalCancel() {
      this.showModal = false
      this.modalRedirectTo = null
    }
  },

  watch: {
    // 닉네임 변경 시 중복 확인 상태 초기화
    'formData.nickname'() {
      this.nicknameAvailable = false
      this.errors.nickname = ""
    },

    // 이메일 변경 시 중복 확인 상태 초기화
    'formData.email'() {
      this.emailAvailable = false
      this.errors.email = ""
      // 🆕 이메일이 수동으로 변경되면 자동 입력 안내 숨김
      if (!this.$route.query.email || this.formData.email !== this.$route.query.email) {
        this.isEmailAutoFilled = false
      }
    }
  }
}
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

.signup-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 40px;
}

.signup-header {
  text-align: center;
  margin-bottom: 30px;
}

.signup-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.signup-header p {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.signup-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
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

.form-group input.error {
  border-color: #dc3545;
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.field-info {
  margin-top: 5px;
}

.field-info small {
  color: #6c757d;
  font-size: 0.85rem;
}

/* 🆕 자동 입력 안내 스타일 */
.field-info small {
  color: #6c757d;
  font-size: 0.85rem;
  animation: fadeInInfo 0.5s ease-in;
}

@keyframes fadeInInfo {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.field-success {
  color: #28a745;
  font-size: 0.85rem;
  margin-top: 5px;
}

.field-checking {
  color: #ffc107;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* 비밀번호 힌트 */
.password-hint {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  font-weight: 500;
}

/* 비밀번호 요구사항 */
.password-requirements {
  margin-top: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.requirement {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: #6c757d;
  transition: color 0.3s ease;
}

.requirement.met {
  color: #28a745;
}

.requirement:last-child {
  margin-bottom: 0;
}

.check-icon {
  margin-right: 8px;
  width: 16px;
  font-weight: bold;
}

.signup-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.signup-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.signup-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link p {
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
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
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-content h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.modal-content p {
  color: #6c757d;
  margin-bottom: 25px;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-btn-primary, .modal-btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.modal-btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.modal-btn-secondary:hover {
  background: #e9ecef;
  color: #495057;
}

@media (max-width: 480px) {
  .signup-card {
    padding: 30px 20px;
  }

  .signup-header h2 {
    font-size: 1.5rem;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .modal-content {
    padding: 20px;
    margin: 0 10px;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .modal-btn-primary, .modal-btn-secondary {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>