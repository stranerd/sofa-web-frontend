import { createHead } from '@unhead/vue'
import { createApp } from 'vue'

import { $screen, $utils } from '@utils/modules'

import App from '@app/App.vue'
import '@app/assets/styles/index.scss'

import { devtools } from '@app/composables/core/store'
import { globalPlugins } from '@app/plugins'
import { router } from '@app/router'

const init = async () => {
	const app = createApp(App)
	app.config.globalProperties.$utils = $utils
	app.config.globalProperties.$screen = $screen

	for (const plugin of globalPlugins) await plugin({ app, router }).catch()

	const head = createHead()

	app.use(router).use(head).use(devtools).mount('#app')

	await router.isReady().catch()
}

init()
