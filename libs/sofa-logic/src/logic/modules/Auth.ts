import { saveTokens } from '@utils/tokens'
import { Logic } from '..'
import { $api } from '../../services'
import { AuthUser } from '../types/domains/auth'
import { UpdatePhoneInput } from './../types/forms/auth'
import Common from './Common'

export default class Auth extends Common {
	private redirectToName = 'redirect-to'
	public AuthUser: AuthUser | undefined = undefined
	public SendPhoneVerificationForm: UpdatePhoneInput | undefined

	async getRedirectToRoute () {
		const value = localStorage.getItem(this.redirectToName)
		if (value) localStorage.removeItem(this.redirectToName)
		return value ?? '/'
	}

	async setRedirectToRoute (value: string) {
		localStorage.setItem(this.redirectToName, value)
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
