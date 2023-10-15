import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_URL } from '../../common/constants'
import { Logic } from '../../logic/modules'
import { AuthResponse } from '../../logic/types/domains/auth'

export class BaseApiService {
  private readonly baseUrl = API_URL
  public axiosInstance: AxiosInstance
  private config: AxiosRequestConfig
  resource

  constructor(resource: string) {
    if (!resource) throw new Error('Resource is not provided')
    this.resource = resource

    this.config = {
      baseURL: this.baseUrl,
    }

    this.axiosInstance = axios.create(this.config)

    this.axiosInstance.interceptors.request.use(async (config) => {
      config.baseURL = Logic.Common.apiUrl

      if (config.method.toLowerCase() === "get") {
        config.params = Object.fromEntries(
          Object.entries(config.params ?? {})
            .map(([key, val]) => [key, JSON.stringify(val)])
        )
      } else {
        const formData: FormData = new FormData()
        Object.entries(config.data ?? {}).forEach(([key, val]) => {
        if (val instanceof Blob) formData.set(key, val)
          else if (Array.isArray(val) && val[0] instanceof Blob) val.forEach((file) => formData.append(key, file))
          else if (val !== undefined) formData.set(key, JSON.stringify(val))
        })

        config.data = formData
      }

      // @ts-ignore
      config.headers ??= {}
      const tokens: AuthResponse = localStorage.getItem('AuthTokens')
      ? JSON.parse(localStorage.getItem('AuthTokens') || '{}')
        : undefined
      if (tokens) {
        config.headers['Access-Token'] = tokens.accessToken
        config.headers['Refresh-Token'] = tokens.refreshToken
      }

      return config
    }, (error) => Promise.reject(error))
  }

  public getUrl(id = ''): string {
    return id ? `/${this.resource}/${id}` : `/${this.resource}`
  }

  public handleErrors(err: AxiosError | any): void {
    // Note: here you may want to add your errors handling
    if (err.response?.status == 401) {
      Logic.Common.hideLoader()
      Logic.Auth.SignOut()
    }

    if (err.response?.status == 461) {
      if (!Logic.Auth.RefreshIsActive) {
        Logic.Auth.RefreshIsActive = true
        Logic.Auth.RefreshAuthToken()?.then(() => {
          const fullWindowPath =
            window.location.pathname + window.location.search
          window.location.href =
            localStorage.getItem('to_route') || fullWindowPath
        })
      }
    }
    throw err
  }
}
