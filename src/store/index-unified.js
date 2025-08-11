import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import projects from './modules/projects'

Vue.use(Vuex)

// 통합 Vuex 스토어
export default new Vuex.Store({
  modules: {
    auth,
    projects
  },
  
  // 전역 상태
  state: {
    appLoading: false,
    appError: null,
    notification: {
      show: false,
      type: 'info', // info, success, warning, error
      message: ''
    }
  },
  
  // 전역 getters
  getters: {
    isAppLoading: state => state.appLoading,
    appError: state => state.appError,
    notification: state => state.notification
  },
  
  // 전역 mutations
  mutations: {
    SET_APP_LOADING(state, loading) {
      state.appLoading = loading
    },
    SET_APP_ERROR(state, error) {
      state.appError = error
    },
    SHOW_NOTIFICATION(state, { type = 'info', message }) {
      state.notification = {
        show: true,
        type,
        message
      }
    },
    HIDE_NOTIFICATION(state) {
      state.notification.show = false
    }
  },
  
  // 전역 actions
  actions: {
    showNotification({ commit }, payload) {
      commit('SHOW_NOTIFICATION', payload)
      // 3초 후 자동으로 숨기기
      setTimeout(() => {
        commit('HIDE_NOTIFICATION')
      }, 3000)
    },
    
    showSuccess({ dispatch }, message) {
      dispatch('showNotification', { type: 'success', message })
    },
    
    showError({ dispatch }, message) {
      dispatch('showNotification', { type: 'error', message })
    },
    
    showWarning({ dispatch }, message) {
      dispatch('showNotification', { type: 'warning', message })
    },
    
    showInfo({ dispatch }, message) {
      dispatch('showNotification', { type: 'info', message })
    }
  }
})