import { Media } from '@modules/core'

export type AuthUser = {
	email: string
	password: string
}

export enum AuthRoles {
	isAdmin = 'isAdmin',
	isSubscribed = 'isSubscribed',
	isVerified = 'isVerified',
	isOfficialAccount = 'isOfficialAccount',
}

export enum AuthTypes {
	google = 'google',
	email = 'email',
	facebook = 'facebook',
	twitter = 'twitter',
}

export type AfterAuthUser = {
	accessToken: string
	refreshToken: string
	user: AuthDetails
}

export type AuthDetails = {
	id: string
	name: {
		first: string
		last: string
	}
	email: string
	isEmailVerified: boolean
	description: string
	photo: Media | null
	phone: Phone | null
	roles: Record<AuthRoles, boolean>
	authTypes: AuthTypes[]
	allNames: {
		first: string
		last: string
		full: string
	}
	lastSignedInAt: number
	signedUpAt: number
}

export type AuthExtras = {
	referrer?: string
}

export type Phone = {
	code: string
	number: string
}

export type NewUser = Pick<AuthDetails, 'email'> & {
	password: string
}

export type UserBio = Pick<AuthDetails, 'description' | 'photo'> & {
	name: AuthDetails['allNames']
}

export type ProfileUpdate = Pick<AuthDetails, 'name' | 'description' | 'photo'>

export type PasswordUpdate = {
	oldPassword: string
	password: string
}

export type AuthRoleType = AuthDetails['roles']
