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

export const useCreateLesson = (organizationId: string, classId: string) => {
	const factory = new LessonFactory()
	const {
		asyncFn: createLesson,
		loading,
		error,
	} = useAsyncFn(async () => {
		const lesson = await LessonsUseCases.add(organizationId, classId, factory)
		factory.reset()
		useModals().organizations.createLesson.close()
		return lesson
	})
	return {
		factory,
		loading,
		error,
		createLesson,
	}
}

export const useUpdateLesson = (classInst: ClassEntity, lesson: ClassLesson) => {
	const factory = new LessonFactory()
	factory.loadEntity(lesson)

	const {
		asyncFn: updateLesson,
		loading,
		error,
	} = useAsyncFn(async () => {
		const updatedClass = await LessonsUseCases.update(classInst.organizationId, classInst.id, lesson.id, factory)
		factory.reset()
		useModals().organizations.editLesson.close()
		return updatedClass.getLesson(lesson.id)
	})

	return { error, loading, factory, updateLesson }
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

	const { quizzes } = useQuizzesInList(quizIds)
	const { files } = useFilesInList(fileIds)
	const { schedules } = useSchedulesInList(classInst.organizationId, classInst.id, scheduleIds)

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
								info: `${item.quizMode} - ${$utils.formatNumber(quiz.questions.length)} ${$utils.pluralize(quiz.questions.length, 'question', 'questions')}`,
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
	} = useAsyncFn(async (classInst: ClassEntity, original: string[], selected: string[]) => {
		const left = original.filter((id) => !selected.includes(id))
		const joined = selected.filter((id) => !original.includes(id))
		await Promise.all([
			...left.map((id) => LessonsUseCases.join(classInst.organizationId, classInst.id, id, false)),
			...joined.map((id) => LessonsUseCases.join(classInst.organizationId, classInst.id, id, true)),
		])
		return true
	})
	return { joinLesson, loading, error }
}
