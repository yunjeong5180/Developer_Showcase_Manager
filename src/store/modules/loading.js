const state = {
  isLoading: false,
  loadingText: "",
  loadingQueue: 0,
};

const mutations = {
  SET_LOADING(state, payload) {
    if (typeof payload === "boolean") {
      state.isLoading = payload;
      if (!payload) {
        state.loadingQueue = 0;
        state.loadingText = "";
      }
    } else if (typeof payload === "object") {
      state.isLoading = payload.isLoading;
      state.loadingText = payload.text || "";
    }
  },

  INCREMENT_LOADING(state) {
    state.loadingQueue++;
    state.isLoading = true;
  },

  DECREMENT_LOADING(state) {
    state.loadingQueue = Math.max(0, state.loadingQueue - 1);
    if (state.loadingQueue === 0) {
      state.isLoading = false;
      state.loadingText = "";
    }
  },
};

const actions = {
  showLoading({ commit }, text = "로딩 중...") {
    commit("SET_LOADING", { isLoading: true, text });
  },

  hideLoading({ commit }) {
    commit("SET_LOADING", false);
  },

  startLoading({ commit }) {
    commit("INCREMENT_LOADING");
  },

  stopLoading({ commit }) {
    commit("DECREMENT_LOADING");
  },
};

const getters = {
  isLoading: (state) => state.isLoading,
  loadingText: (state) => state.loadingText,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
