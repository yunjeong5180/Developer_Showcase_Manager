// 인증 관련 유틸리티 함수들
export const authUtils = {
  // 이메일 유효성 검사
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // 비밀번호 유효성 검사
  validatePassword(password) {
    return password && password.length >= 6
  },

  // 간단한 비밀번호 해싱 (실제로는 서버에서 처리하는 것이 좋음)
  async hashPassword(password) {
    // 브라우저 환경에서는 실제 bcrypt 대신 간단한 해싱 사용
    // 실제 프로덕션에서는 서버사이드에서 처리해야 함

    // Web Crypto API를 사용한 간단한 해싱
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return hashHex
  },

  // 비밀번호 검증 (로그인 시 사용)
  async verifyPassword(password, hashedPassword) {
    const hashedInput = await this.hashPassword(password)
    return hashedInput === hashedPassword
  },

  // 사용자 세션 저장
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
      return true
    } catch (error) {
      console.error('세션 삭제 오류:', error)
      return false
    }
  },

  // 인증 상태 확인
  isAuthenticated() {
    const user = this.getUserSession()
    return user !== null
  }
}