import { createApp } from 'vue/dist/vue.esm-bundler.js'
import App from './App.vue'
import { createRouter, createWebHistory, useRoute, useRouter } from 'vue-router'
import routes from './router/routes'
import { createMetaManager } from 'vue-meta'
import { Logic } from 'sofa-logic'
import { SetFrontendLogic } from 'sofa-ui-components'

import DashboardLayout from './layouts/Dashboard.vue'
import ExpandedLayout from './layouts/Expanded.vue'
import SubPageLayout from './layouts/SubPage.vue'
import AuthLayout from './layouts/Auth.vue'

import VueAppleLogin from 'vue-apple-login'
import vue3GoogleLogin from 'vue3-google-login'

// UI component css style
import 'sofa-ui-components/dist/library.min.css'

// You can disable this if you dont want TailwindCss
import './assets/app.css'

import { store, key } from './store'
import { AuthClientIDs } from './common/constants'

const router = Promise.all(routes).then((routes) => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  router.beforeEach((to, from, next) => {
    const toRouter: any = to
    const fromRouter: any = from
    return Logic.Common.preFetchRouteData(toRouter, next, fromRouter)
  })

  return router
})

const init = async () => {
  createApp({
    components: {
      App,
    },
    setup() {
      const router: any = useRouter()
      const route: any = useRoute()
      Logic.Common.SetRouter(router)
      Logic.Common.SetRoute(route)
      Logic.Common.SetApiUrl(process.env.VUE_APP_API_URL || '')

      // set ui frontend logic
      SetFrontendLogic(Logic)

      const AuthUser = localStorage.getItem('auth_user')
        ? JSON.parse(localStorage.getItem('auth_user') || '{}')
        : undefined

      if (!window.location.href.includes('/auth')) {
        if (AuthUser == undefined) {
          if (!window.location.href.includes('/auth/reset-password')) {
            Logic.Common.GoToRoute('/auth/login')
          }
        } else {
          // fetch auth user in background
          Logic.Auth.GetAuthUser()
          Logic.Users.GetUserProfile()
        }
      }
    },
  })
    .component('dashboard-layout', DashboardLayout)
    .component('expanded-layout', ExpandedLayout)
    .component('sub-page-layout', SubPageLayout)
    .component('auth-layout', AuthLayout)
    .use(await router)
    .use(store, key)
    .use(VueAppleLogin, {
      clientId: 'com.stranerd.dev',
      scope: 'name email',
      redirectURI: 'https://dev.stranerd.com',
      state: new Date().getTime().toString(),
      usePopup: true,
    })
    .use(vue3GoogleLogin, {
      clientId: AuthClientIDs.google_client_ids.web,
    })
    .use(createMetaManager())
    .mount('#app')
}

init()
