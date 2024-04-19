import { RouteLocationNormalized } from 'vue-router'
import { Middleware } from '@app/middlewares'
import { Common, FetchRule, Screen } from 'sofa-logic'

declare global {
	type RouteConfig = Partial<{
		goBackRoute: string | ((route: RouteLocationNormalized) => string)
		middlewares: Middleware[]
		fetchRules: FetchRule[]
	}>
}

declare module 'vue' {
	interface ComponentCustomOptions {
		routeConfig?: RouteConfig
	}

	interface ComponentCustomProperties {
		$utils: Common
		$screen: Screen
	}
}