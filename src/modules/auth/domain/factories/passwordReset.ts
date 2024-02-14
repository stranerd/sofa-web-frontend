import { isEqualTo, v } from 'valleyed'
import { BaseFactory } from '@modules/core'

type Keys = { email: string; token: string; password: string; cPassword: string }

export class PasswordResetFactory extends BaseFactory<null, { password: string; token: string }, Keys> {
	readonly rules = {
		token: v.string().min(5),
		password: v.string().min(8).max(16),
		cPassword: v
			.string()
			.min(8)
			.max(16)
			.custom((val) => isEqualTo(this.password)(val).valid, 'is not equal'),
		email: v.string().email(),
	}

	reserved = []

	constructor() {
		super({ email: '', password: '', cPassword: '', token: '' })
	}

	set password(value: string) {
		this.set('password', value)
		this.set('cPassword', this.cPassword)
	}

	model = async () => {
		const { password, token } = this.validValues
		return { password, token }
	}

	loadEntity = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
