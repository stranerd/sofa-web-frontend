import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from '@app/App.vue'

import '@app/assets/styles/index.scss'

import { globalPlugins } from '@app/plugins'
import { routerPromise } from '@app/router'

const init = async () => {
	const router = await routerPromise

	const app = createApp(App)

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

	app.use(router).use(createMetaManager()).mount('#app')

	await router.isReady().catch()
}

init()
