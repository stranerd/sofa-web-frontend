import { AxiosResponse } from 'axios'
import { AuthUser } from '../../logic/types/domains/auth'
import { ModelApiService } from '../common/ModelService'
import {
	UpdateUserProfileInput,
} from './../../logic/types/forms/auth'

export default class UserApi extends ModelApiService {
	constructor() {
		super('auth/user')
	}

	public async updateUserProfile(
		data: UpdateUserProfileInput,
		onUploadProgress: Parameters<typeof this.put>[2],
	) {
		try {
			const response: AxiosResponse<AuthUser> = await this.put(
				this.getUrl(),
				'',
				data,
				onUploadProgress,
			)
			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
