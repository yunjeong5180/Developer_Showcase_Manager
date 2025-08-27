import { supabase } from "@/shared/services";

export default {
  namespaced: true,

  state: {
    portfolioData: null,
    isLoading: false,
    error: null,
  },

  getters: {
    portfolioData: (state) => state.portfolioData,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
  },

  mutations: {
    SET_PORTFOLIO_DATA(state, data) {
      state.portfolioData = data;
    },
    SET_LOADING(state, loading) {
      state.isLoading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    async fetchPortfolio({ commit }, userId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        // 사용자 프로필 가져오기
        const { data: userProfile, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        // 사용자의 프로젝트 가져오기
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;

        const portfolioData = {
          ...userProfile,
          projects: projects || [],
        };

        commit("SET_PORTFOLIO_DATA", portfolioData);
        return { success: true, data: portfolioData };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return { success: false, error: error.message };
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updatePortfolio({ commit }, { userId, updates }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const { data, error } = await supabase
          .from("users")
          .update(updates)
          .eq("id", userId)
          .select()
          .single();

        if (error) throw error;

        commit("SET_PORTFOLIO_DATA", data);
        return { success: true, data };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return { success: false, error: error.message };
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createProject({ commit, state }, projectData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const { data, error } = await supabase
          .from("projects")
          .insert([projectData])
          .select()
          .single();

        if (error) throw error;

        // 현재 포트폴리오 데이터에 새 프로젝트 추가
        const updatedPortfolio = {
          ...state.portfolioData,
          projects: [data, ...(state.portfolioData?.projects || [])],
        };

        commit("SET_PORTFOLIO_DATA", updatedPortfolio);
        return { success: true, data };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return { success: false, error: error.message };
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateProject({ commit, state }, { projectId, updates }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const { data, error } = await supabase
          .from("projects")
          .update(updates)
          .eq("id", projectId)
          .select()
          .single();

        if (error) throw error;

        // 현재 포트폴리오의 프로젝트 업데이트
        const updatedProjects =
          state.portfolioData?.projects?.map((p) =>
            p.id === projectId ? data : p
          ) || [];

        const updatedPortfolio = {
          ...state.portfolioData,
          projects: updatedProjects,
        };

        commit("SET_PORTFOLIO_DATA", updatedPortfolio);
        return { success: true, data };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return { success: false, error: error.message };
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteProject({ commit, state }, projectId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("id", projectId);

        if (error) throw error;

        // 현재 포트폴리오에서 프로젝트 제거
        const updatedProjects =
          state.portfolioData?.projects?.filter((p) => p.id !== projectId) ||
          [];

        const updatedPortfolio = {
          ...state.portfolioData,
          projects: updatedProjects,
        };

        commit("SET_PORTFOLIO_DATA", updatedPortfolio);
        return { success: true };
      } catch (error) {
        commit("SET_ERROR", error.message);
        return { success: false, error: error.message };
      } finally {
        commit("SET_LOADING", false);
      }
    },

    clearPortfolio({ commit }) {
      commit("SET_PORTFOLIO_DATA", null);
      commit("SET_ERROR", null);
    },
  },
};
