import { saveTokens } from '@utils/tokens'
import { Logic } from '..'
import { $api } from '../../services'
import { AuthUser } from '../types/domains/auth'
import {
	UpdateUserProfileInput,
	UpdatePasswordInput,
	UpdatePhoneInput
} from './../types/forms/auth'
import Common from './Common'

export default class Auth extends Common {
	private redirectToName = 'redirect-to'
	public AuthUser: AuthUser | undefined = undefined
	public UpdateUserProfileForm: UpdateUserProfileInput | undefined
	public UpdatePasswordForm: UpdatePasswordInput | undefined
	public SendPhoneVerificationForm: UpdatePhoneInput | undefined

	async getRedirectToRoute () {
		const value = localStorage.getItem(this.redirectToName)
		if (value) localStorage.removeItem(this.redirectToName)
		return value ?? '/'
	}

	async setRedirectToRoute (value: string) {
		localStorage.setItem(this.redirectToName, value)
	}

	public UpdateUserProfile = (
		formIsValid: boolean,
		uploadProgress: Parameters<typeof $api.auth.user.updateUserProfile>[1],
		showLoader = true,
	) => {
		if (formIsValid && this.UpdateUserProfileForm) {
			if (showLoader) {
				Logic.Common.showLoading()
			}

			return $api.auth.user
				.updateUserProfile(this.UpdateUserProfileForm, uploadProgress)
				.then((response) => {
					this.AuthUser = response.data
					Logic.Users.GetUserProfile()
					Logic.Common.hideLoading()
					return response.data
				})
				.catch(() => {
					Logic.Common.hideLoading()
					// error handler
				})
		}
	}

	public UpdatePassword = (formIsValid: boolean) => {
		if (formIsValid && this.UpdatePasswordForm) {
			Logic.Common.showLoading()
			return $api.auth.passwords
				.updatePassword(this.UpdatePasswordForm)
				.then((response) => {
					Logic.Common.hideLoading()
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					throw error
				})
		}
	}

	public SendPhoneVerification = (formIsValid: boolean) => {
		if (formIsValid && this.SendPhoneVerificationForm) {
			Logic.Common.showLoading()
			return $api.auth.phone
				.sendVerifyPhone(this.SendPhoneVerificationForm)
				.finally(() => {
					Logic.Common.hideLoading()
				})
		}
	}

	public VerifyPhone = (token: string) => {
		Logic.Common.showLoading()
		return $api.auth.phone
			.verifyPhone({ token })
			.then((response) => {
				this.AuthUser = response.data.user
				Logic.Users.GetUserProfile()
				saveTokens(response.data)
			})
			.finally(() => {
				Logic.Common.hideLoading()
			})
	}
}
