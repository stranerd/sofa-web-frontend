import { Logic } from 'sofa-logic'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { generateMiddlewares } from '@/middlewares'

export const routerPromise = Promise.all(routes).then((routes) => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  routes.forEach((route) => {
    route.component.beforeRouteEnter ??= generateMiddlewares(['isAuthenticated'])
  })

  router.beforeEach((to, from, next) => {
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