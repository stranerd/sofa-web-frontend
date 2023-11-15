import { Logic } from 'sofa-logic'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from './App.vue'

import VueAppleLogin from 'vue-apple-login'
import vue3GoogleLogin from 'vue3-google-login'

// You can disable this if you dont want TailwindCss
import './assets/app.css'

import { AuthClientIDs, apiUrl, appleDetails } from './common/constants'
import { globalPlugins } from './plugins'
import { routerPromise } from './router'

const init = async () => {
  const router = await routerPromise

  Logic.Common.SetApiUrl(apiUrl)

  const app = createApp(App)

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

  app.use(router)
    .use(VueAppleLogin, appleDetails)
    .use(vue3GoogleLogin, {
      clientId: AuthClientIDs.google_client_ids.web,
    })
    .use(createMetaManager())
    .mount('#app')

	await router.isReady().catch()
}

init()
