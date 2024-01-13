import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from './ReadOnlyService'

export class ModelApiService<M = any, E = M> extends ReadOnlyApiService<M, E> {
	constructor(resource: string) {
		super(resource)
	}

	public async post(
		url = null,
		data: any = {},
		onUploadProgress = (progressEvent: any) => {
			// onprogress callback
			progressEvent
		},
	): Promise<AxiosResponse<E>> {
		try {
			const response = await this.axiosInstance.post(url ? url : this.getUrl(), data, {
				onUploadProgress: onUploadProgress,
			})

			return {
				...response,
				data: response.data ? this.mapper(response.data) : response.data,
			}
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async put(
		url = null,
		id: string,
		data: any = {},
		onUploadProgress: any = (progressEvent: any) => {
			// onprogress callback
			progressEvent
		},
	): Promise<AxiosResponse<E>> {
		try {
			const response: AxiosResponse = await this.axiosInstance.put(url ? url : this.getUrl(id), data, {
				onUploadProgress: onUploadProgress,
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
