import { Router, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { setEmailVerificationEmail } from '@app/composables/auth/signin'
import { AfterAuthUser, AuthUseCases } from '@modules/auth'
import { Logic } from 'sofa-logic'

export const createSession = async (afterAuth: AfterAuthUser, router: Router) => {
	await AuthUseCases.sessionSignin(afterAuth)

	if (!afterAuth.user.isEmailVerified) {
		setEmailVerificationEmail(afterAuth.user.email)
		return await router.push('/auth/verify')
	}

	const { setAuthUser, signin } = useAuth()
	await setAuthUser(afterAuth.user)
	const successful = await signin(false)
	if (successful) await router.push(await Logic.Common.getRedirectToRoute())
}

export const useRedirectToAuth = () => {
	const route = useRoute()
	const router = useRouter()
	const { id } = useAuth()

	const runInAuth =
		<T>(fn: () => T | Promise<T>) =>
		async () => {
			if (id) return fn()
			return redirect() as unknown as T
		}

	const redirect = async () => {
		await Logic.Common.setRedirectToRoute(route.fullPath)
		if (router) await router.push('/auth/signin')
	}

	return { redirect, runInAuth }
}
