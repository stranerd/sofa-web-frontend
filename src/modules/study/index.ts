import { CourseRepository } from './data/repositories/courses'
import { FileRepository } from './data/repositories/files'
import { FolderRepository } from './data/repositories/folders'
import { QuestionRepository } from './data/repositories/questions'
import { QuizRepository } from './data/repositories/quizzes'
import { StudyRepository } from './data/repositories/study'
import { CoursesUseCase } from './domain/usecases/courses'
import { FilesUseCase } from './domain/usecases/files'
import { FoldersUseCase } from './domain/usecases/folders'
import { QuestionsUseCase } from './domain/usecases/questions'
import { QuizzesUseCase } from './domain/usecases/quizzes'
import { StudyUseCase } from './domain/usecases/study'

export const CoursesUseCases = new CoursesUseCase(CourseRepository.getInstance)
export const FilesUseCases = new FilesUseCase(FileRepository.getInstance)
export const FoldersUseCases = new FoldersUseCase(FolderRepository.getInstance)
export const QuestionsUseCases = new QuestionsUseCase(QuestionRepository.getInstance)
export const QuizzesUseCases = new QuizzesUseCase(QuizRepository.getInstance)
export const StudyUseCases = new StudyUseCase(StudyRepository.getInstance)

export { CourseEntity } from './domain/entities/courses'
export { FileEntity } from './domain/entities/files'
export { FolderEntity } from './domain/entities/folders'
export { QuestionEntity } from './domain/entities/questions'
export { QuizEntity } from './domain/entities/quizzes'
export { FileFactory } from './domain/factories/files'
export { FolderFactory } from './domain/factories/folders'
export { QuestionFactory } from './domain/factories/questions'
export { QuizFactory } from './domain/factories/quizzes'
export { DraftStatus, FileType, FolderSaved, QuestionTypes } from './domain/types'
export type { CoursableAccess, QuestionAnswer, StudyKeys } from './domain/types'

export type { QuestionFromModel } from './data/models/questions'
