import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'
import { CourseEntity, FileEntity, QuizEntity } from '@modules/study'
import { QuizFromModel } from '@modules/study/data/models/quizzes'
import { FileFromModel } from '@modules/study/data/models/files'
import { CourseFromModel } from '@modules/study/data/models/courses'

class CoursesApi extends ModelApiService<CourseFromModel, CourseEntity> {
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

class QuizzesApi extends ModelApiService<QuizFromModel, QuizEntity> {
	constructor() {
		super('study/quizzes')
	}

	mapper = (data: QuizFromModel) => new QuizEntity(data)

	public async similarQuizzes(quizId: string) {
		try {
			const response: AxiosResponse<QuizFromModel[]> = await this.axiosInstance.get(this.getUrl() + `/${quizId}/similar`)

			return {
				...response,
				data: response.data.map(this.mapper),
			}
		} catch (err) {
			this.handleErrors(err)
		}
	}
}

export default class FilesApi extends ModelApiService<FileFromModel, FileEntity> {
	constructor() {
		super('study/files')
	}

	mapper = (data: FileFromModel) => new FileEntity(data)
}

export const StudyApi = {
	course: new CoursesApi(),
	file: new FilesApi(),
	quiz: new QuizzesApi(),
}
