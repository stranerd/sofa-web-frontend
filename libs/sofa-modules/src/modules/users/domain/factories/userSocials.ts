import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { UserEntity } from '../entities/users'
import { UserSocials, UserSocialsType } from '../types'

export class UserSocialsFactory extends BaseFactory<UserEntity, UserSocialsType, { socials: UserSocialsType }> {
	readonly rules = {
		socials: v.array(
			v.object({
				ref: v.in(Object.values(UserSocials)),
				link:  v.string().url()
			})
		),
	}
	reserved = []

	constructor () {
		super({ socials: [] })
	}

	get socials () {
		return this.values.socials
	}

	set socials (value: UserSocialsType) {
		this.set('socials', value)
	}

	loadEntity = (entity: UserEntity) => {
		if (!entity.type) return
		this.entityId = entity.id
		this.socials = entity.socials
	}

	toModel = async () => {
		if (this.valid) {
			const { socials } = this.validValues
			return socials
		} else {
			throw new Error('Validation errors')
		}
	}
}
