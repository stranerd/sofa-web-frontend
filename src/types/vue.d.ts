import { RouteLocationNormalized } from 'vue-router'
import { Middleware } from '@app/middlewares'
import { Screen, Utils } from '@utils/modules'

declare global {
	type RouteConfig = Partial<{
		goBackRoute: string | ((route: RouteLocationNormalized) => string)
		middlewares: Middleware[]
	}>

	declare const $utils: Utils
	declare const $screen: Screen
}

declare module 'vue' {
	interface ComponentCustomOptions {
		routeConfig?: RouteConfig
	}

	interface ComponentCustomProperties {
		$utils: Utils
		$screen: Screen
	}
}
