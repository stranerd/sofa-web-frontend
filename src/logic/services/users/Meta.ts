import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'

export default class MetaApi extends ModelApiService {
	constructor() {
		super('meta')
	}

	public async sendMessage(message: string) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.post(this.getUrl() + '/messages', {
				message,
			})
			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
