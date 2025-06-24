// Supabase 프로젝트 설정
const supabaseUrl = 'https://gjuwbcfuadlwvxrxbgui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdXdiY2Z1YWRsd3Z4cnhiZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDUxMzYsImV4cCI6MjA2NjIyMTEzNn0.VxjQtPM47TSijZbXK4htyoVavODwOa7gdyrSwLc1-7s'

// Supabase 클라이언트 생성 (싱글톤 패턴)
import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    })
  }
  return supabaseInstance
}

export const supabase = getSupabaseClient()

// 사용자 관련 API 함수들
export const authAPI = {
  // 이메일 중복 체크
  async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (error && error.code === 'PGRST116') {
        // 데이터가 없음 (중복 아님)
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

  // 회원가입 (이메일 확인 우회 버전)
  async signUp(userData) {
    try {
      console.log('회원가입 시도:', userData.email)

      // 1. Supabase Auth로 인증 계정 생성
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        options: {
          data: {
            name: userData.name
          },
          // 이메일 확인 우회
          emailRedirectTo: undefined
        }
      })

      if (authError) {
        console.error('회원가입 오류:', authError.message)
        return {
          success: false,
          error: `회원가입 실패: ${authError.message}`
        }
      }

      // 2. 회원가입 직후 이메일 확인 상태 업데이트
      if (authData.user && !authData.user.email_confirmed_at) {
        try {
          // SQL 함수 대신 직접 쿼리 실행
          const { error: updateError } = await supabase
            .from('auth.users')
            .update({ email_confirmed_at: new Date().toISOString() })
            .eq('id', authData.user.id)

          if (updateError) {
            console.warn('이메일 확인 업데이트 실패:', updateError)
          }
        } catch (updateError) {
          console.warn('이메일 확인 업데이트 실패, 무시:', updateError)
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

  // 로그인 (응답 형식 통일)
  async signIn(email, password) {
    try {
      console.log('로그인 시도:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password
      })

      // 디버깅용 로그
      console.log('Supabase 응답:', { data, error })

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

      console.log('로그인 성공:', data.user.email)
      return {
        success: true,
        error: null,
        data: {
          auth: data,
          user: {
            email: data.user.email,
            name: data.user.user_metadata?.name || 'User',
            id: data.user.id
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

  // 로그아웃
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      return { success: false, error: error.message }
    }
  }
}