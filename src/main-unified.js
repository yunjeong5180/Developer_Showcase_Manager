import Vue from 'vue'
import App from './App-unified.vue'
import router from './router/index-unified'
import store from './store/index-unified'
import vuetify from './plugins/vuetify'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'
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
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

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
)

// Register FontAwesome component globally
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Vue configuration
Vue.config.productionTip = false

// Create Vue instance
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')