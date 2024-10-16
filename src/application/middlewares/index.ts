import { RouteLocationNormalized } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { UserTypeFactory } from '@modules/users'

type MiddleWareArgs = {
	to: RouteLocationNormalized
	from: RouteLocationNormalized | null
	goBackToNonAuth: () => string
}

type MiddlewareFunction = (d: MiddleWareArgs) => string | void | Promise<string | void>

export const defineMiddleware = (middleware: MiddlewareFunction) => middleware

export const isAdmin = defineMiddleware(async () => {
	const { auth } = useAuth()
	if (!auth.value || !auth.value.roles.isAdmin) return '/dashboard'
})
export const isNotAuthenticated = defineMiddleware(async () => {
	if (useAuth().isLoggedIn.value) return '/dashboard'
})
const checkAuthUser = async (to: string) => {
	const { isLoggedIn, isEmailVerified, user } = useAuth()
	if (!isLoggedIn.value) {
		if (!to.startsWith('/auth/')) await $utils.setRedirectToRoute(to)
		return '/auth/signin'
	}
	if (!isEmailVerified.value) {
		if (!to.startsWith('/auth/')) await $utils.setRedirectToRoute(to)
		return `/auth/verify?email=${user.value?.email ?? ''}`
	}
}
export const isAuthenticated = defineMiddleware(async ({ to }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (!useAuth().user.value?.type) {
		await $utils.setRedirectToRoute(to.fullPath)
		return '/onboarding'
	}
})

export const isOnboarding = defineMiddleware(async ({ to, goBackToNonAuth }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	const user = useAuth().user.value
	if (user) {
		const userTypeFactory = new UserTypeFactory()
		userTypeFactory.load(user)
		if (userTypeFactory.valid) return goBackToNonAuth()
	}
})
export const isSubscribed = defineMiddleware(async ({ goBackToNonAuth }) => {
	if (!useAuth().isSubscribed.value) return goBackToNonAuth()
})
export const isOrg = defineMiddleware(async ({ to }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (!useAuth().userType.value.isOrg) return '/dashboard'
})

const globalMiddlewares = { isAuthenticated, isNotAuthenticated, isOnboarding, isAdmin, isSubscribed, isOrg }
export type Middleware = MiddlewareFunction | keyof typeof globalMiddlewares

const wrapInAsync = async <T>(fn: () => T) => await fn()

export const runMiddlewares = async (to: RouteLocationNormalized, fromRoute: RouteLocationNormalized, middlewares: Middleware[]) => {
	const from = fromRoute?.name ? fromRoute : null
	let redirect: string | undefined
	for (const middleware of middlewares) {
		const callback = typeof middleware === 'string' ? globalMiddlewares[middleware] : middleware
		const goBackToNonAuth = () => {
			const backPath = from?.fullPath ?? '/dashboard'
			return backPath.startsWith('/auth/') ? '/dashboard' : backPath
		}
		const path = await wrapInAsync(() => callback?.({ to, from, goBackToNonAuth })).catch(() => null)
		if (!path) continue
		redirect = path
		break
	}
	return redirect
}
