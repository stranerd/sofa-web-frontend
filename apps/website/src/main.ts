import { createApp } from 'vue/dist/vue.esm-bundler.js'
import App from './App.vue'
import NativeApp from './NativeApp.vue'
import { createRouter, createWebHistory, useRoute, useRouter } from 'vue-router'
import {
  createRouter as IonicCreateRouter,
  createWebHistory as IonicCreateWebHistory,
} from '@ionic/vue-router'
import { getPlatforms, IonicVue } from '@ionic/vue'
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app'
import routes from './router/routes'
import { createMetaManager } from 'vue-meta'
import { Logic } from 'sofa-logic'
import { SetFrontendLogic } from 'sofa-ui-components'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

import DashboardLayout from './layouts/Dashboard.vue'
import ExpandedLayout from './layouts/Expanded.vue'
import SubPageLayout from './layouts/SubPage.vue'
import AuthLayout from './layouts/Auth.vue'
import GlobalLayout from './layouts/GlobalLayout.vue'

import VueAppleLogin from 'vue-apple-login'
import vue3GoogleLogin from 'vue3-google-login'

// UI component css style
import 'sofa-ui-components/dist/library.min.css'

// You can disable this if you dont want TailwindCss
import './assets/app.css'

import { store, key } from './store'
import { AuthClientIDs } from './common/constants'
import { onMounted } from 'vue'

const router = Promise.all(routes).then((routes) => {
  if (process.env.VUE_APP_IS_NATIVE) {
    const router = IonicCreateRouter({
      history: IonicCreateWebHistory(),
      routes,
    })

    router.beforeEach((to, from, next) => {
      const toRouter: any = to
      const fromRouter: any = from
      Logic.Common.preFetchRouteData(toRouter, next, fromRouter).then(() => {
        return
      })
    })

    return router
  } else {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    })

    router.beforeEach((to, from, next) => {
      const toRouter: any = to
      const fromRouter: any = from
      Logic.Common.preFetchRouteData(toRouter, next, fromRouter).then(() => {
        return
      })
    })

    return router
  }
})

const init = async () => {
  createApp({
    components: {
      App,
      NativeApp,
    },
    setup() {
      const router: any = useRouter()
      const route: any = useRoute()
      Logic.Common.SetRouter(router)
      Logic.Common.SetRoute(route)
      Logic.Common.SetApiUrl(process.env.VUE_APP_API_URL || '')

      // set ui frontend logic
      SetFrontendLogic(Logic)

      const autoSetup = () => {
        const AuthUser = localStorage.getItem('auth_user')
          ? JSON.parse(localStorage.getItem('auth_user') || '{}')
          : undefined

        if (!window.location.href.includes('/auth/login')) {
          if (AuthUser == undefined) {
            Logic.Common.GoToRoute('/auth/login')
          } else {
            // fetch auth user in background
            Logic.Auth.GetAuthUser()
            Logic.Users.GetUserProfile()

            Logic.Auth.DetectVerification()
          }
        }
      }

      // initiate websocket
      onMounted(() => {
        Logic.Common.setupWebsocket()

        if (process.env.VUE_APP_IS_NATIVE == 'true') {
          Logic.Common.isNativeApp = true
          // deep link config
          CapacitorApp.addListener('appUrlOpen', function (
            event: URLOpenListenerEvent,
          ) {
            // Example url: https://beerswift.app/tabs/tabs2
            // slug = /tabs/tabs2
            const domainType = '.com'
            const slug = event.url.split(domainType).pop()

            // We only push to the route if there is a slug present
            if (slug) {
              if (getPlatforms()[0] == 'android') {
                window.location.href = `https://localhost${slug}`
                return
              }
              Logic.Common.GoToRoute(slug)
              return
            }
          })

          CapacitorApp.addListener('appStateChange', (state) => {
            if (state.isActive) {
              autoSetup()
            } else {
              //
            }
          })
        }

        autoSetup()
      })
    },
  })
    .component('dashboard-layout', DashboardLayout)
    .component('expanded-layout', ExpandedLayout)
    .component('sub-page-layout', SubPageLayout)
    .component('auth-layout', AuthLayout)
    .component('global-layout', GlobalLayout)
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
    .use(IonicVue, {
      rippleEffect: false,
      scrollPadding: false,
    })
    .mount('#app')
}

init()
