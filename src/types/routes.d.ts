import { Route } from 'vue-router'
import { Middleware } from '@app/middlewares'
import { FetchRule } from 'sofa-logic'

declare global {
	type RouteConfig = Partial<{
		goBackRoute: string | ((route: Route) => string)
		middlewares: Middleware[]
		fetchRules: FetchRule[]
	}>
}

declare module 'vue' {
	interface ComponentCustomOptions {
		routeConfig?: RouteConfig
	}
}
