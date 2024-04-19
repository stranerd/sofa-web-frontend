import { AxiosResponse } from 'axios'
import { QueryParams, QueryResults } from '../../logic/types/common'
import { BaseApiService } from './BaseService'

export class ReadOnlyApiService<M = any, E = M> extends BaseApiService {
	constructor(resource: string) {
		super(resource)
	}

	mapper: (data: M) => E = (data: M) => data as unknown as E

	public async fetch(filters: QueryParams = {}): Promise<AxiosResponse<QueryResults<E>>> {
		try {
			const response: AxiosResponse = await this.axiosInstance.get(this.getUrl(), {
				params: filters,
			})

			return {
				...response,
				data: {
					...response.data,
					results: response.data.results.map(this.mapper),
				},
			}
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async get(id: string): Promise<AxiosResponse<E>> {
		try {
			if (!id) {
				id = 'empty'
			}

			const response: AxiosResponse = await this.axiosInstance.get(this.getUrl(id))

			return {
				...response,
				data: response.data ? this.mapper(response.data) : response.data,
			}
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
