import { v } from 'valleyed'
import { AuthDetails, ProfileUpdate } from '../entities/auth'
import { BaseFactory, Media } from '@modules/core'

type Keys = { first: string; last: string; description: string; photo: Media | null }

export class ProfileUpdateFactory extends BaseFactory<AuthDetails, ProfileUpdate, Keys> {
	readonly rules = {
		first: v.string().min(1).trim(),
		last: v.string().min(1).trim(),
		description: v.string(),
		photo: v.file().image().nullable(),
	}

	reserved = []

	constructor() {
		super({ first: '', last: '', description: '', photo: null })
	}

	model = () => {
		const { first, last, description, photo } = this.validValues
		return {
			name: { first, last },
			description,
			photo,
		}
	}

	load = (entity: AuthDetails) => {
		this.first = entity.name.first
		this.last = entity.name.last
		this.description = entity.description
		this.photo = entity.photo
	}
}
