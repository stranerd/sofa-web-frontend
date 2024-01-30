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

	get first() {
		return this.values.first
	}

	set first(value: string) {
		this.set('first', value)
	}

	get last() {
		return this.values.last
	}

	set last(value: string) {
		this.set('last', value)
	}

	get description() {
		return this.values.description
	}

	set description(value: string) {
		this.set('description', value)
	}

	get photo() {
		return this.values.photo
	}

	set photo(photo: Media | null) {
		this.set('photo', photo)
	}

	model = async () => {
		const { first, last, description, photo } = this.validValues
		return {
			name: { first, last },
			description,
			photo,
		}
	}

	loadEntity = (entity: AuthDetails) => {
		this.first = entity.name.first
		this.last = entity.name.last
		this.description = entity.description
		this.photo = entity.photo
	}
}
