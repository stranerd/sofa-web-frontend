import routes from '~pages'
import { createRouter, createWebHistory } from 'vue-router'
import { modal } from '@app/composables/core/modal'
import { runMiddlewares } from '@app/middlewares'
import { Logic } from 'sofa-logic'
// @ts-expect-error - no types

export const routerPromise = Promise.all(routes).then((routes) => {
	const router = createRouter({
		history: createWebHistory(),
		routes,
	})

	router.beforeEach(async (to, from) => {
		modal.stack.value.forEach(modal.close)
		// @ts-expect-error - no types
		const routeConfig: RouteConfig = to.matched[0]?.components?.['default']?.['routeConfig'] ?? {}
		const middlewares = routeConfig.middlewares ?? ['isAuthenticated']
		const redirect = await runMiddlewares(to, from, middlewares)
		if (redirect) return redirect === from?.fullPath ? false : redirect
		const redirect2 = await Logic.Common.preFetchRouteData(routeConfig, to)
		if (redirect2) return redirect2 === from?.fullPath ? false : redirect2
	})

	router.afterEach((route) => {
		Logic.Common.SetRoute(route)
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		const listRoute = router.options.routes.find((r) => r.name === route.name)
		router.currentRoute.value.meta = listRoute?.meta ?? {}
	})

	Logic.Common.SetRouter(router)

	return router
})
