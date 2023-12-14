import { UserEntity } from '../../domain/entities/user'
import { UserFromModel, UserToModel } from '../models/user'

export class UserMapper {
	mapFrom (model: UserFromModel | null) {
		if (!model) return null
		const { id, bio, roles, account, status, dates, type, tutor, ai, socials, location } = model
		return new UserEntity({
			id, bio, roles, account, status, dates, type, tutor, ai, socials, location
		})
	}

	mapTo (_: UserEntity): UserToModel {
		return {}
	}
}
