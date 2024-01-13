import { modal } from '@app/composables/core/modal'
import { runMiddlewares } from '@app/middlewares'
import { RouteConfig } from '@typing/routes'
import { Logic } from 'sofa-logic'
import { createRouter, createWebHistory } from 'vue-router'
// @ts-expect-error - no types
import routes from '~pages'

export const routerPromise = Promise.all(routes).then((routes) => {
	const router = createRouter({
		history: createWebHistory(),
		routes,
	})

	router.beforeEach(async (to, from) => {
		modal.stack.value.forEach(modal.close)
		const routeConfig: RouteConfig = to.matched[0]?.components?.['default']?.['routeConfig'] ?? {}
		const redirect = await runMiddlewares(to, from, routeConfig.middlewares ?? ['isAuthenticated'])
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
