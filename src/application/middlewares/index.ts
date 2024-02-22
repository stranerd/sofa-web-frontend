import { RouteLocationNormalized } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { Logic } from 'sofa-logic'

type MiddleWareArgs = {
	to: RouteLocationNormalized
	from: RouteLocationNormalized | null
	goBackToNonAuth: () => string
}

type MiddlewareFunction = (d: MiddleWareArgs) => string | void | Promise<string | void>

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
		return '/auth/signin'
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
export type Middleware = MiddlewareFunction | keyof typeof globalMiddlewares

const wrapInAsync = async <T>(fn: () => T) => await fn()

export const runMiddlewares = async (to: RouteLocationNormalized, fromRoute: RouteLocationNormalized, middlewares: Middleware[]) => {
	const from = fromRoute?.name ? fromRoute : null
	let redirect: string | undefined
	for (const middleware of middlewares) {
		const callback = typeof middleware === 'string' ? globalMiddlewares[middleware] : middleware
		const goBackToNonAuth = () => {
			const backPath = from?.fullPath ?? '/'
			return backPath.startsWith('/auth/') ? '/' : backPath
		}
		const path = await wrapInAsync(() => callback?.({ to, from, goBackToNonAuth })).catch(() => null)
		if (!path) continue
		redirect = path
		break
	}
	return redirect
}
