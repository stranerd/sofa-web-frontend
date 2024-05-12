import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { Refable, useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'
import { ClassEntity, ClassLesson, LessonCurriculumFactory, LessonFactory, LessonsUseCases } from '@modules/organizations'

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

export const useUpdateCurriculum = (lesson: Refable<ClassLesson | null>) => {
	const factory = new LessonCurriculumFactory()
	const router = useRouter()
	if (lesson.value) factory.loadEntity(lesson.value.curriculum)

	watch(lesson, (lesson) => {
		factory.loadEntity(lesson?.curriculum ?? [])
	})

	const {
		asyncFn: updateCurriculum,
		loading,
		error,
	} = useAsyncFn(async (classInst: ClassEntity) => {
		if (!lesson.value) return false
		const updatedClass = await LessonsUseCases.updateCurriculum(classInst.organizationId, classInst.id, lesson.value.id, factory)
		const updatedLesson = updatedClass.getLesson(lesson.value.id)
		factory.loadEntity(updatedLesson?.curriculum ?? [])
		await router.push(`${updatedClass.pageLink}/courses/${updatedLesson?.id}`)
		return true
	})

	return {
		factory,
		loading,
		error,
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
