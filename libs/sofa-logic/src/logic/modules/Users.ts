import { Logic } from '..'
import { $api } from '../../services'
import { QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import { SingleUser, TutorRequest, UserVerification } from '../types/domains/users'
import { CreateTutorRequestForm, CreateVerificationInput, VerificationStatusInput } from '../types/forms/users'
import Common from './Common'

export default class Users extends Common {
	public AllUsers: Paginated<SingleUser> | undefined
	public Verification: UserVerification | undefined
	public Verifications: Paginated<UserVerification> | undefined
	public AllTutorRequests: Paginated<TutorRequest> | undefined
	public SingleTutorRequest: TutorRequest | undefined

	public CreateVerificationForm: CreateVerificationInput | undefined
	public UpdateUserVerificationForm: VerificationStatusInput | undefined
	public CreateTutorRequestForm: CreateTutorRequestForm | undefined

	public GetTutorRequest = (id: string) => {
		return $api.users.tutor_request.get(id).then((response) => {
			this.SingleTutorRequest = response.data
		})
	}

	public GetTutorRequests = (filters: QueryParams, isPersonal: boolean) => {
		return $api.users.tutor_request.fetch(filters).then((response) => {
			this.AllTutorRequests = response.data
			if (isPersonal) {
				this.SingleTutorRequest = this.AllTutorRequests.results.length ? this.AllTutorRequests.results[0] : undefined
			}
		})
	}

	public GetVerifications = (filters: QueryParams) => {
		return $api.users.verifications.fetch(filters).then((response) => {
			this.Verifications = response.data
		})
	}

	public GetVerification = (id: string) => {
		return $api.users.verifications.get(id).then((response) => {
			this.Verification = response.data
		})
	}

	public CreateVerification = async (formIsValid: boolean, useLoader = true) => {
		if (formIsValid && this.CreateVerificationForm) {
			if (useLoader) {
				Logic.Common.showLoading()
			}

			return $api.users.verifications
				.createVerification(this.CreateVerificationForm)
				.then((response) => {
					this.Verification = response.data
					if (useLoader) {
						Logic.Common.hideLoading()
					}
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(error.response.data[0].message)
				})
		}
	}

	public UpdateUserVerification = (formIsValid: boolean) => {
		if (formIsValid && this.UpdateUserVerificationForm) {
			return $api.users.verifications.updateUserVerification(this.UpdateUserVerificationForm).then().catch()
		}
	}

	public CreateTutorRequest = () => {
		if (this.CreateTutorRequestForm) {
			Logic.Common.showLoading()
			return $api.users.tutor_request
				.post(null, this.CreateTutorRequestForm, () => {})
				.then((response) => {
					this.SingleTutorRequest = response.data
					Logic.Common.hideLoading()
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					throw error
				})
		}
	}

	public AcceptOrRejectTutorRequest = (requestId: string, status: boolean) => {
		return $api.users.tutor_request.acceptOrRejectTutorRequest(requestId, status).then((response) => {
			return response.data
		})
	}

	public SendFeedbackMessage = (message: string) => {
		Logic.Common.showLoading()
		return $api.users.meta
			.sendMessage(message)
			.then((response) => {
				Logic.Common.hideLoading()

				Logic.Common.showAlert({
					message: 'Your feedback was sent successfully',
					type: 'success',
				})

				return response.data
			})
			.catch(() => {
				Logic.Common.hideLoading()
			})
	}
}
