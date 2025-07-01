/**
 * 환경별 설정을 관리하는 중앙 집중식 설정 파일
 * 개발, 스테이징, 프로덕션 환경을 자동으로 감지하고 적절한 URL을 제공
 */

// 🔍 현재 환경 감지 함수
const detectEnvironment = () => {
  const origin = window.location.origin
  const hostname = window.location.hostname

  // 개발 환경 감지
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
    return 'development'
  }

  // 스테이징 환경 감지 (선택사항)
  if (hostname.includes('staging') || hostname.includes('dev') || hostname.includes('test')) {
    return 'staging'
  }

  // 프로덕션 환경
  return 'production'
}

// 🌍 환경별 기본 설정
export const getEnvironmentConfig = () => {
  const currentOrigin = window.location.origin
  const environment = detectEnvironment()

  // 기본 설정
  const config = {
    // 현재 환경 정보
    environment,
    currentOrigin,

    // 기본 URL들
    baseUrl: currentOrigin,
    siteUrl: currentOrigin,

    // 인증 관련 URL들
    resetPasswordUrl: `${currentOrigin}/reset-password`,
    callbackUrl: `${currentOrigin}/auth/callback`,

    // 환경별 특성
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',

    // Supabase 설정
    supabase: {
      url: process.env.VUE_APP_SUPABASE_URL || 'https://gjuwbcfuadlwvxrxbgui.supabase.co',
      anonKey: process.env.VUE_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdXdiY2Z1YWRsd3Z4cnhiZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDUxMzYsImV4cCI6MjA2NjIyMTEzNn0.VxjQtPM47TSijZbXK4htyoVavODwOa7gdyrSwLc1-7s'
    }
  }

  // 환경변수가 있으면 덮어쓰기 (우선순위: 환경변수 > 자동감지)
  if (process.env.VUE_APP_BASE_URL) {
    config.baseUrl = process.env.VUE_APP_BASE_URL
    config.siteUrl = process.env.VUE_APP_BASE_URL
  }

  if (process.env.VUE_APP_RESET_PASSWORD_URL) {
    config.resetPasswordUrl = process.env.VUE_APP_RESET_PASSWORD_URL
  }

  if (process.env.VUE_APP_ENVIRONMENT) {
    config.environment = process.env.VUE_APP_ENVIRONMENT
  }

  return config
}

// 🎯 특정 환경별 URL 매핑 (고급 설정)
export const getUrlByEnvironment = () => {
  const origin = window.location.origin

  // 알려진 배포 환경들의 매핑
  const environmentMap = {
    // 개발 환경
    'http://localhost:8080': {
      environment: 'development',
      resetPasswordUrl: 'http://localhost:8080/reset-password',
      callbackUrl: 'http://localhost:8080/auth/callback'
    },
    'http://localhost:3000': {
      environment: 'development',
      resetPasswordUrl: 'http://localhost:3000/reset-password',
      callbackUrl: 'http://localhost:3000/auth/callback'
    },
    'http://127.0.0.1:8080': {
      environment: 'development',
      resetPasswordUrl: 'http://127.0.0.1:8080/reset-password',
      callbackUrl: 'http://127.0.0.1:8080/auth/callback'
    },

    // 스테이징 환경 (선택사항)
    'https://staging.yourdomain.com': {
      environment: 'staging',
      resetPasswordUrl: 'https://staging.yourdomain.com/reset-password',
      callbackUrl: 'https://staging.yourdomain.com/auth/callback'
    },

    // 배포 환경들 (실제 도메인으로 변경 필요)
    'https://your-app.vercel.app': {
      environment: 'production',
      resetPasswordUrl: 'https://your-app.vercel.app/reset-password',
      callbackUrl: 'https://your-app.vercel.app/auth/callback'
    },
    'https://your-app.netlify.app': {
      environment: 'production',
      resetPasswordUrl: 'https://your-app.netlify.app/reset-password',
      callbackUrl: 'https://your-app.netlify.app/auth/callback'
    },
    'https://yourdomain.com': {
      environment: 'production',
      resetPasswordUrl: 'https://yourdomain.com/reset-password',
      callbackUrl: 'https://yourdomain.com/auth/callback'
    },
    'https://www.yourdomain.com': {
      environment: 'production',
      resetPasswordUrl: 'https://www.yourdomain.com/reset-password',
      callbackUrl: 'https://www.yourdomain.com/auth/callback'
    }
  }

  // 매핑된 환경이 있으면 사용, 없으면 기본값 반환
  return environmentMap[origin] || {
    environment: 'production',
    resetPasswordUrl: `${origin}/reset-password`,
    callbackUrl: `${origin}/auth/callback`
  }
}

// 🔍 환경별 디버그 정보 출력
export const logEnvironmentInfo = () => {
  const config = getEnvironmentConfig()
  const urlMapping = getUrlByEnvironment()

  console.log('=== 🌍 환경 설정 정보 ===')
  console.log('현재 Origin:', config.currentOrigin)
  console.log('감지된 환경:', config.environment)
  console.log('개발 환경 여부:', config.isDevelopment)
  console.log('스테이징 환경 여부:', config.isStaging)
  console.log('프로덕션 환경 여부:', config.isProduction)
  console.log('')
  console.log('=== 📍 URL 설정 ===')
  console.log('Base URL:', config.baseUrl)
  console.log('Reset Password URL:', config.resetPasswordUrl)
  console.log('Callback URL:', config.callbackUrl)
  console.log('')
  console.log('=== 🔧 Supabase 설정 ===')
  console.log('Supabase URL:', config.supabase.url)
  console.log('API Key 설정됨:', !!config.supabase.anonKey)
  console.log('')
  console.log('=== 🎯 URL 매핑 ===')
  console.log('URL 매핑:', urlMapping)
  console.log('==================')

  return config
}

// 🚨 설정 검증 함수
export const validateEnvironmentConfig = () => {
  const config = getEnvironmentConfig()
  const issues = []

  // 필수 설정 검증
  if (!config.baseUrl || config.baseUrl === 'undefined') {
    issues.push('Base URL이 설정되지 않았습니다')
  }

  if (!config.resetPasswordUrl || config.resetPasswordUrl === 'undefined') {
    issues.push('Reset Password URL이 설정되지 않았습니다')
  }

  if (!config.supabase.url || config.supabase.url === 'undefined') {
    issues.push('Supabase URL이 설정되지 않았습니다')
  }

  if (!config.supabase.anonKey || config.supabase.anonKey === 'undefined') {
    issues.push('Supabase API Key가 설정되지 않았습니다')
  }

  // HTTPS 확인 (프로덕션 환경)
  if (config.isProduction && !config.baseUrl.startsWith('https://')) {
    issues.push('프로덕션 환경에서는 HTTPS를 사용해야 합니다')
  }

  if (issues.length > 0) {
    console.error('🚨 환경 설정 문제 발견:')
    issues.forEach(issue => console.error(`- ${issue}`))
    return false
  }

  console.log('✅ 환경 설정이 올바르게 구성되었습니다')
  return true
}

// 🎯 간편 사용을 위한 헬퍼 함수들
export const getResetPasswordUrl = () => getEnvironmentConfig().resetPasswordUrl
export const getCallbackUrl = () => getEnvironmentConfig().callbackUrl
export const getBaseUrl = () => getEnvironmentConfig().baseUrl
export const isProduction = () => getEnvironmentConfig().isProduction
export const isDevelopment = () => getEnvironmentConfig().isDevelopment

// 기본 내보내기
export default {
  getEnvironmentConfig,
  getUrlByEnvironment,
  logEnvironmentInfo,
  validateEnvironmentConfig,
  getResetPasswordUrl,
  getCallbackUrl,
  getBaseUrl,
  isProduction,
  isDevelopment
}