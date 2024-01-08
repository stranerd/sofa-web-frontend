import { InteractionApi } from './interactions'
import { NotificationApi } from './notifications'
import { PaymentApi } from './payment'
import { PlayApi } from './plays'
import { SchoolApi } from './schools'
import { StudyApi } from './study'
import { UserApi } from './users'

export const $api = {
	interactions: InteractionApi,
	notifications: NotificationApi,
	payment: PaymentApi,
	plays: PlayApi,
	schools: SchoolApi,
	study: StudyApi,
	users: UserApi,
}
