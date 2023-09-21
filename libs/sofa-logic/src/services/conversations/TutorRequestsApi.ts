import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'

export default class ReviewsApi extends ModelApiService {
  constructor() {
    super('conversations/tutorRequests')
  }

  public async acceptTutorRequest(tutorRequestId: string, accept: boolean) {
    try {
      const response: AxiosResponse<boolean> = await this.axiosInstance.put(
        this.getUrl() + `/${tutorRequestId}/accept`,
        {
          accept,
        },
      )
      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }
}
