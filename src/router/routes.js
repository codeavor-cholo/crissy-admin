
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
      { path: '/reservation', meta: {requiredAuth: true}, name: 'reservation', component: () => import('pages/reservation.vue') },
      { path: '/createpackage', meta: {requiredAuth: true}, name: 'extras', component: () => import('pages/createPackage.vue') },
      { path: '/theme', meta: {requiredAuth: true}, name: 'theme', component: () => import('pages/theme.vue') },
      { path: '/status', meta: {requiredAuth: true}, name: 'status', component: () => import('pages/status.vue') },
      { path: '/reschedule', meta: {requiredAuth: true}, name: 'reschedule', component: () => import('pages/reschedule.vue') },
      { path: '/users', meta: {requiredAuth: true}, name: 'users', component: () => import('pages/users.vue') },
      { path: '/staffscheduling', meta: {requiredAuth: true}, name: 'staffscheduling', component: () => import('pages/staffScheduling.vue') },
      { path: '/reports', meta: {requiredAuth: true}, name: 'reports', component: () => import('pages/reports.vue') },
      { path: '/bestReports', meta: {requiredAuth: true}, name: 'bestReports', component: () => import('pages/bestReports.vue') },
      { path: '/paymentReports', meta: {requiredAuth: true}, name: 'paymentReports', component: () => import('pages/paymentReports.vue') },
      // { path: '/mobreserve', meta: {requiredAuth: true}, name: 'mobreserve', component: () => import('pages/mobreserve.vue') },
      { path: '/cancel', meta: {requiredAuth: true}, name: 'cancel', component: () => import('pages/cancel.vue') },
      { path: '/mobreserve/:id', meta: {requiredAuth: true}, name: 'mobreserve', component: () => import('pages/mobreserve.vue') },
      { path: '/notifications', meta: {requiredAuth: true}, name: 'notifications', component: () => import('pages/notifications.vue') },
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
