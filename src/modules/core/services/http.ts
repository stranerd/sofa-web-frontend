import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, Method } from 'axios'
import { UploadedFile } from './uploader'
import { AfterAuthUser } from '@modules/auth'
import { getTokens, saveTokens } from '@utils/tokens'

export class NetworkError extends Error {
	readonly statusCode: StatusCodes
	readonly errors: { message: string; field?: string }[]

	constructor(statusCode: number, errors: { message: string; field?: string }[]) {
		super()
		this.statusCode = statusCode
		this.errors = errors
	}
}

export class HttpClient {
	private readonly client: AxiosInstance
	#apiBase = $utils.environment.apiBase

	constructor(baseURL = '') {
		this.client = axios.create({ baseURL: `${this.#apiBase}${baseURL}` })
		this.client.interceptors.request.use(
			async (config) => {
				const isFromOurServer = this.client.defaults.baseURL?.startsWith(this.#apiBase)
				if (!isFromOurServer) return config
				const { accessToken, refreshToken } = await getTokens()
				config.headers = new AxiosHeaders(config.headers)
				if (accessToken) config.headers.set('Access-Token', accessToken)
				if (refreshToken) config.headers.set('Refresh-Token', refreshToken)
				return config
			},
			(error) => Promise.reject(error),
		)
	}

	async get<Query, ReturnValue>(url: string, query: Query): Promise<ReturnValue> {
		return this.makeRequest<unknown, Query, ReturnValue>(url, 'get', {}, query)
	}

	async post<Body, ReturnValue, Query = any>(url: string, body: Body, query: Query = {} as any): Promise<ReturnValue> {
		return this.makeRequest<Body, unknown, ReturnValue>(url, 'post', body, query)
	}

	async put<Body, ReturnValue, Query = any>(url: string, body: Body, query: Query = {} as any): Promise<ReturnValue> {
		return this.makeRequest<Body, unknown, ReturnValue>(url, 'put', body, query)
	}

	async delete<Body, ReturnValue, Query = any>(url: string, body: Body, query: Query = {} as any): Promise<ReturnValue> {
		return this.makeRequest<Body, Query, ReturnValue>(url, 'delete', body, query)
	}

	async download(url: string) {
		try {
			const { data: blob } = await this.client.get(url, { responseType: 'blob' })
			const base64: string = await new Promise((res, rej) => {
				const reader = new FileReader()
				reader.onerror = rej
				reader.onload = () => res(reader.result as string)
				reader.readAsDataURL(blob)
			})
			return { blob, base64 }
		} catch (e: any) {
			throw new Error('Error downloading file')
		}
	}

	private async makeRequest<Body, Query, ReturnValue>(url: string, method: Method, data: Body, query: Query): Promise<ReturnValue> {
		try {
			const isGet = method === 'get'
			if (!isGet) {
				const formData = new FormData()
				Object.entries(data as any).forEach(([key, val]) => {
					if (UploadedFile.is(val)) formData.set(key, val.ref)
					else if (Array.isArray(val) && UploadedFile.is(val[0]))
						val.forEach((file) => (UploadedFile.is(file) ? formData.append(key, file.ref) : null))
					else if (val !== undefined) formData.set(key, JSON.stringify(val))
				})
				data = formData as any
			} else {
				query = Object.fromEntries(Object.entries(query as any).map(([key, val]) => [key, JSON.stringify(val)])) as any
			}
			const res = await this.client.request<Body, AxiosResponse<ReturnValue>>({
				url,
				method,
				params: query,
				data,
			})
			return res.data
		} catch (e) {
			const error = e as unknown as AxiosError<any>
			if (!error.isAxiosError) throw error
			if (!error.response) throw error
			const status = error.response.status
			const isFromOurServer = this.client.defaults.baseURL?.startsWith(this.#apiBase) && Object.values(StatusCodes).includes(status)
			if (!isFromOurServer) throw error
			if (status !== StatusCodes.AccessTokenExpired) throw new NetworkError(status, error.response.data)
			const res = await this.getNewTokens()
			if (res) return this.makeRequest(url, method, data, query)
			else throw error
		}
	}

	async getNewTokens() {
		try {
			const { data } = await this.client.post<any, AxiosResponse<AfterAuthUser>>('/auth/token', {}, { baseURL: this.#apiBase })
			await saveTokens(data)
			return !!data
		} catch (e) {
			const error = e as unknown as AxiosError<any>
			if (!error.isAxiosError) throw error
			if (!error.response) throw error
			const status = error.response.status
			throw new NetworkError(status, error.response.data)
		}
	}

	get socketPath() {
		const baseUrl = this.client.defaults.baseURL ?? ''
		const isFromOurServer = baseUrl.startsWith(this.#apiBase)
		if (!isFromOurServer) return ''
		const path = baseUrl.split(this.#apiBase)[1]
		if (path.startsWith('/')) return path.slice(1)
		return path
	}
}

export enum StatusCodes {
	Ok = 200,
	BadRequest = 400,
	NotAuthenticated = 401,
	NotAuthorized = 403,
	NotFound = 404,
	ValidationError = 422,
	TooManyRequests = 429,
	AccessTokenExpired = 461,
}

export enum QueryKeys {
	and = 'and',
	or = 'or',
}

export enum Conditions {
	lt = 'lt',
	lte = 'lte',
	gt = 'gt',
	gte = 'gte',
	eq = 'eq',
	ne = 'ne',
	in = 'in',
	nin = 'nin',
	exists = 'exists',
}

type Where = { field: string; value: any; condition?: Conditions }
type WhereBlock = { condition: QueryKeys; value: (Where | WhereBlock)[] }
type WhereClause = Where | WhereBlock

export interface QueryParams {
	where?: WhereClause[]
	auth?: WhereClause[]
	whereType?: QueryKeys
	authType?: QueryKeys
	sort?: { field: string; desc?: boolean }[]
	limit?: number
	all?: boolean
	page?: number
	search?: { value: string; fields: string[] }
}

export interface QueryResults<Model> {
	pages: {
		start: number
		last: number
		previous: number | null
		next: number | null
		current: number
	}
	docs: {
		limit: number
		total: number
		count: number
	}
	results: Model[]
}
