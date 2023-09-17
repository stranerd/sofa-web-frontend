import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'
import { Question } from '../../logic/types/domains/study'
import { Test } from '../../logic/types/domains/plays'

export default class TestApi extends ModelApiService {
  constructor() {
    super('plays/tests')
  }

  public async getTestQuestions(testId: string) {
    try {
      const response: AxiosResponse<Question[]> = await this.axiosInstance.get(
        this.getUrl() + `/${testId}/questions`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async endTest(testId: string) {
    try {
      const response: AxiosResponse<Test> = await this.axiosInstance.post(
        this.getUrl() + `/${testId}/end`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }
}
