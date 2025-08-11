// 인증 관련 Vuex 모듈
import { supabase } from '@/shared/services'

const state = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const getters = {
  currentUser: state => state.user,
  userProfile: state => state.profile,
  isAuthenticated: state => state.isAuthenticated,
  authLoading: state => state.loading,
  authError: state => state.error
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  SET_PROFILE(state, profile) {
    state.profile = profile
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.profile = null
    state.isAuthenticated = false
    state.error = null
  }
}

const actions = {
  async initAuth({ commit }) {
    commit('SET_LOADING', true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        commit('SET_USER', user)
        // 프로필 정보 가져오기
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()
        if (profile) {
          commit('SET_PROFILE', profile)
        }
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async signIn({ commit }, { email, password }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      commit('SET_USER', data.user)
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async signOut({ commit }) {
    commit('SET_LOADING', true)
    try {
      await supabase.auth.signOut()
      commit('CLEAR_AUTH')
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateProfile({ commit }, profileData) {
    commit('SET_LOADING', true)
    try {
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', state.profile.id)
        .select()
        .single()
      
      if (error) throw error
      commit('SET_PROFILE', data)
      return { success: true, data }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}