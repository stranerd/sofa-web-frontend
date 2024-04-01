import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from '../common/ReadOnlyService'
import { PushNotificationTokenInput } from '../../logic/types/'

export default class PushTokensApi extends ReadOnlyApiService {
	constructor() {
		super('tokens/devices')
	}

	public async subscribeDevice(data: PushNotificationTokenInput) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.put(this.getUrl() + '/subscribe', data)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async unsubscribeDevice(data: PushNotificationTokenInput) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.put(this.getUrl() + '/unsubscribe', data)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
