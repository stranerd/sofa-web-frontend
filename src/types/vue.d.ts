import { RouteLocationNormalized } from 'vue-router'
import { Middleware } from '@app/middlewares'
import { Screen, Utils } from '@utils/modules'

declare global {
	type RouteConfig = Partial<{
		goBackRoute: string | ((route: RouteLocationNormalized) => string)
		middlewares: Middleware[]
	}>

	declare var $utils: Utils // eslint-disable-line no-var
	declare var $screen: Screen // eslint-disable-line no-var
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
