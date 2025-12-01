import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/features', component: () => import('../views/Features.vue') },
  { path: '/contact', component: () => import('../views/Contact.vue') },
  { path: '/faq', component: () => import('../views/FAQ.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;