import { createHead } from '@unhead/vue'
import { createApp } from 'vue'

import App from './application/App.vue'
import { $screen, $utils } from '@utils/modules'
import './application/assets/styles/index.scss'

import { globalPlugins } from '@app/plugins'
import { router } from '@app/router'

const init = async () => {
	const app = createApp(App)
	app.config.globalProperties.$utils = $utils
	app.config.globalProperties.$screen = $screen

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

	const head = createHead()

	app.use(router).use(head).mount('#app')

	await router.isReady().catch()
}

init()
