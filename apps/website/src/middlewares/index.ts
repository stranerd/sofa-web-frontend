import { NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router'
import { Logic } from 'sofa-logic'

const REDIRECT_SESSION_NAME = 'redirect-to'

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
export const isAuthenticated = defineMiddleware(async ({ to }) => {
	if (!Logic.Auth.AuthUser) {
		if (!to.fullPath.startsWith('/auth/')) await localStorage.set(REDIRECT_SESSION_NAME, to.fullPath)
		return '/auth/login'
	}
	if (!Logic.Auth.AuthUser.isEmailVerified) {
		if (!to.fullPath.startsWith('/auth/')) await localStorage.set(REDIRECT_SESSION_NAME, to.fullPath)
		return '/auth/verify-email'
	}
})
export const isSubscribed = defineMiddleware(async ({ goBackToNonAuth }) => {
	const authUser = Logic.Auth.AuthUser
	if (!authUser || !authUser.roles.isSubscribed) {
		return goBackToNonAuth()
	}
})

const globalMiddlewares = { isAuthenticated, isNotAuthenticated, isAdmin, isSubscribed }
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
