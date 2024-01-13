import { Middleware } from '@/middlewares'
import { Route } from 'vue-router'

export type RouteConfig = Partial<{
	goBackRoute: string | ((route: Route) => string)
	middlewares: Middleware[]
	fetchRules: any[]
}>

declare module 'vue' {
	interface ComponentCustomOptions {
		routeConfig?: RouteConfig
	}
}
