/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuth } from '@/stores/auth';


const enhancedRoutes = routes.map((route) => {
  if (route.path === '/Cadastrar') {
    return { ...route, meta: { auth: true } }; // Outras rotas requerem autenticação
  } else if (route.path === '/Pensamento') {
    return { ...route, meta: { auth: true } }; // Outras rotas requerem autenticação
  } else {
    return { ...route, meta: { auth: false } };
  }
});


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(enhancedRoutes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})


router.beforeEach((to, from, next) => {
  const auth = useAuth();
  //console.log('auth.isAuth', auth.isAuth)
  if (to.meta.auth && !auth.isAuth) {
    // Se a rota requer autenticação e o usuário não está autenticado, redirecione para login
    next({ path: '/Login' });
  } else {
    next(); // Caso contrário, prossiga
  }
});

export default router
