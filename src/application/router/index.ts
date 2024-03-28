// @ts-expect-error - no types
import routes from '~pages'
import { createRouter, createWebHistory } from 'vue-router'
import { modal } from '@app/composables/core/modal'
import { runMiddlewares } from '@app/middlewares'
import { Logic } from 'sofa-logic'

export const router = createRouter({
	history: createWebHistory(),
	routes: routes.map((r: any) => ({ ...r, props: false })),
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) return { el: to.hash, behavior: 'smooth' }
		if (savedPosition) return savedPosition
		return { top: 0, behavior: 'smooth' }
	},
})

Logic.Common.SetRouter(router)

router.beforeEach(async (to, from) => {
	modal.stack.value.forEach(modal.close)
	// @ts-expect-error - no types
	const routeConfig: RouteConfig = to.matched[0]?.components?.['default']?.['routeConfig'] ?? {}
	const defaultMiddlewares = routeConfig.fetchRules ? ['isAuthenticated'] : []
	const middlewares: RouteConfig['middlewares'] = routeConfig.middlewares ?? defaultMiddlewares
	const redirect = await runMiddlewares(to, from, middlewares)
	if (redirect) return redirect === from?.fullPath ? false : redirect
	const redirect2 = await Logic.Common.preFetchRouteData(routeConfig, to)
	if (redirect2) return redirect2 === from?.fullPath ? false : redirect2
})

router.afterEach((route) => {
	Logic.Common.SetRoute(route)
	const listRoute = router.options.routes.find((r) => r.name === route.name)
	router.currentRoute.value.meta = listRoute?.meta ?? {}
})
