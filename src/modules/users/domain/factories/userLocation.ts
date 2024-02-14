import { v } from 'valleyed'
import { UserEntity } from '../entities/users'
import { UserLocation } from '../types'
import { BaseFactory } from '@modules/core'

export class UserLocationFactory extends BaseFactory<UserEntity, UserLocation, UserLocation> {
	readonly rules = {
		country: v.string().min(1),
		state: v.string().min(1),
	}
	reserved = []

	constructor() {
		super({ country: '', state: '' })
	}

	set country(value: string) {
		this.set('country', value)
		this.resetProp('state')
	}

	loadEntity = (entity: UserEntity) => {
		this.entityId = entity.id
		if (entity.location) {
			this.country = entity.location.country
			this.state = entity.location.state
		}
	}

	model = async () => {
		const { country, state } = this.validValues
		return { country, state }
	}
}
