import { modal } from '@/composables/core/modal'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

export const routerPromise = Promise.all(routes).then((routes) => {
	const router = createRouter({
		history: createWebHistory(),
		routes,
	})

	routes.forEach((route) => {
		route.component.beforeRouteEnter ??= generateMiddlewares(['isAuthenticated'])
	})

	router.beforeEach((to, from, next) => {
		modal.stack.value.forEach(modal.close)
		Logic.Common.preFetchRouteData(to, from, next)
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
