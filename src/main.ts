import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from '@app/App.vue'

import '@app/assets/styles/index.scss'

import { globalPlugins } from '@app/plugins'
import { router } from '@app/router'
import { Logic } from 'sofa-logic'

const init = async () => {
	const app = createApp(App)
	app.config.globalProperties.$utils = Logic.Common
	app.config.globalProperties.$screen = Logic.Screen

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

	app.use(router).use(createMetaManager()).mount('#app')

	await router.isReady().catch()
}

init()
