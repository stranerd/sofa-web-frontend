import { useAuth } from '@/composables/auth/auth'
import { setEmailVerificationEmail } from '@/composables/auth/signin'
import { AuthUseCases } from '@modules/auth'
import { deleteTokens, getTokens } from '@utils/tokens'
import { App } from 'vue'
import { Router } from 'vue-router'

type PluginFunction = (args: { app: App; router: Router }) => Promise<void>
const definePlugin = (plugin: PluginFunction) => plugin

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
	try {
		const { accessToken, refreshToken } = await getTokens()
		if (!accessToken || !refreshToken) return
		const user = await AuthUseCases.getAuthUser().catch(() => null)
		if (!user) return await deleteTokens()
		if (!user.isEmailVerified) {
			setEmailVerificationEmail(user.email)
			await router.push('/auth/verify')
		} else {
			const { isLoggedIn, signin, setAuthUser } = useAuth()
			await setAuthUser(user)
			if (isLoggedIn.value) await signin(true)
		}
	} catch {
		//
	}
})

export const globalPlugins = [parseLoggedInUser, cssListeners]
