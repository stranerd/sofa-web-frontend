import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { UserEntity } from '../entities/users'
import { UserAi } from '../types'

export class UserAiFactory extends BaseFactory<UserEntity, UserAi, UserAi & { localPhotoLink: string | undefined }> {
	readonly rules = {
		name: v.string().min(1),
		tagline: v.string().min(1),
		photo: v.file().image().nullable(),
		localPhotoLink: v.string().nullish(),
	}
	reserved = []

	constructor() {
		super({ name: UserEntity.defaultAi, tagline: '', photo: null, localPhotoLink: UserEntity.defaultAiPhotoLink })
	}

	get name() {
		return this.values.name
	}

	set name(value: string) {
		this.set('name', value)
	}

	get tagline() {
		return this.values.tagline
	}

	set tagline(value: string) {
		this.set('tagline', value)
	}

	get photo() {
		return this.values.photo
	}

	set photo(value: UserAi['photo']) {
		this.set('photo', value)
		if (value?.link) this.localPhotoLink = value.link
	}

	get localPhotoLink() {
		return this.values.localPhotoLink
	}

	set localPhotoLink(value: string | undefined) {
		this.set('localPhotoLink', value)
	}

	loadEntity = (entity: UserEntity) => {
		this.entityId = entity.id
		if (entity.ai) {
			this.name = entity.ai.name
			this.tagline = entity.ai.tagline
			this.photo = entity.ai.photo
		}
	}

	toModel = async () => {
		if (this.valid) {
			const { name, tagline, photo } = this.validValues
			return { name, tagline, photo }
		} else {
			throw new Error('Validation errors')
		}
	}
}
