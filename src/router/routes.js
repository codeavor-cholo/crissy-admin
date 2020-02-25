
const routes = [
  {
    path: '/home',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/dashboard', meta: {requiredAuth: true}, name: 'dashboard', component: () => import('pages/dashboard.vue') },
      { path: '/walkin', meta: {requiredAuth: true}, name: 'walkin', component: () => import('pages/walkin.vue') },
      { path: '/foodcategory', meta: {requiredAuth: true}, name: 'foodcategory', component: () => import('pages/foodcategory.vue') },
      { path: '/city', meta: {requiredAuth: true}, name: 'city', component: () => import('pages/city.vue') },
      { path: '/food', meta: {requiredAuth: true}, name: 'food', component: () => import('pages/food.vue') },
      { path: '/services', meta: {requiredAuth: true}, name: 'services', component: () => import('pages/services.vue') },
      { path: '/inclusion', meta: {requiredAuth: true}, name: 'inclusion', component: () => import('pages/inclusion.vue') },
      { path: '/addons', meta: {requiredAuth: true}, name: 'addons', component: () => import('pages/addons.vue') },
      { path: '/motif', meta: {requiredAuth: true}, name: 'motif', component: () => import('pages/motif.vue') },
      { path: '/event', meta: {requiredAuth: true}, name: 'event', component: () => import('pages/event.vue') },
      { path: '/position', meta: {requiredAuth: true}, name: 'position', component: () => import('pages/position.vue') },
      { path: '/packages', meta: {requiredAuth: true}, name: 'packages', component: () => import('pages/packages.vue') },
      { path: '/freebies', meta: {requiredAuth: true}, name: 'freebies', component: () => import('pages/freebies.vue') },
      { path: '/extras', meta: {requiredAuth: true}, name: 'extras', component: () => import('pages/extras.vue') },
    ]
  },
  { path: '/', component: () => import('pages/login.vue') },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
