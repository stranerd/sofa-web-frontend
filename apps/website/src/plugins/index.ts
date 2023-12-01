import { Logic } from 'sofa-logic'
import { App } from 'vue'
import { Router } from 'vue-router'

import { useAuth } from '@/composables/auth/auth'
import AuthLayout from '../layouts/Auth.vue'
import DashboardLayout from '../layouts/Dashboard.vue'
import ExpandedLayout from '../layouts/Expanded.vue'
import SubPageLayout from '../layouts/SubPage.vue'

type PluginFunction = (args: { app: App, router: Router }) => Promise<void>
const definePlugin = (plugin: PluginFunction) => plugin

const registerLayouts = definePlugin(async ({ app }) => {
	app.component('dashboard-layout', DashboardLayout)
		.component('expanded-layout', ExpandedLayout)
		.component('sub-page-layout', SubPageLayout)
		.component('auth-layout', AuthLayout)
})

const cssListeners = definePlugin(async () => {
	const hasNoGapSupport = () => {
		let flex = document.createElement('div')
		flex.style.display = 'flex'
		flex.style.flexDirection = 'column'
		flex.style.rowGap = '1px'
		flex.style.position = 'fixed'
		flex.style.top = '0'
		flex.style.zIndex = '-1000'
		flex.appendChild(document.createElement('div'))
		flex.appendChild(document.createElement('div'))
		flex = document.body.appendChild(flex)
		const hasSupport = flex.scrollHeight === 1
		flex.parentNode?.removeChild(flex)
		return !hasSupport
	}
	setTimeout(() => {
		document.body.setAttribute('data-no-gap', hasNoGapSupport().toString())
	}, 500)
})

const parseLoggedInUser = definePlugin(async ({ router }) => {
	const tokens = await Logic.Auth.GetTokens()
	if (!tokens) {
		await router.push('/auth/login')
		return
	}
	try {
		const user = await Logic.Auth.GetAuthUser().catch(() => null)
		if (!user) return await Logic.Auth.DeleteTokens()

		const { isLoggedIn, isEmailVerified, signin, setAuthUser } = useAuth()
		await setAuthUser(user)
		if (!isEmailVerified.value) await router.push('/auth/verify')
		if (isLoggedIn.value) await signin(true)
	} catch {
		//
	}
})

export const globalPlugins = [parseLoggedInUser, registerLayouts, cssListeners]