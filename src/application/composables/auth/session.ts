import { Router, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { AfterAuthUser, AuthUseCases } from '@modules/auth'

export const createSession = async (afterAuth: AfterAuthUser, router: Router) => {
	await AuthUseCases.sessionSignin(afterAuth)

	if (!afterAuth.user.isEmailVerified) return await router.push(`/auth/verify?email=${afterAuth.user.email}`)

	const { setAuthUser, signin } = useAuth()
	await setAuthUser(afterAuth.user)
	const successful = await signin(false)
	if (successful) await router.push(await $utils.getRedirectToRoute())
}

export const useRedirectToAuth = () => {
	const route = useRoute()
	const router = useRouter()
	const { id } = useAuth()

	const runInAuth =
		<T>(fn: () => T | Promise<T>) =>
		async () => {
			if (id.value) return fn()
			return redirect() as unknown as T
		}

	const redirect = async () => {
		await $utils.setRedirectToRoute(route.fullPath)
		if (router) await router.push('/auth/signin')
	}

	return { redirect, runInAuth }
}
