import { LessonFactory, LessonsUseCases } from '@modules/organizations'
import { useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'
// import { useQuizzesInList } from '../study/quizzes-list'
// import { useFilesInList } from '../study/files-list'
// import { useSchedulesInList } from './schedules'

export const useCreateLesson = (organizationId: string, classId: string) => {
	const factory = new LessonFactory()
	const {
		asyncFn: createLesson,
		loading,
		error,
	} = useAsyncFn(async () => {
		await LessonsUseCases.add(organizationId, classId, factory)
		factory.reset()
		useModals().organizations.createLesson.close()
	})
	return {
		factory,
		loading,
		error,
		createLesson,
	}
}

// export const useLessonCurriculum = (lesson: ClassLesson) => {}
