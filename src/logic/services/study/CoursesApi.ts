import { AxiosResponse } from 'axios'
import { AddItemToCourseInput, UpdateCourseSectionsInput } from '../../logic/types/forms/study'
import { ModelApiService } from '../common/ModelService'
import { CourseFromModel } from '@modules/study/data/models/courses'
import { CourseEntity } from '@modules/study'

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
		}
	}
}
