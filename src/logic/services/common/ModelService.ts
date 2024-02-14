import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from './ReadOnlyService'

export class ModelApiService<M = any, E = M> extends ReadOnlyApiService<M, E> {
	constructor(resource: string) {
		super(resource)
	}

	public async post(url = null, data: any = {}, query: Record<string, any> = {}): Promise<AxiosResponse<E>> {
		try {
			const response = await this.axiosInstance.post(url ? url : this.getUrl(), data, {
				params: Object.fromEntries(Object.entries(query).map(([k, v]) => [k, JSON.stringify(v)])),
			})

			return {
				...response,
				data: response.data ? this.mapper(response.data) : response.data,
			}
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async put(url = null, id: string, data: any = {}, query: Record<string, any> = {}): Promise<AxiosResponse<E>> {
		try {
			const response: AxiosResponse = await this.axiosInstance.put(url ? url : this.getUrl(id), data, {
				params: Object.fromEntries(Object.entries(query).map(([k, v]) => [k, JSON.stringify(v)])),
			})

			return {
				...response,
				data: response.data ? this.mapper(response.data) : response.data,
			}
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async delete(id: string | undefined): Promise<AxiosResponse<boolean>> {
		if (!id) throw Error('Id is not provided')
		try {
			const response = await this.axiosInstance.delete(this.getUrl(id))

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
