import CoursesApi from './CoursesApi'
import FilesApi from './FilesApi'
import QuizzesApi from './QuizzesApi'

export const StudyApi = {
	course: new CoursesApi(),
	file: new FilesApi(),
	quiz: new QuizzesApi(),
}
