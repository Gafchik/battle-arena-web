const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/MenuPage.vue') },
      { path: 'training', component: () => import('@/pages/TrainingPage.vue') },
      { path: 'challenge', component: () => import('@/pages/ChallengePage.vue') },
      { path: 'join/:id', component: () => import('@/pages/JoinBattlePage.vue'), props: true },
      { path: 'pvp/:id', component: () => import('@/pages/PvpBattlePage.vue'), props: true },
      { path: 'history', component: () => import('@/pages/HistoryPage.vue') },
      { path: 'history/:id', component: () => import('@/pages/HistoryDetailPage.vue'), props: true },
      { path: 'rules', component: () => import('@/pages/RulesPage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
