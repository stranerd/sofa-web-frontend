import { AxiosResponse } from 'axios'
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
}
