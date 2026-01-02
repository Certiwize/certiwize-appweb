import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import ProjectCreate from '../views/dashboard/ProjetCreate.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/features', component: () => import('../views/Features.vue') },
  { path: '/contact', component: () => import('../views/Contact.vue') },
  { path: '/faq', component: () => import('../views/FAQ.vue') },
  { path: '/login', component: Login },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/forgot-password', component: () => import('../views/ForgotPassword.vue') },
  {
    path: '/update-password',
    component: () => import('../views/UpdatePassword.vue')
  },
  {
    path: '/settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('../views/dashboard/DashboardHome.vue')
      },
      {
        path: 'tiers',
        name: 'dashboard-tiers',
        component: () => import('../views/dashboard/Tiers.vue')
      },
      {
        path: 'tiers/create',
        name: 'dashboard-tiers-create',
        component: () => import('../views/dashboard/TiersCreate.vue')
      },
      {
        path: 'tiers/edit/:id',
        name: 'dashboard-tiers-edit',
        component: () => import('../views/dashboard/TiersCreate.vue')
      },
      {
        path: 'catalogue',
        name: 'dashboard-catalogue',
        component: () => import('../views/dashboard/Catalogue.vue')
      },
      {
        path: 'projets',
        name: 'dashboard-projets',
        component: () => import('../views/dashboard/Projet.vue')
      },
      {
        path: 'manuel-qualiopi', 
        component: () => import('../views/dashboard/ManuelQualiopi.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/generate-convention',
    component: () => import('../views/GenerateConvention.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/projets/create',
    component: () => import('../views/dashboard/ProjetCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/projets/edit/:id',
    component: () => import('../views/dashboard/ProjetCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/catalogue/create',
    component: () => import('../views/dashboard/TrainingCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/catalogue/edit/:id',
    component: () => import('../views/dashboard/TrainingCreate.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Attendre que l'authentification soit initialisée avant de vérifier
  if (!authStore.initialized && to.meta.requiresAuth) {
    // Attendre max 2 secondes que l'auth soit initialisée
    const maxWait = 2000;
    const startTime = Date.now();
    while (!authStore.initialized && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;