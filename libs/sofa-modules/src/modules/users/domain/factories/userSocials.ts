import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { UserEntity } from '../entities/users'
import { UserSocials, UserSocialsType } from '../types'

export class UserSocialsFactory extends BaseFactory<UserEntity, { socials: UserSocialsType }, { socials: [UserSocials, string][] }> {
	readonly rules = {
		socials: v.array(
			v.tuple([v.in(Object.values(UserSocials)), v.string().url()])
		).min(1),
	}
	reserved = []

	constructor () {
		super({ socials: [] })
	}

	get socials () {
		return this.values.socials
	}

	set socials (value: [UserSocials, string][]) {
		this.set('socials', value)
	}

	addNewSocial = (ref: UserSocials) => {
		this.socials = [...this.socials, [ref, '']]
	}

	removeSocial = (index: number) => {
		this.socials = this.socials.filter((_, i) => i !== index)
	}

	getUrlError (link: string) {
		if (!link) return ''
		const val = v.string().url().parse(link)
		if (val.valid) return ''
		return val.errors[0]
	}

	loadEntity = (entity: UserEntity) => {
		if (!entity.type) return
		this.entityId = entity.id
		this.socials = entity.socials.map(({ ref, link }) => [ref, link])
	}

	toModel = async () => {
		if (this.valid) {
			const { socials } = this.validValues
			return {
				socials: socials.map(([ref, link]) => ({ ref, link }))
			}
		} else {
			throw new Error('Validation errors')
		}
	}
}
