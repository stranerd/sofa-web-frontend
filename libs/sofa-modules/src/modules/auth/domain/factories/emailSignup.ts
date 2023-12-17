import { BaseFactory, Media, UploadedFile } from '@modules/core'
import { isEqualTo, v } from 'valleyed'
import { NewUser } from '../entities/auth'

type Content = UploadedFile | Media | null

type Keys = Omit<NewUser, 'name' | 'photo'> & {
	first: string
	last: string
	cPassword: string
	photo: Content
	termsAccepted: boolean
}

export class EmailSignupFactory extends BaseFactory<null, NewUser, Keys> {
	readonly rules = {
		first: v.string().min(3),
		last: v.string().min(3),
		description: v.string(),
		email: v.string().email(),
		photo: v.file().image().nullable(),
		password: v.string().min(8).max(16),
		cPassword: v.string().min(8).max(16)
			.custom((val) => isEqualTo(this.password)(val).valid, 'is not equal'),
		termsAccepted: v.is(true)
	}

	reserved = []

	constructor () {
		super({
			first: 'new', last: 'user', email: '', password: '', cPassword: '',
			description: '', photo: null, termsAccepted: false
		})
	}

	get first () {
		return this.values.first
	}

	set first (value: string) {
		this.set('first', value)
	}

	get last () {
		return this.values.last
	}

	set last (value: string) {
		this.set('last', value)
	}

	get description () {
		return this.values.description
	}

	set description (value: string) {
		this.set('description', value)
	}

	get photo () {
		return this.values.photo
	}

	set photo (value: Content) {
		this.set('photo', value)
	}

	get email () {
		return this.values.email
	}

	set email (value: string) {
		this.set('email', value)
	}

	get password () {
		return this.values.password
	}

	set password (value: string) {
		this.set('password', value)
		this.set('cPassword', '')
	}

	get cPassword () {
		return this.values.cPassword
	}

	set cPassword (value: string) {
		this.set('cPassword', value)
	}

	get termsAccepted () {
		return this.values.termsAccepted
	}

	set termsAccepted (value: boolean) {
		this.set('termsAccepted', value)
	}

	toModel = async () => {
		if (this.valid) {
			const { first, last, email, password, description, photo } = this.validValues
			return {
				name: { first, last }, email, password, description,
				photo: photo as Media
			}
		} else throw new Error('Validation errors')
	}

	loadEntity = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
