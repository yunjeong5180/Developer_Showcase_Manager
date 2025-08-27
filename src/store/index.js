import { createStore } from "vuex";

// Vuex 모듈들
import auth from "./modules/auth";
import projects from "./modules/projects";
import portfolio from "./modules/portfolio";
import loading from "./modules/loading";

export default createStore({
  state: {
    notification: {
      show: false,
      message: "",
      type: "info", // success, error, warning, info
    },
  },
  getters: {
    notification: (state) => state.notification,
  },
  mutations: {
    SHOW_NOTIFICATION(state, { message, type = "info" }) {
      state.notification = {
        show: true,
        message,
        type,
      };

      // 3초 후 자동으로 숨기기
      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    },
    HIDE_NOTIFICATION(state) {
      state.notification.show = false;
    },
  },
  actions: {
    showNotification({ commit }, payload) {
      commit("SHOW_NOTIFICATION", payload);
    },
    hideNotification({ commit }) {
      commit("HIDE_NOTIFICATION");
    },
  },
  modules: {
    auth,
    projects,
    portfolio,
    loading,
  },
});
