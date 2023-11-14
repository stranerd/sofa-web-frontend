import { NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router'
import { Logic } from 'sofa-logic'

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
	if (Logic.Auth.AuthUser) return '/'
})
const checkAuthUser = async (to: string) => {
	if (!Logic.Auth.AuthUser || !Logic.Users.UserProfile) {
		if (!to.startsWith('/auth/')) localStorage.set(Logic.Auth.redirectToName, to)
		return '/auth/login'
	}
	if (!Logic.Auth.AuthUser.isEmailVerified) {
		if (!to.startsWith('/auth/')) localStorage.set(Logic.Auth.redirectToName, to)
		return '/auth/verify-email'
	}
}
export const isAuthenticated = defineMiddleware(async ({ to }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (!Logic.Users.UserProfile.type) {
		localStorage.set(Logic.Auth.redirectToName, to.fullPath)
		return '/onboarding'
	}
})
export const isOnboarding = defineMiddleware(async ({ to, goBackToNonAuth }) => {
	const redirect = await checkAuthUser(to.fullPath)
	if (redirect) return redirect
	if (Logic.Users.UserProfile.type) return goBackToNonAuth()
})
export const isSubscribed = defineMiddleware(async ({ goBackToNonAuth }) => {
	const authUser = Logic.Auth.AuthUser
	if (!authUser || !authUser.roles.isSubscribed) return goBackToNonAuth()
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
