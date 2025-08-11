// 프로젝트 관련 Vuex 모듈
import { projectService } from '@/shared/services'

const state = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    techStack: [],
    sortBy: 'created_at',
    sortOrder: 'desc'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
}

const getters = {
  allProjects: state => state.projects,
  currentProject: state => state.currentProject,
  projectsLoading: state => state.loading,
  projectsError: state => state.error,
  activeFilters: state => state.filters,
  pagination: state => state.pagination,
  filteredProjects: state => {
    let filtered = [...state.projects]
    
    // 검색 필터
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      )
    }
    
    // 기술 스택 필터
    if (state.filters.techStack.length > 0) {
      filtered = filtered.filter(p => 
        state.filters.techStack.some(tech => 
          p.tech_stack?.includes(tech)
        )
      )
    }
    
    return filtered
  }
}

const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  SET_CURRENT_PROJECT(state, project) {
    state.currentProject = project
  },
  ADD_PROJECT(state, project) {
    state.projects.unshift(project)
  },
  UPDATE_PROJECT(state, updatedProject) {
    const index = state.projects.findIndex(p => p.id === updatedProject.id)
    if (index !== -1) {
      state.projects[index] = updatedProject
    }
  },
  DELETE_PROJECT(state, projectId) {
    state.projects = state.projects.filter(p => p.id !== projectId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  }
}

const actions = {
  async fetchProjects({ commit, state }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const result = await projectService.getProjects({
        ...state.filters,
        page: state.pagination.page,
        limit: state.pagination.limit
      })
      
      if (result.success) {
        commit('SET_PROJECTS', result.data.projects)
        commit('SET_PAGINATION', {
          total: result.data.total
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchProject({ commit }, projectId) {
    commit('SET_LOADING', true)
    try {
      const result = await projectService.getProject(projectId)
      if (result.success) {
        commit('SET_CURRENT_PROJECT', result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createProject({ commit }, projectData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const result = await projectService.createProject(projectData)
      if (result.success) {
        commit('ADD_PROJECT', result.data)
        return { success: true, data: result.data }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateProject({ commit }, { projectId, data }) {
    commit('SET_LOADING', true)
    try {
      const result = await projectService.updateProject(projectId, data)
      if (result.success) {
        commit('UPDATE_PROJECT', result.data)
        return { success: true, data: result.data }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async deleteProject({ commit }, projectId) {
    commit('SET_LOADING', true)
    try {
      const result = await projectService.deleteProject(projectId)
      if (result.success) {
        commit('DELETE_PROJECT', projectId)
        return { success: true }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      return { success: false, error: error.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  setFilters({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters)
    commit('SET_PAGINATION', { page: 1 }) // 필터 변경시 첫 페이지로
    dispatch('fetchProjects')
  },
  
  setPage({ commit, dispatch }, page) {
    commit('SET_PAGINATION', { page })
    dispatch('fetchProjects')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}