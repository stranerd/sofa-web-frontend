/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, ref, watch } from 'vue'
import { Refable, useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'
import { useFilesInList } from '../study/files-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { useSchedulesInList } from './schedules'
import {
	ClassEntity,
	ClassLesson,
	ClassLessonable,
	CurriculumView,
	LessonCurriculumFactory,
	LessonFactory,
	LessonsUseCases,
} from '@modules/organizations'
import { QuizModes } from '@modules/study'

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

export const useCurriculumViewToggle = () => {
	const curriculumView = ref(CurriculumView.list)
	const curriculumViewIcon = computed((): IconName => (curriculumView.value === CurriculumView.list ? 'grid_view' : 'list_view'))
	const toggleView = () => {
		curriculumView.value = curriculumView.value === CurriculumView.list ? CurriculumView.grid : CurriculumView.list
	}

	return { curriculumView, curriculumViewIcon, toggleView }
}

export const useLessonCurriculum = (classInst: ClassEntity, curr: Refable<ClassLesson['curriculum']>) => {
	// const curr = computed((): ClassLesson['curriculum'] => [
	// 	{
	// 		label: 'Section 1',
	// 		items: [
	// 			{ type: ClassLessonable.quiz, id: '6570f0fed93c0c9b0b4df5d0', quizMode: QuizModes.test },
	// 			{ type: ClassLessonable.schedule, id: '65ae74a8a937bae0ac5d8db7' },
	// 			{ type: ClassLessonable.schedule, id: '65ae7391a937bae0ac5d8d5a' },
	// 		],
	// 	},
	// 	{
	// 		label: 'Section 2',
	// 		items: [
	// 			{ type: ClassLessonable.quiz, id: '655c6ebf1df1665d9b00a771', quizMode: QuizModes.practice },
	// 			{ type: ClassLessonable.schedule, id: '65ae739da937bae0ac5d8d6a' },
	// 			{ type: ClassLessonable.quiz, id: '64fbbed96f1695149cedcf41', quizMode: QuizModes.test },
	// 		],
	// 	},
	// ])
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
			return { label: c.label, items }
		}),
	)
	return { quizzes, files, schedules, curriculum }
}

export const useUpdateCurriculum = (classInst: ClassEntity, lesson: Refable<ClassLesson | undefined>) => {
	const factory = new LessonCurriculumFactory()
	if (lesson.value) factory.loadEntity(lesson.value.curriculum)

	watch(lesson, (lesson) => {
		factory.loadEntity(lesson?.curriculum ?? [])
	})

	const {
		asyncFn: updateCurriculum,
		loading,
		error,
	} = useAsyncFn(async () => {
		if (!lesson.value) return false
		const updatedClass = await LessonsUseCases.updateCurriculum(classInst.organizationId, classInst.id, lesson.value.id, factory)
		const updatedLesson = updatedClass.getLesson(lesson.value.id)
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
