# 비밀번호 재설정 기능 수정 문서

## 문제 설명

비밀번호 재설정 링크를 클릭하면 다음과 같은 문제가 발생했습니다:
- "세션 만료"라는 에러 메시지가 표시됨
- 3초 후 자동으로 재설정 페이지로 이동하는 이상한 동작
- 실제로는 비밀번호 재설정이 정상적으로 작동하지 않음

## 문제 원인 분석

### 1. 잘못된 리다이렉트 흐름
- Supabase는 비밀번호 재설정 링크를 `/auth/callback#type=recovery&access_token=...` 형태로 보냄
- AuthCallback.vue에서 세션 확인을 먼저 하고 나서 recovery 타입을 체크하여 순서가 잘못됨
- ResetPassword.vue에서 세션 설정 실패 시 무조건 3초 후 리다이렉트하여 혼란 발생

### 2. URL 설정 문제
- ForgotPassword.vue에서 재설정 링크의 redirectTo를 `/reset-password`로 직접 설정
- Supabase는 기본적으로 `/auth/callback`을 거쳐야 정상 작동

## 수정 내용

### 1. AuthCallback.vue 수정

```javascript
// 수정 전
async mounted() {
  // URL 파라미터 추출
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const type = hashParams.get('type')
  const accessToken = hashParams.get('access_token')
  
  // 비밀번호 재설정 타입 체크 전에 세션 확인을 먼저 함 (문제!)
  const { data, error } = await supabase.auth.getSession()
  
  if (type === 'recovery' && accessToken) {
    this.$router.push('/reset-password' + window.location.hash)
    return
  }
}

// 수정 후
async mounted() {
  // URL 파라미터 추출
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const type = hashParams.get('type')
  const accessToken = hashParams.get('access_token')
  const error = hashParams.get('error')
  const errorCode = hashParams.get('error_code')
  
  // 에러 처리 추가
  if (error) {
    console.error('AuthCallback 에러:', error, errorCode)
    this.error = `인증 오류: ${error}`
    if (errorCode === 'otp_expired') {
      this.error = '비밀번호 재설정 링크가 만료되었습니다.'
    }
    setTimeout(() => {
      this.$router.push('/forgot-password')
    }, 3000)
    return
  }
  
  // 비밀번호 재설정은 세션 확인 없이 즉시 리다이렉트
  if (type === 'recovery' && accessToken) {
    console.log('비밀번호 재설정 타입 감지')
    // replace 사용으로 히스토리 문제 해결
    this.$router.replace({
      path: '/reset-password',
      hash: window.location.hash
    })
    return
  }
  
  // 일반 OAuth 로그인만 세션 확인
  const { data, error: sessionError } = await supabase.auth.getSession()
}
```

### 2. ResetPassword.vue 수정

```javascript
// 수정 전
async initializeSession() {
  try {
    // 세션 설정 시도...
  } catch (err) {
    this.error = err.message
    // 무조건 3초 후 리다이렉트 (문제!)
    setTimeout(() => this.$router.push('/forgot-password'), 3000)
  } finally {
    this.isLoading = false
  }
}

// 수정 후
async initializeSession() {
  try {
    // URL 파라미터 추출 및 검증
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    
    // 에러 체크
    const error = params.get('error')
    const errorCode = params.get('error_code')
    
    if (error) {
      if (errorCode === 'otp_expired') {
        this.error = '비밀번호 재설정 링크가 만료되었습니다.'
        setTimeout(() => this.$router.push('/forgot-password'), 3000)
        return
      }
    }
    
    // 토큰 검증
    const accessToken = params.get('access_token')
    const tokenType = params.get('type')
    const refreshToken = params.get('refresh_token')
    
    if (!accessToken || tokenType !== 'recovery') {
      this.error = '유효하지 않은 재설정 링크입니다.'
      setTimeout(() => this.$router.push('/forgot-password'), 3000)
      return
    }
    
    // 기존 세션 정리
    await supabase.auth.signOut()
    
    // 세션 설정
    const { data, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || accessToken
    })
    
    if (sessionError) {
      if (sessionError.message.includes('JWT') || sessionError.message.includes('expired')) {
        this.error = '비밀번호 재설정 링크가 만료되었습니다.'
        setTimeout(() => this.$router.push('/forgot-password'), 3000)
        return
      }
      throw sessionError
    }
    
    // 성공 시에만 sessionReady를 true로 설정
    this.sessionReady = true
    this.error = null
    
  } catch (err) {
    this.error = err.message
    // 에러가 발생해도 폼은 표시 (리다이렉트하지 않음)
    this.sessionReady = false
  } finally {
    this.isLoading = false
  }
}
```

### 3. ForgotPassword.vue 수정

```javascript
// 수정 전
const resetUrl = getResetPasswordUrl() // '/reset-password'
const { error } = await supabase.auth.resetPasswordForEmail(this.email, {
  redirectTo: resetUrl
})

// 수정 후
const callbackUrl = getCallbackUrl() // '/auth/callback'
const { error } = await supabase.auth.resetPasswordForEmail(this.email, {
  redirectTo: callbackUrl // Supabase 기본 동작 사용
})
```

## 개선된 비밀번호 재설정 흐름

1. **이메일 전송**
   - 사용자가 이메일 입력 → 재설정 링크 전송
   - redirectTo: `/auth/callback` 설정

2. **링크 클릭**
   - 이메일의 링크 클릭 → `/auth/callback#type=recovery&access_token=...`로 이동

3. **AuthCallback 처리**
   - recovery 타입 감지 → 세션 확인 없이 즉시 `/reset-password`로 리다이렉트
   - URL 해시(토큰 정보) 유지

4. **ResetPassword 처리**
   - 토큰 검증 및 세션 설정
   - 성공 시: 비밀번호 변경 폼 표시
   - 실패 시: 에러 메시지 표시 (만료된 링크 등)

5. **비밀번호 변경**
   - 새 비밀번호 입력 → 변경 완료
   - 세션 종료 후 로그인 페이지로 이동

## 주요 개선사항

### 1. 에러 처리 강화
- 토큰 만료 감지 및 적절한 메시지 표시
- JWT 에러, 세션 에러 등 다양한 에러 케이스 처리

### 2. 사용자 경험 개선
- 불필요한 리다이렉트 제거
- 명확한 에러 메시지 제공
- 로딩 상태 표시

### 3. 보안 강화
- 세션 설정 전 기존 세션 정리
- 토큰 유효성 검증 강화

## Supabase 설정 확인사항

Supabase Dashboard에서 다음 설정을 확인해야 합니다:

1. **Redirect URLs 설정**
   - Authentication > URL Configuration
   - 다음 URL들이 추가되어 있어야 함:
     - `http://localhost:8080/auth/callback` (개발)
     - `https://yourdomain.com/auth/callback` (프로덕션)

2. **이메일 템플릿**
   - Authentication > Email Templates
   - Reset Password 템플릿의 링크가 올바른지 확인

## 테스트 방법

1. 비밀번호 찾기 페이지에서 이메일 입력
2. 이메일 수신 확인 (스팸함 확인)
3. 재설정 링크 클릭
4. 새 비밀번호 입력 및 변경
5. 변경된 비밀번호로 로그인 확인

## 추가 개선 가능사항

1. **이메일 재전송 제한**
   - 현재: 30초 제한
   - 추천: rate limiting 강화

2. **토큰 만료 시간 표시**
   - 링크 유효 시간 명시 (24시간)

3. **다국어 지원**
   - 에러 메시지 다국어화

4. **로깅 및 모니터링**
   - 재설정 시도/성공/실패 추적