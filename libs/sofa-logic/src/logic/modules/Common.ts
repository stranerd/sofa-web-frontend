import { AxiosError } from 'axios'
import currency from 'currency.js'
import moment from 'moment'
import io, { Socket } from 'socket.io-client'
import { reactive } from 'vue'
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  Router,
} from 'vue-router'
import { Logic } from '..'
import {
  EmitTypes,
  FetchRule,
  LoaderSetup,
  SocketReturn,
  StatusCodes,
} from '../types/common'
import { AuthResponse } from '../types/domains/auth'
import { ValidationError } from '../types/domains/common'

export default class Common {
  public router: Router | undefined = undefined

  public route: RouteLocationNormalizedLoaded | undefined = undefined

  public apiUrl: string | undefined = undefined

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

  public setupWebsocket = () => {
    const url = new URL(`${process.env.VUE_APP_API_URL}/socket.io`)

    const tokens: AuthResponse = localStorage.getItem('AuthTokens')
      ? JSON.parse(localStorage.getItem('AuthTokens') || '{}')
      : undefined

    const accessToken = `${tokens?.accessToken}`

    this.SocketClient = io(url.origin, {
      path: url.pathname,
      auth: { token: accessToken },
      transports: ['websocket'],
    })
  }

  public listenOnSocket = (
    initialChannel,
    listener: Function,
    onleave: Function,
  ) => {
    let finalChannel = ''

    this.SocketClient.emit(
      'join',
      { channel: `${initialChannel}` },
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
        return e
      }
    }

    return {
      closeConnection,
    }
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
    const responseData: any = error.response?.data

    const validationErrors: ValidationError[] = responseData

    let errorMessage = ''

    if (validationErrors) {
      validationErrors.forEach((validation) => {
        const field: any = formElement.fieldsToValidate[validation.field]

        if (field) {
          field.showError(validation.message)
        }
      })

      if (validationErrors.length) {
        errorMessage = validationErrors[0].message
      }
    }

    // this.hideLoader()
    this.showLoader({
      loading: false,
      show: true,
      type: 'error',
      message: customErrorMessage ? customErrorMessage : errorMessage,
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

  public loaderSetup: LoaderSetup = reactive({
    show: false,
    useModal: false,
    hasError: false,
    loading: false,
    message: '',
    ctaText: '',
    ctaFunction: () => {},
    icon: 'success-thumb',
    title: '',
  })

  public SetApiUrl = (apiUrl: string) => {
    this.apiUrl = apiUrl
  }

  public GoToRoute = async (path: string, force = false) => {
    if (path == '/auth/login') {
      if (
        !(window.location.pathname + window.location.search).includes('auth')
      ) {
        localStorage.setItem(
          'previous_page',
          window.location.pathname + window.location.search,
        )
      }

      await this.router?.push(path)
    } else {
      if (this.route.path == '/auth/login') {
        let nextRoute = ''
        if (!path.includes('auth')) {
          if (force) {
            this.router.push(path)
          } else {
            nextRoute = localStorage.getItem('previous_page') || '/'
            await this.router.push(nextRoute)
          }
        } else {
          await this.router?.push(path)
        }
      } else {
        await this.router?.push(path)
      }
    }
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
    return window.screen.width <= 640
  }

  public get isLarge () {
    return window.screen.width > 768
  }

  public showError = (message: string) => {
    this.showLoader({
      show: true,
      message,
      loading: false,
      type: 'error',
    })
  }

  public getLabel = (data: any, key: string) => {
    const thisData = data.filter((Option: any) => {
      return Option.key == key
    })

    return thisData.length > 0 ? thisData[0].value : ''
  }

  public showLoader = (loaderSetup: LoaderSetup) => {
    this.loaderSetup = loaderSetup
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

  public hideLoader = () => {
    const Loader: LoaderSetup = {
      loading: false,
    }
    this.loaderSetup = Loader
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
    if (this.loaderSetup.loading) {
      return
    }

    // save to route path
    localStorage.setItem('to_route', routeTo.fullPath)

    const routeMiddlewares: any = routeTo.meta.middlewares

    // handle fetchRules

    const fetchRules: FetchRule[] = routeMiddlewares?.fetchRules

    let BreakException = {}

    // confirm auth token is has expired, if not refresh
    const tokenExpiry = localStorage.getItem('token_expiry')

    if (tokenExpiry && Logic.Auth.AuthUser) {
      if (
        this.momentInstance
          .unix(parseInt(tokenExpiry))
          .diff(this.momentInstance.now(), 'minute') < 3
      ) {
        await Logic.Auth.RefreshAuthToken()
      }
    }

    try {
      fetchRules?.forEach((rule) => {
        if (rule.requireAuth) {
          if (!Logic.Auth.AuthUser) {
            window.location.href = '/auth/login'

            throw BreakException
          }
        }

        if (rule.shouldSkip?.()) return

        let addRuleToRequest = true

        if (rule.condition) {
          switch (rule.condition.routeSearchItem) {
            case 'fullPath':
              addRuleToRequest = routeTo['fullPath'].includes(
                rule.condition.searchQuery,
              )
              break
            case 'params':
              addRuleToRequest = routeTo['params'][rule.condition.searchQuery]
                ? true
                : false
              break
            case 'query':
              addRuleToRequest = routeTo['query'][rule.condition.searchQuery]
                ? true
                : false
              break
            default:
              break
          }
        }

        if (addRuleToRequest) {
          // @ts-ignore
          const domain = Logic[rule.domain]

          if (
            domain[rule.property] == undefined ||
            (typeof rule.ignoreProperty == 'function' &&
              rule.ignoreProperty()) ||
            rule.ignoreProperty
          ) {
            allActions.push(
              new Promise((resolve) => {
                if (rule.useRouteId) {
                  rule.params.unshift(routeTo.params.id.toString())
                }
                if (rule.useRouteQuery) {
                  rule.queries?.forEach((item) => {
                    rule.params.unshift(routeTo.query[item] || 'nill')
                  })
                }

                // update userid
                rule.params.forEach((param) => {
                  if (typeof param === 'object') {
                    if (param.where) {
                      param.where.forEach((item) => {
                        if (item.field == 'user.id' || item.field == 'userId') {
                          item.value = Logic.Auth.AuthUser.id
                        }
                      })
                    }
                  }
                })
                const request = domain[rule.method](...rule.params)
                request?.then((value: any) => {
                  resolve(value)
                })
              }),
            )
          } else {
            if (rule.silentUpdate) {
              // run in silence
              if (rule.useRouteId) {
                rule.params.unshift(routeTo.params.id.toString())
              }
              if (rule.useRouteQuery) {
                rule.queries?.forEach((item) => {
                  rule.params.unshift(routeTo.query[item])
                })
              }
              rule.params = [...new Set(rule.params)]
              domain[rule.method](...rule.params)
            }
          }
        }
      })
    } catch (error) {
      if (error !== BreakException) throw error
    }

    // save user activities

    if (allActions.length > 0) {
      this.showLoader({
        loading: true,
        show: false,
      })

      Promise.all(allActions).then(() => {
        this.hideLoader()
        return next()
      })
    } else {
      this.hideLoader()
      return next()
    }
  }
}
