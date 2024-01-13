import { HttpClient, UploadedFile } from '@modules/core'
import { apiBase } from '@utils/environment'
import { getTokens } from '@utils/tokens'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

export class BaseApiService {
	public axiosInstance: AxiosInstance
	private config: AxiosRequestConfig = {}
	resource

	constructor(resource: string) {
		if (!resource) throw new Error('Resource is not provided')
		this.resource = resource

		this.axiosInstance = axios.create(this.config)

		this.axiosInstance.interceptors.request.use(
			async (config) => {
				config.baseURL = apiBase

				if (config.method.toLowerCase() === 'get') {
					config.params = Object.fromEntries(Object.entries(config.params ?? {}).map(([key, val]) => [key, JSON.stringify(val)]))
				} else {
					const formData: FormData = new FormData()
					Object.entries(config.data ?? {}).forEach(([key, val]) => {
						if (UploadedFile.is(val)) formData.set(key, val.ref)
						else if (Array.isArray(val) && UploadedFile.is(val[0])) val.forEach((file) => formData.append(key, file.ref))
						else if (val instanceof File) formData.set(key, val)
						else if (Array.isArray(val) && val[0] instanceof File) val.forEach((file) => formData.append(key, file))
						else if (val !== undefined) formData.set(key, JSON.stringify(val))
					})

					config.data = formData
				}

				config.headers ??= {} as any
				const { accessToken, refreshToken } = await getTokens()
				if (accessToken) config.headers['Access-Token'] = accessToken
				if (refreshToken) config.headers['Refresh-Token'] = refreshToken

				return config
			},
			(error) => Promise.reject(error),
		)

		this.axiosInstance.interceptors.response.use(
			async (response) => response,
			async (error: AxiosError) => {
				if (!error.isAxiosError) return Promise.reject(error)
				const status = error.response?.status ?? null
				const path = error.config?.url ?? null

				if (status !== 461 || path === '/auth/token') return Promise.reject(error)

				try {
					await new HttpClient().getNewTokens()
					return this.axiosInstance.request(error.config)
				} catch {
					return Promise.reject(error)
				}
			},
		)
	}

	public getUrl(id = ''): string {
		return id ? `/${this.resource}/${id}` : `/${this.resource}`
	}

	public handleErrors(err: AxiosError | any): void {
		throw err
	}
}
