import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 설정
const supabaseUrl = 'https://gjuwbcfuadlwvxrxbgui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdXdiY2Z1YWRsd3Z4cnhiZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDUxMzYsImV4cCI6MjA2NjIyMTEzNn0.VxjQtPM47TSijZbXK4htyoVavODwOa7gdyrSwLc1-7s'

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    redirectTo: `${window.location.origin}/auth/callback`
  }
})

// 인증 관련 API 함수들
export const authAPI = {
  // 닉네임 중복 체크 추가
  async checkNicknameDuplicate(nickname) {
    try {
      console.log('닉네임 중복 확인:', nickname)

      // 임시로 금지된 닉네임 목록으로 체크 (실제로는 DB 쿼리)
      const forbiddenNicknames = ['admin', 'test', 'administrator', 'root', 'user']

      if (forbiddenNicknames.includes(nickname.toLowerCase())) {
        return {
          available: false,
          message: '사용할 수 없는 닉네임입니다'
        }
      }

      // 실제 구현 시에는 아래 주석을 해제하고 users 테이블을 쿼리
      /*
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('nickname', nickname)
        .single()

      if (error && error.code === 'PGRST116') {
        return { available: true }
      }

      if (error) {
        throw error
      }

      return {
        available: false,
        message: '이미 사용 중인 닉네임입니다'
      }
      */

      return { available: true }
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error)
      return {
        available: false,
        message: '닉네임 확인 중 오류가 발생했습니다'
      }
    }
  },

  // 이메일 중복 체크 수정
  async checkEmailDuplicate(email) {
    try {
      console.log('이메일 중복 확인:', email)

      // 임시로 금지된 이메일 목록으로 체크
      const forbiddenEmails = ['admin@test.com', 'test@example.com']

      if (forbiddenEmails.includes(email.toLowerCase())) {
        return {
          available: false,
          message: '이미 사용 중인 이메일입니다'
        }
      }

      // 실제 구현 시에는 auth.users 테이블을 직접 확인할 수 없으므로
      // 회원가입 시도를 통해 중복을 확인하거나 별도 테이블을 사용

      return { available: true }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error)
      return {
        available: false,
        message: '이메일 확인 중 오류가 발생했습니다'
      }
    }
  },

  // 기존 이메일 중복 체크 (하위 호환성)
  async checkEmailExists(email) {
    const result = await this.checkEmailDuplicate(email)
    return !result.available
  },

  // 🔥 핵심 수정: 회원가입 함수 - 자동 로그인 방지
  async signUp(userData) {
    try {
      console.log('회원가입 시도:', userData)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            nickname: userData.nickname,
            // 추가 메타데이터
            signup_method: 'email'
          }
        }
      })

      if (authError) {
        console.error('Supabase 회원가입 오류:', authError)
        return {
          success: false,
          error: authError.message
        }
      }

      console.log('회원가입 응답:', authData)

      // 사용자가 생성되었는지 확인
      if (!authData.user) {
        console.error('사용자 객체가 없습니다')
        return {
          success: false,
          error: '사용자 생성에 실패했습니다'
        }
      }

      // 🚨 핵심: 회원가입 성공 후 즉시 로그아웃하여 자동 로그인 방지
      if (authData.user) {
        console.log('회원가입 성공, 자동 로그인 방지를 위해 로그아웃 실행')
        await supabase.auth.signOut()

        // localStorage도 확실히 정리
        localStorage.removeItem('user')
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('sb-gjuwbcfuadlwvxrxbgui-auth-token')

        console.log('자동 로그아웃 완료')
      }

      console.log('회원가입 성공:', {
        userId: authData.user.id,
        email: authData.user.email,
        emailConfirmed: authData.user.email_confirmed_at
      })

      return {
        success: true,
        user: null, // 🚨 중요: user 정보를 null로 설정하여 자동 로그인 방지
        session: null, // 🚨 중요: session도 null로 설정
        message: '회원가입이 완료되었습니다. 로그인 페이지에서 다시 로그인해주세요.'
      }
    } catch (error) {
      console.error('회원가입 예외:', error)
      return {
        success: false,
        error: `회원가입 중 오류가 발생했습니다: ${error.message}`
      }
    }
  },

  // 기존 로그인
  async signIn(email, password, rememberMe = false) {
    try {
      console.log('로그인 시도:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password
      })

      if (error) {
        console.error('Supabase 로그인 오류:', error.message)
        return {
          success: false,
          error: error.message,
          data: null
        }
      }

      if (!data.user) {
        console.error('사용자 정보 없음')
        return {
          success: false,
          error: '사용자 정보를 가져올 수 없습니다.',
          data: null
        }
      }

      // Remember me 기능
      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true')
        localStorage.setItem('userEmail', email)
      } else {
        localStorage.removeItem('rememberUser')
        localStorage.removeItem('userEmail')
      }

      console.log('로그인 성공:', data.user.email)
      return {
        success: true,
        error: null,
        data: {
          auth: data,
          user: {
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'User',
            nickname: data.user.user_metadata?.nickname || '',
            id: data.user.id,
            provider: data.user.app_metadata?.provider || 'email'
          }
        }
      }
    } catch (error) {
      console.error('로그인 예외:', error)
      return {
        success: false,
        error: `로그인 중 오류가 발생했습니다: ${error.message}`,
        data: null
      }
    }
  },

  // 소셜 로그인 - GitHub
  async signInWithGitHub() {
    try {
      console.log('GitHub 로그인 시도')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'user:email'
        }
      })

      if (error) {
        console.error('GitHub 로그인 오류:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('GitHub 로그인 리디렉션 시작')
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('GitHub 로그인 예외:', error)
      return {
        success: false,
        error: `GitHub 로그인 중 오류가 발생했습니다: ${error.message}`
      }
    }
  },

  // 소셜 로그인 - Google
  async signInWithGoogle() {
    try {
      console.log('Google 로그인 시도')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile'
        }
      })

      if (error) {
        console.error('Google 로그인 오류:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('Google 로그인 리디렉션 시작')
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('Google 로그인 예외:', error)
      return {
        success: false,
        error: `Google 로그인 중 오류가 발생했습니다: ${error.message}`
      }
    }
  },

  // 비밀번호 재설정 요청
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        console.error('비밀번호 재설정 요청 오류:', error)
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.'
      }
    } catch (error) {
      console.error('비밀번호 재설정 예외:', error)
      return {
        success: false,
        error: `비밀번호 재설정 요청 중 오류가 발생했습니다: ${error.message}`
      }
    }
  },

  // 비밀번호 업데이트
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error('비밀번호 업데이트 오류:', error)
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
      }
    } catch (error) {
      console.error('비밀번호 업데이트 예외:', error)
      return {
        success: false,
        error: `비밀번호 변경 중 오류가 발생했습니다: ${error.message}`
      }
    }
  },

  // 현재 세션 가져오기
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('세션 가져오기 오류:', error)
        return null
      }

      return session
    } catch (error) {
      console.error('세션 가져오기 예외:', error)
      return null
    }
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.error('사용자 정보 가져오기 오류:', error)
        return null
      }

      return user
    } catch (error) {
      console.error('사용자 정보 가져오기 예외:', error)
      return null
    }
  },

  // 로그아웃
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Remember me 정보도 제거
      localStorage.removeItem('rememberUser')
      localStorage.removeItem('userEmail')

      return { success: true }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      return { success: false, error: error.message }
    }
  },

  // 인증 상태 변화 리스너
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Remember me 체크
  shouldRememberUser() {
    return localStorage.getItem('rememberUser') === 'true'
  },

  // 저장된 이메일 가져오기
  getRememberedEmail() {
    return localStorage.getItem('userEmail') || ''
  }
}

// 디버깅을 위한 함수들
export const debugAPI = {
  // auth.users 테이블 확인 (관리자만 가능)
  async checkAuthUsers() {
    try {
      // 이 쿼리는 보안상 실패할 수 있습니다
      const { data, error } = await supabase
        .from('auth.users')
        .select('*')
        .limit(5)

      console.log('auth.users 데이터:', data)
      if (error) console.error('auth.users 쿼리 오류:', error)

      return data
    } catch (error) {
      console.error('auth.users 확인 실패:', error)
      return null
    }
  },

  // 현재 세션 디버깅
  async debugSession() {
    const session = await authAPI.getSession()
    const user = await authAPI.getCurrentUser()

    console.log('=== 세션 디버깅 ===')
    console.log('Session:', session)
    console.log('User:', user)
    console.log('==================')

    return { session, user }
  }
}