import { isEqualTo, v } from 'valleyed'
import { NewUser } from '../entities/auth'
import { BaseFactory, Media } from '@modules/core'

type Keys = Omit<NewUser, 'name'> & {
	first: string
	last: string
	cPassword: string
	photo: Media | null
	termsAccepted: boolean
}

export class EmailSignupFactory extends BaseFactory<null, NewUser, Keys> {
	readonly rules = {
		first: v.string().min(1),
		last: v.string(),
		description: v.string(),
		email: v.string().email(),
		photo: v.file().image().nullable(),
		password: v.string().min(8).max(16),
		cPassword: v
			.string()
			.min(8)
			.max(16)
			.custom((val) => isEqualTo(this.password)(val).valid, 'is not equal'),
		termsAccepted: v.is(true),
	}

	reserved = []

	constructor() {
		super({
			first: '',
			last: '',
			email: '',
			password: '',
			cPassword: '',
			description: '',
			photo: null,
			termsAccepted: false,
		})
	}

	set password(value: string) {
		this.set('password', value)
		this.set('cPassword', '')
	}

	model = async () => {
		const { first, last, email, password, description, photo } = this.validValues
		return {
			name: { first, last },
			email,
			password,
			description,
			photo: photo,
		}
	}

	loadEntity = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
