// 공통 유효성 검사 함수들
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateNickname = (nickname) => {
  const re = /^[a-zA-Z0-9_-]+$/
  return re.test(nickname) && nickname.length >= 3 && nickname.length <= 20
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}