import { InteractionApi } from './interactions'
import { NotificationApi } from './notifications'
import { StudyApi } from './study'
import { UserApi } from './users'

export const $api = {
	interactions: InteractionApi,
	notifications: NotificationApi,
	study: StudyApi,
	users: UserApi,
}
