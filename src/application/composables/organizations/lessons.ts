import { ClassEntity, ClassLesson, ClassLessonable, LessonCurriculumFactory, LessonFactory, LessonsUseCases } from '@modules/organizations'
import { Ref, computed, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'
import { useFilesInList } from '../study/files-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { useSchedulesInList } from './schedules'

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

export const useLessonCurriculum = (classInst: ClassEntity, lesson: ClassLesson) => {
	const quizIds = computed(() =>
		lesson.curriculum.flatMap((c) => c.items.filter((item) => item.type === ClassLessonable.quiz).map((item) => item.id)),
	)
	const fileIds = computed(() =>
		lesson.curriculum.flatMap((c) => c.items.filter((item) => item.type === ClassLessonable.file).map((item) => item.id)),
	)
	const scheduleIds = computed(() =>
		lesson.curriculum.flatMap((c) => c.items.filter((item) => item.type === ClassLessonable.schedule).map((item) => item.id)),
	)

	const { quizzes } = useQuizzesInList(quizIds, true)
	const { files } = useFilesInList(fileIds, true)
	const { schedules } = useSchedulesInList(classInst.organizationId, classInst.id, scheduleIds, true)

	return { quizzes, files, schedules }
}

export const useUpdateCurriculum = (classInst: ClassEntity, lesson: ClassLesson) => {
	const factories: Ref<LessonCurriculumFactory[]> = ref([])

	const resetFactories = (lesson: ClassLesson) => {
		factories.value = Array.from({ length: lesson.curriculum.length }, (_, i) => {
			const f = new LessonCurriculumFactory()
			f.loadEntity(lesson.curriculum[i])
			return f
		})
	}

	resetFactories(lesson)

	const addNewSection = () => {
		factories.value.push(new LessonCurriculumFactory())
	}

	const {
		asyncFn: updateCurriculum,
		loading,
		error,
	} = useAsyncFn(async () => {
		const updatedClass = await LessonsUseCases.updateCurriculum(classInst.organizationId, classInst.id, lesson.id, factories.value)
		const updatedLesson = updatedClass.getLesson(lesson.id)
		if (updatedLesson) resetFactories(updatedLesson)
		return true
	})

	return {
		factories,
		loading,
		error,
		addNewSection,
		updateCurriculum,
	}
}
