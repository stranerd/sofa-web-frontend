import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { Logic } from '../../logic/modules'
import { API_URL } from '../../common/constants'
import { AuthResponse } from '../../logic/types/domains/auth'
import { StatusCodes } from '../../logic/types/common';

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
      const isGet = config.method.toLowerCase() === 'get'
			if (!isGet && config.data && !(config.data instanceof FormData)) {
				const formData = new FormData()
				Object.entries(config.data).forEach(([key, val]) => {
					if (val instanceof Blob) formData.set(key, val)
					else if (Array.isArray(val) && val[0] instanceof Blob) val.forEach((file) => formData.append(key, file))
					else if (val !== undefined) formData.set(key, JSON.stringify(val))
				})
				config.data = formData
			}

      const savedTokens = localStorage.getItem('AuthTokens')
      const tokens = savedTokens ? JSON.parse(savedTokens) as AuthResponse : undefined
      config.baseURL = Logic.Common.apiUrl
			config.headers ??= {} as any
			if (tokens?.accessToken) config.headers['Access-Token'] = tokens.accessToken
      if (tokens?.refreshToken) config.headers['Refresh-Token'] = tokens.refreshToken
			return config
    }, (error) => Promise.reject(error))
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.response) return Promise.reject(error)
        const { config, response } = error as AxiosError
        if (response.status.toString() !== StatusCodes.expiredAccessToken) return Promise.reject(error)
        try {
          const res = await this.axiosInstance.post('/auth/token', {})
          const tokens = res.data as AuthResponse
          localStorage.setItem('AuthTokens', JSON.stringify({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }))
        } catch {
          return Promise.reject(error)
        }
        return this.axiosInstance(config)
    })
  }

  public getUrl(id = ''): string {
    return id ? `/${this.resource}/${id}` : `/${this.resource}`
  }

  public handleErrors(err: AxiosError | any): void {
    // Note: here you may want to add your errors handling
    if (err.response?.status == 461 || err.response?.status == 401) {
      Logic.Common.hideLoader()
      Logic.Auth.SignOut()
    }
    throw err
  }
}
