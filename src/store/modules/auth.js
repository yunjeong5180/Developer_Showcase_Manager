// 인증 관련 Vuex 모듈
import { supabase } from "@/shared/services";

const state = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const getters = {
  currentUser: (state) => state.user,
  userProfile: (state) => state.profile,
  isAuthenticated: (state) => state.isAuthenticated,
  isLoading: (state) => state.loading,
  authLoading: (state) => state.loading,
  authError: (state) => state.error,
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    state.isAuthenticated = !!user;
  },
  SET_USER_PROFILE(state, profile) {
    state.profile = profile;
  },
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_AUTH(state) {
    state.user = null;
    state.profile = null;
    state.isAuthenticated = false;
    state.error = null;
  },
};

const actions = {
  async initAuth({ commit, dispatch }) {
    commit("SET_LOADING", true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        commit("SET_USER", user);
        // 프로필 정보 가져오기
        await dispatch("loadUserProfile");
      }
    } catch (error) {
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async loadUserProfile({ commit, state }) {
    if (!state.user) {
      console.log("사용자 정보 없음, 프로필 로드 중단");
      return;
    }

    console.log("프로필 로드 시작:", state.user.id);

    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", state.user.id)
        .single();

      if (error) {
        console.error("프로필 조회 에러:", error);
        // 프로필이 없는 경우 기본 프로필 생성
        if (error.code === "PGRST116") {
          console.log("프로필 없음, 기본 프로필 생성 시도");
          const { data: newProfile, error: createError } = await supabase
            .from("users")
            .insert([
              {
                auth_user_id: state.user.id,
                email: state.user.email,
                name:
                  state.user.user_metadata?.name ||
                  state.user.email.split("@")[0],
                nickname:
                  state.user.user_metadata?.nickname ||
                  state.user.email.split("@")[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("프로필 생성 실패:", createError);
          } else if (newProfile) {
            console.log("프로필 생성 성공:", newProfile);
            commit("SET_PROFILE", newProfile);
          }
        }
      } else if (profile) {
        console.log("프로필 로드 성공:", profile);
        commit("SET_PROFILE", profile);
      }
    } catch (error) {
      console.error("프로필 로드 예외:", error);
    }
  },

  async signIn({ commit, dispatch }, { email, password }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      commit("SET_USER", data.user);
      // 로그인 성공 후 프로필 로드
      await dispatch("loadUserProfile");
      return { success: true };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return { success: false, error: error.message };
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async signOut({ commit }) {
    commit("SET_LOADING", true);
    try {
      // Supabase 로그아웃
      await supabase.auth.signOut();

      // 완전한 세션 클리어
      // 1. Supabase 관련 localStorage 키 강제 삭제
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.includes("supabase") ||
            key.includes("auth") ||
            key.includes("sb-"))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // 2. 기타 인증 관련 데이터 클리어
      localStorage.removeItem("user");
      localStorage.removeItem("rememberUser");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("recentSignups");

      // 3. 세션 스토리지 클리어
      sessionStorage.clear();

      // 4. 쿠키 클리어 (가능한 범위)
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name.includes("sb") || name.includes("auth")) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      });

      commit("CLEAR_AUTH");
    } catch (error) {
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async updateProfile({ commit }, profileData) {
    commit("SET_LOADING", true);
    try {
      const { data, error } = await supabase
        .from("users")
        .update(profileData)
        .eq("id", state.profile.id)
        .select()
        .single();

      if (error) throw error;
      commit("SET_PROFILE", data);
      return { success: true, data };
    } catch (error) {
      commit("SET_ERROR", error.message);
      return { success: false, error: error.message };
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async clearAuth({ commit }) {
    commit("SET_USER", null);
    commit("SET_PROFILE", null);
  },

  setError({ commit }, error) {
    commit("SET_ERROR", error);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
