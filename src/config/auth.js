// 사용자 관련 유틸리티 함수들
export const authUtils = {
  // 이메일 형식 유효성 검증
  validateEmail(email) {
    if (!email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // 비밀번호 유효성 검증 (기본 - 6자 이상)
  validatePassword(password) {
    return password && password.length >= 6
  },

  // 강화된 비밀번호 유효성 검증 (8자 + 복합조건)
  validateStrongPassword(password) {
    if (!password || password.length < 8) return false
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    return hasUppercase && hasLowercase && hasNumber && hasSpecial
  },

  // 🔥 수정된 닉네임 유효성 검증 - 작은따옴표(') 허용
  validateNickname(nickname) {
    if (!nickname || typeof nickname !== 'string') {
      return {
        isValid: false,
        error: '닉네임이 필요합니다'
      }
    }

    const trimmedNickname = nickname.trim()

    // 길이 검증
    if (trimmedNickname.length < 2) {
      return {
        isValid: false,
        error: '닉네임은 최소 2자 이상이어야 합니다'
      }
    }

    if (trimmedNickname.length > 20) {
      return {
        isValid: false,
        error: '닉네임은 20자 이하여야 합니다'
      }
    }

    // 🎯 핵심 수정: 작은따옴표(') 추가 허용
    // 한글, 영문, 숫자, 언더스코어(_), 하이픈(-), 작은따옴표(') 허용 (공백 제외)
    const nicknameRegex = /^[a-zA-Z가-힣0-9_'-]+$/
    if (!nicknameRegex.test(trimmedNickname)) {
      return {
        isValid: false,
        error: '닉네임은 한글, 영문, 숫자, 언더스코어(_), 하이픈(-), 작은따옴표(\')만 사용할 수 있습니다'
      }
    }

    // 예약어 확인
    const reservedWords = ['admin', 'root', 'system', 'api', 'www', 'null', 'undefined', '관리자']
    if (reservedWords.includes(trimmedNickname.toLowerCase())) {
      return {
        isValid: false,
        error: '이 닉네임은 예약어로 사용할 수 없습니다'
      }
    }

    return {
      isValid: true,
      error: null
    }
  },

  // 이름 유효성 검증
  validateName(name) {
    return name && name.trim().length >= 2
  },

  // 사용자 세션 저장 (Supabase와 함께 사용)
  saveUserSession(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('세션 저장 오류:', error)
      return false
    }
  },

  // 사용자 세션 가져오기
  getUserSession() {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('세션 가져오기 오류:', error)
      return null
    }
  },

  // 사용자 세션 삭제
  clearUserSession() {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('rememberUser')
      localStorage.removeItem('userEmail')
      return true
    } catch (error) {
      console.error('세션 삭제 오류:', error)
      return false
    }
  },

  // 인증 상태 확인 (Supabase 세션 기반)
  async isAuthenticated() {
    try {
      // Supabase가 있으면 Supabase 세션 확인
      if (window.supabase) {
        const { data: { session } } = await window.supabase.auth.getSession()
        return session && session.user
      }
      // fallback: localStorage 확인
      const user = this.getUserSession()
      return user !== null
    } catch (error) {
      console.error('인증 상태 확인 오류:', error)
      return false
    }
  },

  // 로그인 상태 확인 (별칭)
  async isLoggedIn() {
    return await this.isAuthenticated()
  },

  // Remember Me 관련
  shouldRememberUser() {
    return localStorage.getItem('rememberUser') === 'true'
  },

  getRememberedEmail() {
    return localStorage.getItem('userEmail') || ''
  },

  setRememberUser(email, remember = true) {
    if (remember) {
      localStorage.setItem('rememberUser', 'true')
      localStorage.setItem('userEmail', email)
    } else {
      localStorage.removeItem('rememberUser')
      localStorage.removeItem('userEmail')
    }
  },

  // 추가된 유틸리티 함수들

  // 프로젝트 제목 검증
  validateProjectTitle(title) {
    if (!title || typeof title !== 'string') {
      return {
        isValid: false,
        error: '프로젝트 제목이 필요합니다'
      }
    }

    const trimmedTitle = title.trim()

    if (trimmedTitle.length < 2) {
      return {
        isValid: false,
        error: '프로젝트 제목은 최소 2자 이상이어야 합니다'
      }
    }

    if (trimmedTitle.length > 100) {
      return {
        isValid: false,
        error: '프로젝트 제목은 100자 이하여야 합니다'
      }
    }

    return {
      isValid: true,
      error: null
    }
  },

  // 입력값 보안 처리
  sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      return ''
    }

    return input
      .trim()
      .replace(/[<>]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  },

  // 파일 확장자 검증
  validateFileExtension(filename, allowedExtensions = []) {
    if (!filename) {
      return {
        isValid: false,
        error: '파일명이 필요합니다'
      }
    }

    const extension = filename.toLowerCase().split('.').pop()

    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `허용되지 않는 파일 형식입니다. 허용된 형식: ${allowedExtensions.join(', ')}`
      }
    }

    return {
      isValid: true,
      error: null
    }
  }
}