import { ScheduleEntity } from '../../domain/entities/schedules'
import { ScheduleFromModel, ScheduleToModel } from '../models/schedules'

export class ScheduleMapper {
	mapFrom (model: ScheduleFromModel | null) {
		if (!model) return null
		const { id, organizationId, classId, lessonId, user, title, time, createdAt, updatedAt } = model
		return new ScheduleEntity({
			id, organizationId, classId, lessonId, user,
			title, time, createdAt, updatedAt
		})
	}

	mapTo (entity: ScheduleEntity) :ScheduleToModel {
		return {
			title: entity.title,
			classId: entity.classId,
			organizationId: entity.organizationId,
			lessonId: entity.lessonId,
			time: entity.time,
			user: entity.user
		}
	}
}
