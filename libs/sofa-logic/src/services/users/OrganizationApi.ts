import { OrganisationMember } from './../../logic/types/forms/users'
import { SingleUser } from './../../logic/types/domains/users'
import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from '../common/ReadOnlyService'
import { Paginated } from '../../logic/types/domains/common'
import { QueryParams } from '../../logic/types/common'

export default class OrganizationApi extends ReadOnlyApiService {
  constructor() {
    super('users/organizations')
  }

  public async getOrganizationMembers(
    organisationUserId: string,
    filters: QueryParams = {},
  ) {
    try {
      const response: AxiosResponse<Paginated<
        OrganisationMember
      >> = await this.axiosInstance.get(
        this.getUrl() + `/${organisationUserId}/members`,
        {
          params: filters,
        },
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async getOrganizationMember(
    organisationUserId: string,
    studentEmail: string,
  ) {
    try {
      const response: AxiosResponse<OrganisationMember> = await this.axiosInstance.get(
        this.getUrl() + `/${organisationUserId}/members/${studentEmail}`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async addOrganizationMembers(
    organisationUserId: string,
    studentEmails: string[],
  ) {
    try {
      const response: AxiosResponse<
        OrganisationMember[]
      > = await this.axiosInstance.post(
        this.getUrl() + `/${organisationUserId}/members`,
        {
          emails: studentEmails,
        },
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async requestToJoinOrganization(
    organisationUserId: string,
    code: string,
  ) {
    try {
      const response: AxiosResponse<OrganisationMember> = await this.axiosInstance.post(
        this.getUrl() + `/${organisationUserId}/members/request`,
        {
          code,
        },
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async leaveOrganization(organisationUserId: string) {
    try {
      const response: AxiosResponse<Boolean> = await this.axiosInstance.delete(
        this.getUrl() + `/${organisationUserId}/members/leave`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async removeOrganizationMember(
    organisationUserId: string,
    studentEmail: string,
  ) {
    try {
      const response: AxiosResponse<Boolean> = await this.axiosInstance.delete(
        this.getUrl() + `/${organisationUserId}/members`,
        {
          data: {
            email: studentEmail,
          },
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
