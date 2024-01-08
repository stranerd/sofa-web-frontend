import { CourseEntity, QuizEntity, StudyKeys, StudyUseCases } from '@modules/study'
import { Course, Quiz } from 'sofa-logic'
import { Ref, computed, onMounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useMyPurchases } from '../payment/purchases'

const store: Record<
	string,
	{
		materials: Ref<(QuizEntity | CourseEntity)[]>
		fetched: Ref<boolean>
	} & ReturnType<typeof useLoadingHandler> &
		ReturnType<typeof useErrorHandler>
> = {}

export const useMyStudy = (key: StudyKeys, alwaysRefetch = false) => {
	store[key] ??= {
		materials: ref([]),
		fetched: ref(false),
		...useLoadingHandler(),
		...useErrorHandler(),
	}

	const fetchMaterials = async () => {
		try {
			await store[key].setError('')
			await store[key].setLoading(true)
			const materials = await StudyUseCases.get(key)
			store[key].materials.value = materials
			store[key].fetched.value = true
		} catch (e) {
			await store[key].setError(e)
		}
		await store[key].setLoading(false)
	}

	onMounted(async () => {
		if ((!store[key].fetched.value || alwaysRefetch) && !store[key].loading.value) await fetchMaterials()
	})

	return { ...store[key] }
}

export const useRecent = () => {
	const recent = useMyStudy('recent', true)

	const quizzes = computed(() => recent.materials.value.filter((m) => m instanceof QuizEntity) as QuizEntity[])
	const courses = computed(() => recent.materials.value.filter((m) => m instanceof CourseEntity) as CourseEntity[])

	return { quizzes, courses }
}

export const useHasAccess = () => {
	const { user } = useAuth()
	const { purchasesCoursesIds } = useMyPurchases()
	const hasAccess = computed(() => (m: Quiz | QuizEntity | CourseEntity | Course | null) => {
		if (!m) return false
		const material = m as any
		const isQuiz = material.__type === 'QuizEntity'
		return [
			isQuiz && !material.courseId,
			purchasesCoursesIds.value.includes(isQuiz ? material.courseId : material.id),
			material.user.id === user.value?.id,
			isQuiz && material.access.members.includes(user.value?.id),
			material.user.roles?.isOfficialAccount && user.value?.roles.isSubscribed,
			user.value?.account.organizationsIn.find((o) => o.id === material.user.id) && material.user.roles.isSubscribed,
		].some((v) => v)
	})

	return { hasAccess }
}
