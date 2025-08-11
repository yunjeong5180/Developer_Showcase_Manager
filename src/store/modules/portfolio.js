export default {
  namespaced: true,
  
  state: {
    portfolioData: null,
    isLoading: false,
    error: null
  },
  
  getters: {
    portfolioData: state => state.portfolioData,
    isLoading: state => state.isLoading,
    error: state => state.error
  },
  
  mutations: {
    SET_PORTFOLIO_DATA(state, data) {
      state.portfolioData = data
    },
    SET_LOADING(state, loading) {
      state.isLoading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    async fetchPortfolio({ commit }, userId) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // TODO: Implement actual API call
        const mockData = {
          name: 'John Doe',
          title: 'Full Stack Developer',
          bio: 'Passionate developer with expertise in Vue.js and Node.js',
          projects: []
        }
        
        commit('SET_PORTFOLIO_DATA', mockData)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    clearPortfolio({ commit }) {
      commit('SET_PORTFOLIO_DATA', null)
      commit('SET_ERROR', null)
    }
  }
}