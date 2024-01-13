import { useAuth } from '@/composables/auth/auth'
import { Logic } from 'sofa-logic'
import { NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router'

type MiddleWareArgs = {
	to: RouteLocationNormalized
	from: RouteLocationNormalized | null
	goBackToNonAuth: () => string
}

type MiddlewareFunction = (d: MiddleWareArgs) => Promise<string | void>

export const defineMiddleware = (middleware: MiddlewareFunction) => middleware

export const isAdmin = defineMiddleware(async () => {
	const { auth } = useAuth()
	if (!auth.value || !auth.value.roles.isAdmin) return '/'
})
export const isNotAuthenticated = defineMiddleware(async () => {
	if (useAuth().isLoggedIn.value) return '/'
})
const checkAuthUser = async (to: string) => {
	if (!useAuth().isLoggedIn.value) {
		if (!to.startsWith('/auth/')) await Logic.Common.setRedirectToRoute(to)
		return '/auth/login'
	}
	if (!useAuth().isEmailVerified.value) {
		if (!to.startsWith('/auth/')) await Logic.Common.setRedirectToRoute(to)
		return '/auth/verify'
	}
}
export const isAuthenticated = defineMiddleware(async ({ to }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (!useAuth().user.value?.type) {
		await Logic.Common.setRedirectToRoute(to.fullPath)
		return '/onboarding'
	}
})
export const isOnboarding = defineMiddleware(async ({ to, goBackToNonAuth }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (useAuth().user.value?.type) return goBackToNonAuth()
})
export const isSubscribed = defineMiddleware(async ({ goBackToNonAuth }) => {
	if (!useAuth().isSubscribed.value) return goBackToNonAuth()
})
export const isOrg = defineMiddleware(async ({ to }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (!useAuth().userType.value.isOrg) return '/'
})

const globalMiddlewares = { isAuthenticated, isNotAuthenticated, isOnboarding, isAdmin, isSubscribed, isOrg }
type Middleware = MiddlewareFunction | keyof typeof globalMiddlewares

export const generateMiddlewares =
	(middlewares: Middleware[]): NavigationGuardWithThis<undefined> =>
	async (to, fromRoute) => {
		const from = fromRoute.name ? fromRoute : null
		let redirect = null
		for (const middleware of middlewares) {
			const callback = typeof middleware === 'string' ? globalMiddlewares[middleware] : middleware
			const goBackToNonAuth = () => {
				const backPath = from?.fullPath ?? '/'
				return backPath.startsWith('/auth/') ? '/' : backPath
			}
			const path = await callback?.({ to, from, goBackToNonAuth }).catch(() => null)
			if (!path) continue
			redirect = path
			break
		}
		if (redirect) return redirect === from?.fullPath ? false : redirect
	}
