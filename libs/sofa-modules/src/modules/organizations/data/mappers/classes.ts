import { ClassEntity } from '../../domain/entities/classes'
import { ClassFromModel, ClassToModel } from '../models/classes'

export class ClassMapper {
	mapFrom (param: ClassFromModel | null) {
		return !param ? null : new ClassEntity({
			id: param.id,
			organizationId: param.organizationId,
			title: param.title,
			description: param.description,
			photo: param.photo,
			user: param.user,
			frozen: param.frozen,
			price: param.price,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: ClassEntity) : ClassToModel  {
		return {
			organizationId: param.organizationId,
			title: param.title,
			description: param.description,
			photo: param.photo,
			user: param.user,
			frozen: param.frozen,
			price: param.price,
		}
	}
}