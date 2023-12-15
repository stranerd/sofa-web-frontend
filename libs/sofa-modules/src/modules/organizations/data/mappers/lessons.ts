import { LessonEntity } from '../../domain/entities/lessons'
import { LessonFromModel, LessonToModel } from '../models/lessons'

export class LessonMapper {
	mapFrom (model: LessonFromModel | null) {
		if (!model) return null
		const { id, organizationId, classId, title, users, createdAt, updatedAt } = model
		return new LessonEntity({
			id, organizationId, classId, title, users, createdAt, updatedAt
		})
	}

	mapTo (entity: LessonEntity) : LessonToModel {
		return {
			title: entity.title,
			classId: entity.classId,
			organizationId: entity.organizationId,
			users: entity.users,
		}
	}
}
