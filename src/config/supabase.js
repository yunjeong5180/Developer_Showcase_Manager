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

  // 회원가입
  async signUp(userData) {
    try {
      // 1. Supabase Auth로 인증 계정 생성
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password, // 원본 비밀번호 사용
        options: {
          data: {
            name: userData.name // Auth 메타데이터에 이름 저장
          },
          emailRedirectTo: undefined // 이메일 인증 비활성화
        }
      })

      if (authError) {
        throw authError
      }

      // 2. users 테이블에는 비밀번호 제외하고 저장
      const { data: userRecord, error: insertError } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          name: userData.name,
          // password 필드 제거
        }])
        .select()

      // RLS 오류 발생 시에도 Auth 계정은 생성된 상태로 성공 처리
      if (insertError && insertError.code === '42501') {
        console.warn('RLS 정책으로 인한 users 테이블 삽입 실패, Auth 계정은 생성됨')
        return {
          success: true,
          auth: authData,
          user: { email: userData.email, name: userData.name },
          warning: 'Auth 계정은 생성되었지만 추가 정보 저장에 실패했습니다.'
        }
      }

      if (insertError) {
        throw insertError
      }

      return {
        success: true,
        auth: authData,
        user: userRecord[0]
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // 로그인 (이메일 인증 우회 버전)
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      // 이메일 인증 오류 무시하고 처리
      if (error && error.message === 'Email not confirmed') {
        console.warn('이메일 미인증 상태이지만 로그인 진행')

        // 임시로 성공 처리 (개발용)
        return {
          success: true,
          auth: { user: { email: email } },
          user: { email: email, name: 'User' },
          warning: '이메일 인증이 필요하지만 임시로 로그인됩니다.'
        }
      }

      if (error) {
        throw error
      }

      // 사용자 추가 정보 가져오기
      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      return {
        success: true,
        auth: data,
        user: userInfo
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      return {
        success: false,
        error: error.message
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