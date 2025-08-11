// 공통 유효성 검사 함수들
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isValidEmail = validateEmail

export const validatePassword = (password) => {
  // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

export const isValidPassword = validatePassword

export const validateNickname = (nickname) => {
  const re = /^[a-zA-Z0-9_-]+$/
  return re.test(nickname) && nickname.length >= 3 && nickname.length <= 20
}

export const validateUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export const isValidUrl = validateUrl

export const validatePhone = (phone) => {
  // 한국 전화번호 형식
  const re = /^(010|011|016|017|018|019|02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)-?\d{3,4}-?\d{4}$/
  return re.test(phone.replace(/-/g, ''))
}

export const isValidPhone = validatePhone