import { AnnouncementFromModel } from '../../data/models/announcements'
import { BaseEntity } from '@modules/core'

export class AnnouncementEntity extends BaseEntity<AnnouncementFromModel> {
	constructor(data: AnnouncementFromModel) {
		super(data)
	}
}
