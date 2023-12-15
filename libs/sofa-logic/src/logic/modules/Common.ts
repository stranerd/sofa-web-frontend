import { listenOnSocket } from '@modules/core'
import { AxiosError } from 'axios'
import currency from 'currency.js'
import moment from 'moment'
import { reactive } from 'vue'
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteLocationRaw,
  Router,
} from 'vue-router'
import { Logic } from '..'
import {
  Confirmation,
  ConfirmationSetup,
  FetchRule,
  Listeners,
  LoaderSetup
} from '../types/common'
import { ValidationError } from '../types/domains/common'

export default class Common {
  public window = reactive({ width: window.innerWidth })
  public router: Router | undefined = undefined

  public route: RouteLocationNormalizedLoaded | undefined = undefined

  public watchInterval: number | undefined = undefined

  public EquivalentsSecondsInString = {
    '5': '5s',
    '10': '10s',
    '20': '20s',
    '30': '30s',
    '60': '1m',
    '90': '1m 30s',
    '120': '2m',
    '180': '3m',
    '240': '4m',
    '300': '5m',
  }

  public AvailableCurrencies = {
    NGN: '₦',
    USD: '$',
  }

  constructor () {
    window.addEventListener('resize', () => {
      this.window.width = window.innerWidth
    })
  }

  public async listenToSocket<Model> (channel: string, listeners: Listeners<Model>) {
    return listenOnSocket<Model>(channel, listeners)
  }

  public async listenToOne<Model> (channel: string, listeners: Listeners<Model>) {
    return this.listenToSocket(channel, listeners)
	}

	async listenToMany<Model> (channel: string, listeners: Listeners<Model>, matches: (entity: Model) => boolean = () => true) {
		return this.listenToSocket<Model>(channel, {
      created: async (model) => {
				if (matches(model)) await listeners.created(model)
			},
      updated: async (model) => {
				if (matches(model)) await listeners.updated(model)
			},
      deleted: async (model) => {
				if (matches(model)) await listeners.deleted(model)
			}
		})
	}

  public SetRouter = (router: Router) => {
    this.router = router
  }

  public SetRoute = (route: RouteLocationNormalizedLoaded) => {
    this.route = route
  }

  public makeId = () => {
    return Logic.getRandomValue()
  }

  public showValidationError = (
    error: AxiosError,
    formElement: any,
    customErrorMessage: string | undefined = undefined,
  ) => {
    const validationErrors = error?.response?.data as ValidationError[]

    let errorMessage = ''

    if (validationErrors && validationErrors.length) {
      validationErrors.forEach((validation) => {
        formElement?.fieldsToValidate?.[validation.field]?.showError(validation.message)
      })
      errorMessage = validationErrors[0]?.message
    } else errorMessage = error.message

    this.showAlert({
      type: 'error',
      message: customErrorMessage ?? errorMessage,
    })
  }

  public ordinal_suffix_of(i: number) {
    const j = i % 10,
      k = i % 100
    if (j == 1 && k != 11) return i + 'st'
    if (j == 2 && k != 12) return i + 'nd'
    if (j == 3 && k != 13) return i + 'rd'
    return i + 'th'
  }

  public loaderSetup = reactive<LoaderSetup>({
    alerts: [],
    loaders: [],
    loading: false,
  })

  public confirmations = reactive<ConfirmationSetup[]>([])

  public async confirm (confirmation: Confirmation) {
    return new Promise<boolean>((res) => {
      const id = Logic.getRandomValue()
      this.confirmations.push({
        ...confirmation, id,
        close: (val: boolean) => {
          const index = this.confirmations.findIndex((c) => c.id === id)
          if (index === -1) return
          this.confirmations.splice(index, 1)
          res(val)
        }
      })
    })
  }

  public GoToRoute = async (to: RouteLocationRaw) => {
    await this.router?.push(to)
  }

  public get isOnlyMobile () {
    return this.window.width <= 640
  }

  public get isLarge () {
    return this.window.width > 1000
  }

  public showAlert = (alert: LoaderSetup['alerts'][number]) => {
    this.loaderSetup.alerts.push(alert)
  }

  public showError = (message: string) => {
    this.showAlert({
      message,
      type: 'error',
    })
  }

  public showLoading = (id?: string) => {
    if (id) this.loaderSetup.loaders.push(id)
    else this.loaderSetup.loading = true
  }

  public hideLoading = (id?: string) => {
    if (id) this.loaderSetup.loaders = this.loaderSetup.loaders.filter((i) => i !== id)
    else this.loaderSetup.loading = false
  }

  public goBack = () => {
    const ignoreBackRoute = this.route?.query.ignoreBackRoute
      ? this.route.query.ignoreBackRoute.toString()
      : null
    const routeMiddlewares: any = this.route?.meta.middlewares
    const goBackRoute = routeMiddlewares?.goBackRoute
    if (typeof goBackRoute == 'function' && !ignoreBackRoute) {
      this.GoToRoute(goBackRoute())
    } else if (typeof goBackRoute == 'string' && !ignoreBackRoute) {
      this.GoToRoute(goBackRoute)
    } else {
      window.history.length > 1 ? this.router?.go(-1) : this.router?.push('/')
    }
  }

  public momentInstance = moment

  public convertToMoney = (
    float: any,
    withZeros = true,
    currencyType = 'ngn',
    withSymbol = true,
  ) => {
    let currencySymbol = ''
    if (currencyType == 'usd') {
      currencySymbol = '$'
    } else if (currencyType == 'ngn') {
      currencySymbol = '₦'
    }
    if (!withSymbol) {
      currencySymbol = ''
    }
    if (withZeros) {
      return currency(float, {
        separator: ',',
        symbol: currencySymbol,
      }).format()
    } else {
      return currencySymbol + new Intl.NumberFormat().format(parseFloat(float))
    }
  }

  public searchArray = (arr: any[], searchKey: string) => {
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        return Logic.isString()(obj[key]).valid ? obj[key].includes(searchKey) : false
      })
    })
  }

  public debounce = (
    method = () => {
      //
    },
    delay = 500,
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof window.LIT !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      clearTimeout(window.LIT)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.LIT = setTimeout(() => {
      method()
    }, delay)
  }

  public watchProperty = (objectToWatch: any, objectToUpdate: any) => {
    let upatedValue = (this as any)[`${objectToWatch}`]
    const watchAction = () => {
      upatedValue = (this as any)[objectToWatch]
      if (objectToUpdate) objectToUpdate.value = upatedValue
      this.watchInterval = window.requestAnimationFrame(watchAction)
    }

    watchAction()
  }

  public fomartDate = (date: number, format: string) => {
    return moment(date).format(format)
  }

  public timeFromNow = (time: number) => {
    return moment(time).fromNow()
  }

  public preFetchRouteData = async (
    routeTo: RouteLocationNormalized,
    routeFrom: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const allActions: Promise<any>[] = []
    const routeMiddlewares: any = routeTo.meta.middlewares

    // handle fetchRules

    const fetchRules: FetchRule[] = routeMiddlewares?.fetchRules

    let BreakException = {}

    try {
      fetchRules?.forEach((rule) => {
        if (rule.requireAuth && !Logic.Auth.AuthUser) {
          window.location.href = '/auth/login'
          throw BreakException
        }

        if (rule.shouldSkip?.()) return
        let addRuleToRequest = true

        if (rule.condition) {
          switch (rule.condition.routeSearchItem) {
            case 'fullPath':
              addRuleToRequest = routeTo['fullPath'].includes( rule.condition.searchQuery)
              break
            case 'params':
              addRuleToRequest = routeTo['params'][rule.condition.searchQuery] ? true : false
              break
            case 'query':
              addRuleToRequest = routeTo['query'][rule.condition.searchQuery] ? true : false
              break
            default:
              break
          }
        }

        if (addRuleToRequest) {
          // @ts-ignore
          const domain = Logic[rule.domain]

          if (domain[rule.property] == undefined || (typeof rule.ignoreProperty == 'function' && rule.ignoreProperty()) || rule.ignoreProperty) {
            if (rule.useRouteId) rule.params.unshift(routeTo.params.id.toString())
            if (rule.useRouteQuery) rule.queries?.forEach((item) => {
              rule.params.unshift(routeTo.query[item])
            })

            allActions.push(
              new Promise((resolve) => {
                // update userid
                rule.params.forEach((param) => {
                  if (typeof param !== 'object') return
                  param.where?.forEach((item) => {
                    if (item.field == 'user.id' || item.field == 'userId') item.value = Logic.Auth.AuthUser.id
                  })
                })
                domain[rule.method]?.(...rule.params).then(resolve)
              }),
            )
          } else {
            if (rule.silentUpdate) {
              // run in silence
              rule.params = [...new Set(rule.params)]
              domain[rule.method]?.(...rule.params)
            }
          }
        }
      })
    } catch (error) {
      if (error !== BreakException) throw error
    }

    // save user activities

    if (allActions.length > 0) {
      this.showLoading()
      await Promise.all(allActions)
    }
    this.hideLoading()
    return next()
  }

  tabIsActive = (tab: string) => {
    if (tab === "/" && (this.route.path === "/" || this.route.path === '/organization/dashboard')) return true
    else if (tab !== "/" && this.route.path.startsWith(tab)) return true
    return false
  }

  public async share (title: string, text: string, url = window.location.href)  {
    try {
      await navigator.share({ title, text, url })
    } catch (err) {
      this.copy(url, 'Link copied to your clipboard!')
    }
  }

  public async copy (text: string, message = 'Copied!', type: LoaderSetup['alerts'][number]['type'] = 'success') {
    const result = await window.navigator.permissions.query({ name: 'clipboard-write' as any })
    if (result.state === 'granted' || result.state === 'prompt') {
      await window.navigator.clipboard.writeText(text)
      this.showAlert({ message, type })
      return true
    }
    return false
  }
}
