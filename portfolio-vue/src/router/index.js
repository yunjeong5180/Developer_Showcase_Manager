import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Projects from '../views/Projects.vue'
import Contact from '../views/Contact.vue'
import PortfolioDemo from '../views/PortfolioDemo.vue'
import PortfolioUser from '../views/PortfolioUser.vue'
import AdminLogin from '../views/AdminLogin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/portfolio/demo',
    name: 'PortfolioDemo',
    component: PortfolioDemo
  },
  {
    path: '/portfolio/:username/:userId',
    name: 'PortfolioUser',
    component: PortfolioUser
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router