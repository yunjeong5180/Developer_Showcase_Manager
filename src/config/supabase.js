import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 설정
const supabaseUrl = 'https://gjuwbcfuadlwvxrxbgui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdXdiY2Z1YWRsd3Z4cnhiZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDUxMzYsImV4cCI6MjA2NjIyMTEzNn0.VxjQtPM47TSijZbXK4htyoVavODwOa7gdyrSwLc1-7s'

// Supabase 클라이언트 생성
let supabaseInstance = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // OAuth 콜백 처리를 위해 true로 변경
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }
  return supabaseInstance
}

export const supabase = getSupabaseClient()

// 인증 관련 API 함수들
export const authAPI = {
  // 기존 이메일 중복 체크
  async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (error && error.code === 'PGRST116') {
        return false
      }

      if (error) {
        throw error
      }

      return data ? true : false
    } catch (error) {
      console.error('이메일 중복 체크 오류:', error)
      return false
    }
  },

  // 기존 회원가입
  async signUp(userData) {
    try {
      console.log('회원가입 시도:', userData.email)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        options: {
          data: {
            name: userData.name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (authError) {
        console.error('회원가입 오류:', authError.message)
        return {
          success: false,
          error: `회원가입 실패: ${authError.message}`
        }
      }

      console.log('회원가입 성공:', authData.user?.email)
      return {
        success: true,
        auth: authData,
        user: {
          email: authData.user?.email,
          name: userData.name,
          id: authData.user?.id
        }
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
            name: data.user.user_metadata?.name || 'User',
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