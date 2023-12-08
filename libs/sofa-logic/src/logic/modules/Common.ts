import { AxiosError } from 'axios'
import currency from 'currency.js'
import moment from 'moment'
import io, { Socket } from 'socket.io-client'
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
  EmitTypes,
  FetchRule,
  Listeners,
  LoaderSetup,
  SocketReturn,
  StatusCodes,
} from '../types/common'
import { ValidationError } from '../types/domains/common'

export default class Common {
  public window = reactive({ width: window.innerWidth })
  public router: Router | undefined = undefined

  public route: RouteLocationNormalizedLoaded | undefined = undefined

  public apiUrl = ''

  public watchInterval: number | undefined = undefined

  public loadingState = false

  public SocketClient: Socket | undefined

  public timeEquivalentsInSeconds = {
    '5s': 5,
    '10s': 10,
    '20s': 20,
    '30s': 30,
    '1m': 60,
    '1m 30s': 90,
    '2m': 120,
    '3m': 180,
    '4m': 240,
    '5m': 300,
  }

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

  public inWords = (num: any) => {
    let a = [
      '',
      'one ',
      'two ',
      'three ',
      'four ',
      'five ',
      'six ',
      'seven ',
      'eight ',
      'nine ',
      'ten ',
      'eleven ',
      'twelve ',
      'thirteen ',
      'fourteen ',
      'fifteen ',
      'sixteen ',
      'seventeen ',
      'eighteen ',
      'nineteen ',
    ]
    let b = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety',
    ]

    if ((num = num.toString()).length > 9) return 'overflow'
    const n: any = ('000000000' + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n) return
    var str = ''
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore '
        : ''
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh '
        : ''
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
        : ''
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
        : ''
    str +=
      n[5] != 0
        ? (str != '' ? 'and ' : '') +
          (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
          ' '
        : ''
    return str
  }

  public async setupWebsocket () {
    const url = new URL(`${this.apiUrl}/socket.io`)

    const tokens = await Logic.Auth.GetTokens()

    this.SocketClient = io(url.origin, {
      path: url.pathname,
      auth: { token: tokens?.accessToken },
      transports: ['websocket'],
    })
  }

  public async listenOnSocket (
    initialChannel,
    listener: Function,
    onleave: Function = () => {},
  ) {
    const tokens = await Logic.Auth.GetTokens()
    const accessToken = tokens?.accessToken
    if (
      !this.SocketClient
      || (!this.SocketClient.auth['token'] && accessToken)
      || (accessToken && this.SocketClient.auth['token'] !== accessToken)
    ) await this.setupWebsocket()

    let finalChannel = ''

    this.SocketClient.emit(
      'join',
      { channel: initialChannel },
      (res: SocketReturn) => {
        finalChannel = res.channel

        if (res.code.toString() !== StatusCodes.success) return

        this.SocketClient.on(
          finalChannel,
          (data: { channel: string; type: EmitTypes; data: any }) => {
            if (finalChannel !== data.channel) return
            // Do whatever you want with the data depending on the type emitted
            listener(data)
          },
        )
      },
    )

    const closeConnection = () => {
      try {
        this.SocketClient.emit(
          'leave',
          { channel: finalChannel },
          (res: SocketReturn) => {
            // Perform any cleanup after the connection is closed
            onleave(res)
          },
        )
      } catch (e) {
      }
    }

    return {
      closeConnection,
    }
  }

  public async listenToSocket<Model> (channel: string, listeners: Listeners<Model>) {
    const { closeConnection } = await this.listenOnSocket(channel, (data) => listeners[data.type]?.(data.data))
    return closeConnection
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

  public SumArray = (array: any[]) => {
    return array.reduce((partialSum, a) => partialSum + a, 0)
  }

  public removeDuplicatesFromArray = (arrayData: any[], keys: any[]) => {
    return arrayData.filter(
      ((s) => (o) =>
        ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join('|')))(
        new Set(),
      ),
    )
  }

  public makeid = (length: number, isNumeric = false) => {
    let result = ''
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    if (isNumeric) {
      characters = '0123456789'
    }
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
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

  public capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  public ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100
    if (j == 1 && k != 11) {
      return i + 'st'
    }
    if (j == 2 && k != 12) {
      return i + 'nd'
    }
    if (j == 3 && k != 13) {
      return i + 'rd'
    }
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
      const id = this.makeid(6)
      this.confirmations.push({
        ...confirmation, id,
        close: (val: boolean) => {
          const index = this.confirmations.findIndex((c) => c.id === id)
          console.log(index, val)
          if (index === -1) return
          this.confirmations.splice(index, 1)
          res(val)
        }
      })
    })
  }

  public SetApiUrl = (apiUrl: string) => {
    this.apiUrl = apiUrl
  }

  public GoToRoute = async (to: RouteLocationRaw) => {
    await this.router?.push(to)
  }

  public shuffleArray = (array: any[]) => {
    let currentIndex = array.length,
      randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }

    return array
  }

  public intersectArray(a: any[], b: any[]) {
    var setB = new Set(b)
    return [...new Set(a)].filter((x) => setB.has(x))
  }

  public mediaQuery = (): 'lg' | 'mdlg' | 'md' | 'sm' | 'xl' | '2xl' => {
    const windowWidth = window.screen.width

    if (windowWidth <= 640) {
      return 'sm'
    } else if (windowWidth > 640 && windowWidth <= 768) {
      return 'md'
    } else if (windowWidth > 769 && windowWidth <= 1000) {
      return 'mdlg'
    } else if (windowWidth > 1001 && windowWidth <= 1580) {
      return 'lg'
    } else if (windowWidth > 1581 && windowWidth <= 1280) {
      return 'xl'
    } else if (windowWidth > 1280) {
      return '2xl'
    }
  }

  public get isOnlyMobile () {
    return this.window.width <= 640
  }

  public get isLarge () {
    return this.window.width > 1000
  }

  public getLabel = (data: any, key: string) => {
    const thisData = data.filter((Option: any) => {
      return Option.key == key
    })

    return thisData.length > 0 ? thisData[0].value : ''
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

  public globalParameters = reactive<{
    currency: string
  }>({
    currency: 'ngn',
  })

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

  private isString = (x: any) => {
    return Object.prototype.toString.call(x) === '[object String]'
  }

  public searchArray = (arr: any[], searchKey: string) => {
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        return this.isString(obj[key]) ? obj[key].includes(searchKey) : false
      })
    })
  }

  public copytext = (text: string) => {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
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
      upatedValue = (this as any)[`${objectToWatch}`]
      if (objectToUpdate) {
        objectToUpdate.value = upatedValue
      }
      this.watchInterval = window.requestAnimationFrame(watchAction)
    }

    watchAction()
  }

  public stopWatchAction = () => {
    if (this.watchInterval != undefined) {
      window.cancelAnimationFrame(this.watchInterval)
    }
  }

  private fetchFile = (url: string) => {
    return new Promise(function (resolve, reject) {
      // Get file name from url.
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onload = function () {
        resolve(xhr)
      }
      xhr.onerror = reject
      xhr.open('GET', url)
      xhr.send()
    }).then(function (xhr: any) {
      const filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0]
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(xhr.response) // xhr.response is a blob
      a.download = filename // Set the file name.
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      return xhr
    })
  }

  public downloadFiles = (urls = []) => {
    return Promise.all(urls.map(this.fetchFile))
  }

  public fomartDate = (date: number, format: string) => {
    return moment(date).format(format)
  }

  public countDownTime = (endTime: number) => {
    return moment(moment(endTime).diff(moment.now())).format('mm:ss')
  }

  public timeFromNow = (time: number) => {
    return moment(time).fromNow()
  }

  public updatedData = (oldData: any, newData: any) => {
    if (oldData != undefined && newData != undefined) {
      return { ...oldData, ...newData }
    }
    return oldData
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
    if (tab === "/" && this.route.path === "/") return true
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
    this.copytext(text)
    this.showAlert({ message, type })
  }
}
