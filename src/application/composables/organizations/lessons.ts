import { computed, ref, watch } from 'vue'
import { Refable, useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { useFilesInList } from '../study/files-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { useSchedulesInList } from './schedules'
import {
	ClassEntity,
	ClassLesson,
	ClassLessonable,
	CurriculumView,
	ExtendedCurriculum,
	LessonCurriculumFactory,
	LessonFactory,
	LessonsUseCases,
} from '@modules/organizations'
import { FileType } from '@modules/study'
import { Logic } from 'sofa-logic'

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

	const curriculum = computed<ExtendedCurriculum>(() =>
		curr.value.map((c) => {
			const items = c.items
				.map((item) => {
					if (item.type === ClassLessonable.file) {
						const file = files.value.find((f) => f.id === item.id)
						if (file)
							return {
								...item,
								file,
								image: file.picture,
								title: file.title,
								icon:
									file.type === FileType.document
										? ('file' as IconName)
										: file.type === FileType.image
											? ('image-course' as IconName)
											: ('video-course' as IconName),
								info: file.type,
							}
					}
					if (item.type === ClassLessonable.quiz) {
						const quiz = quizzes.value.find((q) => q.id === item.id)
						if (quiz)
							return {
								...item,
								quiz,
								image: quiz.picture,
								title: quiz.title,
								icon: 'quiz' as IconName,
								info: `${item.quizMode} - ${Logic.Common.formatNumber(quiz.questions.length)} ${Logic.Common.pluralize(quiz.questions.length, 'question', 'questions')}`,
							}
					}
					if (item.type === ClassLessonable.schedule) {
						const schedule = schedules.value.find((s) => s.id === item.id)
						if (schedule)
							return {
								...item,
								schedule,
								image: '/images/default.svg',
								title: schedule.title,
								icon: 'translation' as IconName,
								info: schedule.timeRange,
							}
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
	const { setMessage } = useSuccessHandler()
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
		await setMessage('Curriculum updated successfully!')
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

export const useJoinLesson = () => {
	const {
		asyncFn: joinLesson,
		loading,
		error,
	} = useAsyncFn(async (classInst: ClassEntity, lessonId: string, join: boolean) => {
		await LessonsUseCases.join(classInst.organizationId, classInst.id, lessonId, join)
	})
	return { joinLesson, loading, error }
}
