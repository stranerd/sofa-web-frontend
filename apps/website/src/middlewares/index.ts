import { NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router'
import { Logic } from 'sofa-logic'
import { useAuth } from '@/composables/auth/auth'

type MiddleWareArgs = {
	to: RouteLocationNormalized,
	from: RouteLocationNormalized | null,
	goBackToNonAuth: () => string
}

type MiddlewareFunction = (d: MiddleWareArgs) => Promise<string | void>

export const defineMiddleware = (middleware: MiddlewareFunction) => middleware

export const isAdmin = defineMiddleware(async () => {
	const authUser = Logic.Auth.AuthUser
	if (!authUser || !authUser.roles.isAdmin) return '/'
})
export const isNotAuthenticated = defineMiddleware(async () => {
	if (useAuth().isLoggedIn.value) return '/'
})
const checkAuthUser = async (to: string) => {
	if (!useAuth().isLoggedIn.value) {
		if (!to.startsWith('/auth/')) await Logic.Auth.setRedirectToRoute(to)
		return '/auth/login'
	}
	if (!useAuth().isEmailVerified.value) {
		if (!to.startsWith('/auth/')) await Logic.Auth.setRedirectToRoute(to)
		return '/auth/verify'
	}
}
export const isAuthenticated = defineMiddleware(async ({ to }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (!Logic.Users.UserProfile.type) {
		await Logic.Auth.setRedirectToRoute(to.fullPath)
		return '/onboarding'
	}
})
export const isOnboarding = defineMiddleware(async ({ to, goBackToNonAuth }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (Logic.Users.UserProfile.type) return goBackToNonAuth()
})
export const isSubscribed = defineMiddleware(async ({ goBackToNonAuth }) => {
	if (!useAuth().isSubscribed.value) return goBackToNonAuth()
})

const globalMiddlewares = { isAuthenticated, isNotAuthenticated, isOnboarding, isAdmin, isSubscribed }
type Middleware = MiddlewareFunction | keyof typeof globalMiddlewares

export const generateMiddlewares = (middlewares: Middleware[]): NavigationGuardWithThis<undefined> => async (to, fromRoute) => {
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
