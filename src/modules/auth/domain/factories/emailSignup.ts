import { isEqualTo, v } from 'valleyed'
import { NewUser } from '../entities/auth'
import { BaseFactory } from '@modules/core'

type Keys = {
	email: string
	password: string
	cPassword: string
	termsAccepted: boolean
}

export class EmailSignupFactory extends BaseFactory<null, NewUser, Keys> {
	readonly rules = {
		email: v.string().email(),
		password: v.string().min(8).max(16),
		cPassword: v
			.string()
			.min(8)
			.max(16)
			.custom((val) => isEqualTo(this.password)(val).valid, 'is not equal'),
		termsAccepted: v.is(true),
	}
	protected onSet = {
		password: () => {
			this.set('cPassword', this.cPassword)
		},
	}

	reserved = []

	constructor() {
		super({
			email: '',
			password: '',
			cPassword: '',
			termsAccepted: false,
		})
	}

	model = () => {
		const { email, password } = this.validValues
		return { email, password }
	}

	load = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
