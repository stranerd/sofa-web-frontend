import { isEqualTo, v } from 'valleyed'
import { PasswordUpdate } from '../entities/auth'
import { BaseFactory } from '@modules/core'

type Keys = PasswordUpdate & { cPassword: string }

export class PasswordUpdateFactory extends BaseFactory<null, PasswordUpdate, Keys> {
	readonly rules = {
		oldPassword: v.string(),
		password: v.string().min(8).max(16),
		cPassword: v
			.string()
			.min(8)
			.max(16)
			.custom((val) => isEqualTo(this.password)(val).valid, 'is not equal'),
	}
	protected onSet = {
		oldPassword: () => {
			this.set('password', this.password)
			this.set('cPassword', this.cPassword)
		},
		password: () => {
			this.set('cPassword', this.cPassword)
		},
		cPassword: (value: string) => {
			if (value || this.password) this.set('cPassword', this.cPassword)
			else this.resetProp('cPassword')
		},
	}

	reserved = []

	constructor() {
		super({ oldPassword: '', password: '', cPassword: '' })
	}

	model = () => {
		const { oldPassword, password } = this.validValues
		return { oldPassword, password }
	}

	load = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
