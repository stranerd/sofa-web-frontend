import { useAuth } from '@app/composables/auth/auth'
import { setEmailVerificationEmail } from '@app/composables/auth/signin'
import { AfterAuthUser, AuthUseCases } from '@modules/auth'
import { Logic } from 'sofa-logic'
import { useRoute, useRouter } from 'vue-router'

export const createSession = async (afterAuth: AfterAuthUser) => {
	await AuthUseCases.sessionSignin(afterAuth)

	if (!afterAuth.user.isEmailVerified) {
		setEmailVerificationEmail(afterAuth.user.email)
		return await Logic.Common.GoToRoute('/auth/verify')
	}

	const { setAuthUser, signin } = useAuth()
	await setAuthUser(afterAuth.user)
	const successful = await signin(false)
	if (successful) await Logic.Common.GoToRoute(await Logic.Common.getRedirectToRoute())
}

export const useRedirectToAuth = () => {
	const route = useRoute()
	const router = useRouter()

	const redirect = async () => {
		await Logic.Common.setRedirectToRoute(route.fullPath)
		if (router) await router.push('/auth/login')
	}

	return { redirect }
}
