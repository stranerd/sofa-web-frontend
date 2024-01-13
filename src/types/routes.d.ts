import { Middleware } from '@/middlewares'
import { FetchRule } from 'sofa-logic'
import { Route } from 'vue-router'

export type RouteConfig = Partial<{
	goBackRoute: string | ((route: Route) => string)
	middlewares: Middleware[]
	fetchRules: FetchRule[]
}>

declare module 'vue' {
	interface ComponentCustomOptions {
		routeConfig?: RouteConfig
	}
}
