import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 전역 스타일 import
import "@/shared/styles/global.scss";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faArrowRight,
  faUser,
  faLock,
  faSignOutAlt,
  faBars,
  faTimes,
  faHome,
  faBriefcase,
  faCode,
  faCertificate,
  faGraduationCap,
  faChartBar,
  faImage,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSave,
  faCalendar,
  faExternalLinkAlt,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to library
library.add(
  faGithub,
  faLinkedin,
  faInstagram,
  faEnvelope,
  faPhone,
  faLocationDot,
  faArrowRight,
  faUser,
  faLock,
  faSignOutAlt,
  faBars,
  faTimes,
  faHome,
  faBriefcase,
  faCode,
  faCertificate,
  faGraduationCap,
  faChartBar,
  faImage,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSave,
  faCalendar,
  faExternalLinkAlt,
  faCheck,
  faSpinner
);

// Vuetify 설정
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#42b883",
          secondary: "#35495e",
        },
      },
    },
  },
});

// Create Vue app
const app = createApp(App);

// Register FontAwesome component globally
app.component("font-awesome-icon", FontAwesomeIcon);

// 글로벌 에러 핸들러 설정
import { setupGlobalErrorHandler } from "@/utils/errorHandler";

// Use plugins
app.use(router);
app.use(store);
app.use(vuetify);

// 에러 핸들러 설정 (store 초기화 후)
setupGlobalErrorHandler(app, store);

// Mount app
app.mount("#app");
