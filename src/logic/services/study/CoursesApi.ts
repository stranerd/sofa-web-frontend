import { CourseEntity } from '@modules/study'
import { CourseFromModel } from '@modules/study/data/models/courses'
import { AxiosResponse } from 'axios'
import { AddItemToCourseInput, UpdateCourseSectionsInput } from '../../logic/types/forms/study'
import { ModelApiService } from '../common/ModelService'

export default class CoursesApi extends ModelApiService<CourseFromModel, CourseEntity> {
	constructor() {
		super('study/courses')
	}

	mapper = (data: CourseFromModel) => new CourseEntity(data)

	public async similarCourses(courseId: string) {
		try {
			const response: AxiosResponse<CourseFromModel[]> = await this.axiosInstance.get(this.getUrl() + `/${courseId}/similar`)

			return {
				...response,
				data: response.data.map(this.mapper),
			}
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async moveItemIntoCourse(data: AddItemToCourseInput) {
		try {
			const response: AxiosResponse<CourseFromModel> = await this.axiosInstance.post(this.getUrl() + `/${data.id}/move`, data)

			return {
				...response,
				data: this.mapper(response.data),
			}
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async updateCourseSections(data: UpdateCourseSectionsInput) {
		try {
			const response: AxiosResponse<CourseFromModel> = await this.axiosInstance.post(this.getUrl() + `/${data.id}/sections`, data)

			return {
				...response,
				data: this.mapper(response.data),
			}
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async publishCourse(courseId: string) {
		try {
			const response: AxiosResponse<CourseFromModel> = await this.axiosInstance.post(this.getUrl() + `/${courseId}/publish`)

			return {
				...response,
				data: this.mapper(response.data),
			}
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async freezeCourse(courseId: string) {
		try {
			const response: AxiosResponse<CourseFromModel> = await this.axiosInstance.post(this.getUrl() + `/${courseId}/freeze`)

			return {
				...response,
				data: this.mapper(response.data),
			}
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
