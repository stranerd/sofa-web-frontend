import { AxiosResponse } from 'axios'
import { QueryParams } from '../../logic/types/common'
import { Paginated } from '../../logic/types/domains/common'
import { ReadOnlyApiService } from '../common/ReadOnlyService'
import { OrganizationMember } from './../../logic/types/forms/users'

export default class OrganizationApi extends ReadOnlyApiService {
  constructor() {
    super('users/organizations')
  }

  public async getOrganizationMembers(
    organizationUserId: string,
    filters: QueryParams = {},
  ) {
    try {
      const response: AxiosResponse<Paginated<
        OrganizationMember
      >> = await this.axiosInstance.get(
        this.getUrl() + `/${organizationUserId}/members`,
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
    organizationUserId: string,
    studentEmail: string,
  ) {
    try {
      const response: AxiosResponse<OrganizationMember> = await this.axiosInstance.get(
        this.getUrl() + `/${organizationUserId}/members/${studentEmail}`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async addOrganizationMembers(
    organizationUserId: string,
    studentEmails: string[],
  ) {
    try {
      const response: AxiosResponse<
        OrganizationMember[]
      > = await this.axiosInstance.post(
        this.getUrl() + `/${organizationUserId}/members`,
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
    organizationUserId: string,
    code: string,
  ) {
    try {
      const response: AxiosResponse<OrganizationMember> = await this.axiosInstance.post(
        this.getUrl() + `/${organizationUserId}/members/request`,
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

  public async leaveOrganization(organizationUserId: string) {
    try {
      const response: AxiosResponse<Boolean> = await this.axiosInstance.delete(
        this.getUrl() + `/${organizationUserId}/members/leave`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async removeOrganizationMember(
    organizationUserId: string,
    studentEmail: string,
  ) {
    try {
      const response: AxiosResponse<Boolean> = await this.axiosInstance.delete(
        this.getUrl() + `/${organizationUserId}/members`,
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
