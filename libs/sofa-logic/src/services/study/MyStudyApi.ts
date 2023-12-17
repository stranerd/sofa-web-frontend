import { AxiosResponse } from 'axios'
import { BaseApiService } from '../common/BaseService'
import { Course, Quiz } from '../../logic/types/domains/study'

export default class MyStudyApi extends BaseApiService {
	constructor() {
		super('study/my')
	}

	public async getRecentMaterials() {
		try {
			const response: AxiosResponse<
        (Course | Quiz)[]
      > = await this.axiosInstance.get(this.getUrl() + '/recent')

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getByMyOrgsMaterials() {
		try {
			const response: AxiosResponse<
        (Course | Quiz)[]
      > = await this.axiosInstance.get(this.getUrl() + '/byMyOrgs')

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getSuggestedMaterials() {
		try {
			const response: AxiosResponse<
        (Course | Quiz)[]
      > = await this.axiosInstance.get(this.getUrl() + '/suggested')

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getLatestMaterials() {
		try {
			const response: AxiosResponse<
        (Course | Quiz)[]
      > = await this.axiosInstance.get(this.getUrl() + '/latest')

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getPopularMaterials() {
		try {
			const response: AxiosResponse<
        (Course | Quiz)[]
      > = await this.axiosInstance.get(this.getUrl() + '/popular')

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getRatedMaterials() {
		try {
			const response: AxiosResponse<
        (Course | Quiz)[]
      > = await this.axiosInstance.get(this.getUrl() + '/rated')

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
