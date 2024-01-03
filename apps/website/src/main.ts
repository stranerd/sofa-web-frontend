import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from './App.vue'

import './assets/styles/index.scss'

import { globalPlugins } from './plugins'
import { routerPromise } from './router'

const init = async () => {
	const router = await routerPromise

	const app = createApp(App)

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

	app.use(router)
		.use(createMetaManager())
		.mount('#app')

	await router.isReady().catch()
}

init()
