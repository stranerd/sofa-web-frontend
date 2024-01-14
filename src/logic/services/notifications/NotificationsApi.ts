import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from '../common/ReadOnlyService'

export default class NotificationsApi extends ReadOnlyApiService {
	constructor() {
		super('notifications/notifications')
	}

	public async toggleNotification(data: { id: string; seen: boolean }) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.put(this.getUrl() + `/${data.id}/seen`, data)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async toggleAllNotification(seen: boolean) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.put(this.getUrl() + '/seen', { seen })

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
