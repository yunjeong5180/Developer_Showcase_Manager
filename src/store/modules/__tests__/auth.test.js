import { describe, it, expect, beforeEach, vi } from 'vitest'
import auth from '../auth'

describe('Auth Store Module', () => {
  let state

  beforeEach(() => {
    // 각 테스트 전에 상태 초기화
    state = {
      user: null,
      profile: null,
      isAuthenticated: false,
      loading: false,
      error: null
    }
  })

  describe('Mutations', () => {
    it('SET_USER mutation이 사용자를 올바르게 설정하는지 확인', () => {
      const user = { id: '123', email: 'test@example.com' }
      auth.mutations.SET_USER(state, user)
      
      expect(state.user).toEqual(user)
      expect(state.isAuthenticated).toBe(true)
    })

    it('SET_USER mutation에 null을 전달하면 로그아웃 상태가 되는지 확인', () => {
      state.user = { id: '123', email: 'test@example.com' }
      state.isAuthenticated = true
      
      auth.mutations.SET_USER(state, null)
      
      expect(state.user).toBe(null)
      expect(state.isAuthenticated).toBe(false)
    })

    it('SET_USER_PROFILE mutation이 프로필을 올바르게 설정하는지 확인', () => {
      const profile = { 
        name: 'John Doe', 
        bio: 'Developer',
        skills: ['Vue', 'React']
      }
      auth.mutations.SET_USER_PROFILE(state, profile)
      
      expect(state.profile).toEqual(profile)
    })

    it('SET_LOADING mutation이 로딩 상태를 올바르게 설정하는지 확인', () => {
      auth.mutations.SET_LOADING(state, true)
      expect(state.loading).toBe(true)
      
      auth.mutations.SET_LOADING(state, false)
      expect(state.loading).toBe(false)
    })

    it('SET_ERROR mutation이 에러를 올바르게 설정하는지 확인', () => {
      const error = '로그인 실패'
      auth.mutations.SET_ERROR(state, error)
      
      expect(state.error).toBe(error)
    })
  })

  describe('Getters', () => {
    it('currentUser getter가 현재 사용자를 반환하는지 확인', () => {
      const user = { id: '123', email: 'test@example.com' }
      state.user = user
      
      const result = auth.getters.currentUser(state)
      expect(result).toEqual(user)
    })

    it('isAuthenticated getter가 인증 상태를 올바르게 반환하는지 확인', () => {
      state.isAuthenticated = false
      expect(auth.getters.isAuthenticated(state)).toBe(false)
      
      state.isAuthenticated = true
      expect(auth.getters.isAuthenticated(state)).toBe(true)
    })

    it('userProfile getter가 사용자 프로필을 반환하는지 확인', () => {
      const profile = { name: 'John Doe' }
      state.profile = profile
      
      const result = auth.getters.userProfile(state)
      expect(result).toEqual(profile)
    })

    it('isLoading getter가 로딩 상태를 반환하는지 확인', () => {
      state.loading = true
      expect(auth.getters.isLoading(state)).toBe(true)
      
      state.loading = false
      expect(auth.getters.isLoading(state)).toBe(false)
    })
  })

  describe('Actions', () => {
    it('clearAuth action이 인증 정보를 초기화하는지 확인', async () => {
      const commit = vi.fn()
      
      await auth.actions.clearAuth({ commit })
      
      expect(commit).toHaveBeenCalledWith('SET_USER', null)
      expect(commit).toHaveBeenCalledWith('SET_PROFILE', null)
    })

    it('setError action이 에러를 설정하는지 확인', () => {
      const commit = vi.fn()
      const error = '테스트 에러'
      
      auth.actions.setError({ commit }, error)
      
      expect(commit).toHaveBeenCalledWith('SET_ERROR', error)
    })
  })
})