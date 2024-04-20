import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from '@app/App.vue'

import '@app/assets/styles/index.scss'

import { globalPlugins } from '@app/plugins'
import { router } from '@app/router'
import { $utils, $screen } from '@utils/modules'

const init = async () => {
	const app = createApp(App)
	app.config.globalProperties.$utils = $utils
	app.config.globalProperties.$screen = $screen

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

	app.use(router).use(createMetaManager()).mount('#app')

	await router.isReady().catch()
}

init()
