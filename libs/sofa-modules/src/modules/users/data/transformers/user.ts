import { UserEntity } from '../../domain/entities/user'
import { UserFromModel, UserToModel } from '../models/user'

export class UserTransformer {
	fromJSON (model: UserFromModel) {
		const { id, bio, roles, account, status, dates, type, tutor, ai, socials, location } = model
		return new UserEntity({
			id, bio, roles, account, status, dates, type, tutor, ai, socials, location
		})
	}

	toJSON (_: UserEntity): UserToModel {
		return {}
	}
}
