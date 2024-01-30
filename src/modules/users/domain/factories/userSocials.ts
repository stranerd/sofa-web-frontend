import { v } from 'valleyed'
import { UserEntity } from '../entities/users'
import { UserSocials, UserSocialsType } from '../types'
import { BaseFactory } from '@modules/core'

export class UserSocialsFactory extends BaseFactory<UserEntity, UserSocialsType, { socials: UserSocialsType }> {
	readonly rules = {
		socials: v
			.array(
				v.object({
					ref: v.in(Object.values(UserSocials)),
					link: v.string().url(),
				}),
			)
			.min(1),
	}
	reserved = []

	constructor() {
		super({ socials: [] })
	}

	private get socials() {
		return this.values.socials
	}

	private set socials(value: UserSocialsType) {
		this.set('socials', value)
	}

	addNewSocial = (ref: UserSocials) => {
		this.socials = [...this.socials, { ref, link: '' }]
	}

	removeSocial = (index: number) => {
		this.socials = this.socials.filter((_, i) => i !== index)
	}

	getSocials() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		const newSocials = this.socials.map((s) => ({
			...s,
			get link() {
				return s.link
			},
			set link(value: string) {
				s.link = value
				that.socials = newSocials
			},
			get error() {
				if (!s.link) return ''
				const val = v.string().url().parse(s.link)
				if (val.valid) return ''
				return val.errors[0]
			},
		}))
		return newSocials
	}

	loadEntity = (entity: UserEntity) => {
		this.entityId = entity.id
		this.socials = entity.socials
	}

	model = async () => {
		const { socials } = this.validValues
		return socials
	}
}
