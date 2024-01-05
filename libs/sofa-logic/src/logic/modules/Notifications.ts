import { Logic } from '..'
import { $api } from '../../services'
import { Paginated, QueryParams } from '../types'
import { Conditions } from '../types/common'
import { Notification } from '../types/domains/notifications'
import Common from './Common'

export default class Notifications extends Common {
	constructor() {
		super()
	}

	public AllNotifications: Paginated<Notification> | undefined
	public SingleNotification: Notification | undefined

	public GetNotifications = (filters: QueryParams) => {
		return $api.notifications.notifications.fetch(filters).then((response) => {
			this.AllNotifications = response.data
		})
	}

	public GetNotification = (id: string) => {
		return $api.notifications.notifications.get(id).then((response) => {
			this.SingleNotification = response.data
		})
	}

	public ToggleSeenNotifications = (id: string, seen: boolean) => {
		return $api.notifications.notifications.toggleNotification({ id, seen }).then().catch()
	}

	public ToggleAllNotifications = (seen: boolean) => {
		return $api.notifications.notifications
			.toggleAllNotification(seen)
			.then(() => {
				Logic.Notifications.GetNotifications({
					where: [
						{
							field: 'userId',
							condition: Conditions.eq,
							value: Logic.Common.AuthUser?.id,
						},
					],
				})
			})
			.catch()
	}

	public SubscribeDevice = (token: string) => {
		return $api.notifications.pushTokens.subscribeDevice({ token }).then().catch()
	}

	public UnSubscribeToken = (token: string) => {
		return $api.notifications.pushTokens.unsubscribeDevice({ token }).then().catch()
	}
}
