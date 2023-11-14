import { Logic } from 'sofa-logic'
import { SetFrontendLogic } from 'sofa-ui-components'
import { createMetaManager } from 'vue-meta'
import { createApp } from 'vue'
import App from './App.vue'

import VueAppleLogin from 'vue-apple-login'
import vue3GoogleLogin from 'vue3-google-login'

// UI component css style
import 'sofa-ui-components/dist/library.min.css'

// You can disable this if you dont want TailwindCss
import './assets/app.css'

import { AuthClientIDs } from './common/constants'
import { routerPromise } from './router'
import { globalPlugins } from './plugins'

const init = async () => {
  const router = await routerPromise

  Logic.Common.SetApiUrl(process.env.VUE_APP_API_URL || '')

  // set ui frontend logic
  SetFrontendLogic(Logic)

  // initiate websocket
  await Logic.Common.setupWebsocket()

  const app = createApp(App)

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

  app.use(router)
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

	await router.isReady().catch()
}

init()
