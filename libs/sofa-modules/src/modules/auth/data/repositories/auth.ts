import { HttpClient, closeSocket } from '@modules/core'
import { apiBase } from '@utils/environment'
import { deleteTokens, saveTokens } from '@utils/tokens'
import {
	AfterAuthUser,
	AuthDetails,
	AuthExtras,
	AuthRoles,
	NewUser,
	PasswordUpdate,
	Phone,
	ProfileUpdate,
} from '../../domain/entities/auth'
import { IAuthRepository } from '../../domain/irepositories/iauth'

export class AuthRepository implements IAuthRepository {
	private static instance: AuthRepository
	private client: HttpClient

	private constructor() {
		this.client = new HttpClient(`${apiBase}/auth`)
	}

	static getInstance() {
		if (!AuthRepository.instance) AuthRepository.instance = new AuthRepository()
		return AuthRepository.instance
	}

	async getAuthUser() {
		return await this.client.get<any, AuthDetails | null>('/user', {})
	}

	async signinWithEmail(email: string, password: string, extras: AuthExtras) {
		return await this.client.post<any, AfterAuthUser>('/emails/signin', {
			email,
			password,
			referrer: extras.referrer,
		})
	}

	async signinWithGoogle(data: { idToken: string }, extras: AuthExtras) {
		return await this.client.post<any, AfterAuthUser>('/identities/google', {
			...data,
			referrer: extras.referrer,
		})
	}

	async signinWithApple(
		data: { firstName: string | null; lastName: string | null; email: string | null; idToken: string },
		extras: AuthExtras,
	) {
		return await this.client.post<any, AfterAuthUser>('/identities/apple', {
			...data,
			referrer: extras.referrer,
		})
	}

	async signupWithEmail(user: NewUser, extras: AuthExtras) {
		return await this.client.post<any, AfterAuthUser>('/emails/signup', {
			...user,
			referrer: extras.referrer,
		})
	}

	async sendVerificationEmail() {
		await this.client.post<any, boolean>('/emails/verify/mail', {})
	}

	async completeEmailVerification(token: string) {
		return await this.client.post<any, AfterAuthUser>('/emails/verify', {
			token,
		})
	}

	async sendVerificationText(phone: Phone) {
		await this.client.post<any, boolean>('/phone/verify/text', { phone })
	}

	async completePhoneVerification(token: string) {
		return await this.client.post<any, AfterAuthUser>('/phone/verify', { token })
	}

	async sendPasswordResetEmail(email: string) {
		await this.client.post<any, boolean>('/passwords/reset/mail', { email })
	}

	async resetPassword(token: string, password: string) {
		return await this.client.post<any, AfterAuthUser>('/passwords/reset', {
			token,
			password,
		})
	}

	async updateProfile(bio: ProfileUpdate) {
		await this.client.put<ProfileUpdate, any>('/user', bio)
	}

	async updatePassword(passwords: PasswordUpdate) {
		await this.client.post<PasswordUpdate, any>('/passwords/update', passwords)
	}

	async session(afterAuth: AfterAuthUser) {
		await saveTokens(afterAuth)
		await closeSocket()
		return afterAuth.user
	}

	async signout() {
		await this.client.post<any, boolean>('/user/signout', {}).catch()
		await deleteTokens()
		await closeSocket()
	}

	async deleteAccount() {
		await this.client.delete<any, boolean>('/user', {}).catch()
		await deleteTokens()
		await closeSocket()
	}

	async updateRole(data: { id: string; value: boolean; role: AuthRoles }) {
		return await this.client.post<any, boolean>('/user/roles', {
			role: data.role,
			userId: data.id,
			value: data.value,
		})
	}
}
