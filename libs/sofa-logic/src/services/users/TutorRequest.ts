import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'

export default class TutorRequestApi extends ModelApiService {
  constructor() {
    super('users/tutorRequests')
  }

  public async acceptOrRejectTutorRequest(requestId: string, status: boolean) {
    try {
      const response: AxiosResponse<boolean> = await this.axiosInstance.put(
        this.getUrl() + `/${requestId}/accept`,
        {
          accept: status,
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
