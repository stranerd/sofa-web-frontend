import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_URL } from '../../common/constants'
import { Logic } from '../../logic/modules'

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
      const tokens =  await Logic.Auth.GetTokens()
      if (tokens) {
        config.headers['Access-Token'] = tokens.accessToken
        config.headers['Refresh-Token'] = tokens.refreshToken
      }

      return config
    }, (error) => Promise.reject(error))

    this.axiosInstance.interceptors.response.use(async (response) => response, async (error: AxiosError) => {
      if (!error.isAxiosError) return Promise.reject(error)
      const status = error.response?.status ?? null
      const path = error.config?.url ?? null

      if (status !== 461 || path === '/auth/token') return Promise.reject(error)

      try {
        await Logic.Auth.RefreshAuthToken()
        return this.axiosInstance.request(error.config)
      } catch {
        return Promise.reject(error)
      }
    });
  }

  public getUrl(id = ''): string {
    return id ? `/${this.resource}/${id}` : `/${this.resource}`
  }

  public handleErrors (err: AxiosError | any): void {
    throw err
  }
}
