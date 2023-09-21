import {
  CreateVerificationInput,
  VerificationStatusInput,
} from './../../logic/types/forms/users'
import { UserVerification } from './../../logic/types/domains/users'
import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from '../common/ReadOnlyService'
import { Country } from '../../logic/types/domains/common'

export default class VerificationsApi extends ReadOnlyApiService {
  constructor() {
    super('users/verifications')
  }

  public async createVerification(data: CreateVerificationInput) {
    try {
      const response: AxiosResponse<UserVerification> = await this.axiosInstance.post(
        this.getUrl(),
        data,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async updateUserVerification(data: VerificationStatusInput) {
    try {
      const response: AxiosResponse<boolean> = await this.axiosInstance.post(
        this.getUrl() + `/${data.id}/accept`,
        data,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async getCountriesAndStates() {
    try {
      const response: AxiosResponse<{
        data: Country[]
      }> = await this.axiosInstance.get(
        'https://countriesnow.space/api/v0.1/countries/states',
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }
}
