import { v } from 'valleyed'
import { AuthUser } from '../entities/auth'
import { BaseFactory } from '@modules/core'

export class EmailSigninFactory extends BaseFactory<null, AuthUser, AuthUser> {
	readonly rules = {
		email: v.string().email(),
		password: v.string().min(8).max(16),
	}

	reserved = []

	constructor() {
		super({ email: '', password: '' })
	}

	model = async () => {
		const { email, password } = this.validValues
		return { email, password }
	}

	load = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
