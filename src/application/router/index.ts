// @ts-expect-error - no types
import routes from '~pages'
import { createRouter, createWebHistory } from 'vue-router'
import { modal } from '@app/composables/core/modal'
import { runMiddlewares } from '@app/middlewares'

export const router = createRouter({
	history: createWebHistory(),
	routes: routes.map((r: any) => ({ ...r, props: false })),
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) return { el: to.hash, behavior: 'smooth' }
		if (savedPosition) return savedPosition
		return { top: 0, behavior: 'smooth' }
	},
})

$utils.setRouter(router)

router.beforeEach(async (to, from) => {
	modal.stack.value.forEach(modal.close)
	// @ts-expect-error - no types
	const routeConfig: RouteConfig = to.matched[0]?.components?.['default']?.['routeConfig'] ?? {}
	const middlewares: RouteConfig['middlewares'] = routeConfig.middlewares ?? []
	const redirect = await runMiddlewares(to, from, middlewares)
	if (redirect) return redirect === from?.fullPath ? false : redirect
})

router.afterEach((route) => {
	$utils.setRoute(route)
	const listRoute = router.options.routes.find((r) => r.name === route.name)
	router.currentRoute.value.meta = listRoute?.meta ?? {}
})
