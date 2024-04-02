import { NotificationFromModel } from '../../data/models/notifications'
import { BaseEntity } from '@modules/core'

export class NotificationEntity extends BaseEntity<NotificationFromModel> {
	constructor(data: NotificationFromModel) {
		super(data)
	}
}
