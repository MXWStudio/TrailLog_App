import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/explore'
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/Explore/ExplorePage.vue')
    },
    {
      path: '/navigate',
      name: 'navigate',
      component: () => import('../views/Navigate/NavigatePage.vue')
    },
    {
      path: '/saved',
      name: 'saved',
      component: () => import('../views/Saved/SavedPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile/ProfilePage.vue')
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/Community/CommunityPage.vue')
    },
    {
      path: '/trail/:id',
      name: 'trail-detail',
      component: () => import('../views/Explore/TrailDetailPage.vue')
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('../views/Community/PublishPage.vue')
    }
  ]
})

export default router 