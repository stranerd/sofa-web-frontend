import { InteractionApi } from './interactions'
import { NotificationApi } from './notifications'
import { PlayApi } from './plays'
import { StudyApi } from './study'
import { UserApi } from './users'

export const $api = {
	interactions: InteractionApi,
	notifications: NotificationApi,
	plays: PlayApi,
	study: StudyApi,
	users: UserApi,
}
