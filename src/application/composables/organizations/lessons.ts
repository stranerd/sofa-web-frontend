import { ClassEntity, ClassLesson, ClassLessonable, LessonCurriculumFactory, LessonFactory, LessonsUseCases } from '@modules/organizations'
import { computed } from 'vue'
import { Refable, useAsyncFn } from '../core/hooks'
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

export const useLessonCurriculum = (classInst: ClassEntity, curr: Refable<ClassLesson['curriculum']>) => {
	const quizIds = computed(() =>
		curr.value.flatMap((c) => c.items.filter((item) => item.type === ClassLessonable.quiz).map((item) => item.id)),
	)
	const fileIds = computed(() =>
		curr.value.flatMap((c) => c.items.filter((item) => item.type === ClassLessonable.file).map((item) => item.id)),
	)
	const scheduleIds = computed(() =>
		curr.value.flatMap((c) => c.items.filter((item) => item.type === ClassLessonable.schedule).map((item) => item.id)),
	)

	const { quizzes } = useQuizzesInList(quizIds, true)
	const { files } = useFilesInList(fileIds, true)
	const { schedules } = useSchedulesInList(classInst.organizationId, classInst.id, scheduleIds, true)

	const curriculum = computed(() =>
		curr.value.map((c) => {
			const items = c.items
				.map((item) => {
					if (item.type === ClassLessonable.file) {
						const file = files.value.find((f) => f.id === item.id)
						if (file) return { ...item, file }
					}
					if (item.type === ClassLessonable.quiz) {
						const quiz = quizzes.value.find((q) => q.id === item.id)
						if (quiz) return { ...item, quiz }
					}
					if (item.type === ClassLessonable.schedule) {
						const schedule = schedules.value.find((s) => s.id === item.id)
						if (schedule) return { ...item, schedule }
					}
				})
				.filter(Boolean)
			return { ...c, items }
		}),
	)

	return { quizzes, files, schedules, curriculum }
}

export const useUpdateCurriculum = (classInst: ClassEntity, lesson: ClassLesson) => {
	const factory = new LessonCurriculumFactory()
	factory.loadEntity(lesson.curriculum)

	const {
		asyncFn: updateCurriculum,
		loading,
		error,
	} = useAsyncFn(async () => {
		const updatedClass = await LessonsUseCases.updateCurriculum(classInst.organizationId, classInst.id, lesson.id, factory)
		const updatedLesson = updatedClass.getLesson(lesson.id)
		factory.loadEntity(updatedLesson?.curriculum ?? [])
		return true
	})

	const { curriculum: extendedCurriculum } = useLessonCurriculum(
		classInst,
		computed(() => factory.factories),
	)

	return {
		factory,
		loading,
		error,
		extendedCurriculum,
		updateCurriculum,
	}
}
