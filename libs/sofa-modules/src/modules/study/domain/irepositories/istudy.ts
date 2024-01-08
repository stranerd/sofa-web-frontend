import { CourseEntity } from '../entities/courses'
import { QuizEntity } from '../entities/quizzes'
import { StudyKeys } from '../types'

export interface IStudyRepository {
	get: (key: StudyKeys) => Promise<(CourseEntity | QuizEntity)[]>
}
