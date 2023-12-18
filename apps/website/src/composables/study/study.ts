import { Course, Logic, Quiz } from 'sofa-logic'
import { Ref, computed, onMounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useMyPurchases } from '../payment/purchases'

const store: Record<string, {
	materials: Ref<(Quiz | Course)[]>,
	fetched: Ref<boolean>
} & ReturnType<typeof useLoadingHandler> & ReturnType<typeof useErrorHandler>> = {}

const handlers = {
	recent: Logic.Study.GetRecentMaterials,
	popular: Logic.Study.GetPopularMaterials,
	rated: Logic.Study.GetRatedMaterials,
	suggested: Logic.Study.GetSuggestedMaterials,
	latest: Logic.Study.GetLatestMaterials,
	myOrgs: Logic.Study.GetByMyOrgsMaterials
}

export const useMyStudy = (key: keyof typeof handlers, alwaysRefetch = false) => {
	store[key] ??= {
		materials: ref([]),
		fetched: ref(false),
		...useLoadingHandler(),
		...useErrorHandler(),
	}

	const fetchMaterials = async () => {
		const handler = handlers[key]
		if (!handler) return
		try {
			await store[key].setError('')
			await store[key].setLoading(true)
			const materials = await handler()
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

	const quizzes = computed(() => recent.materials.value
		.filter((m) => m.__type === 'QuizEntity') as Quiz[])
	const courses = computed(() => recent.materials.value
		.filter((m) => m.__type === 'CourseEntity') as Course[])

	return { quizzes, courses }
}

export const useHasAccess = () => {
	const { user } = useAuth()
	const { purchasesCoursesIds } = useMyPurchases()
	const hasAccess = computed(() => (material: Quiz | Course | null) => {
		if (!material) return false
		return [
			material.__type === 'QuizEntity' && !material.courseId,
			purchasesCoursesIds.value.includes(material.__type === 'QuizEntity' ? material.courseId : material.id),
			material.user.id === user.value?.id,
			material.__type === 'QuizEntity' && material.access.members.includes(user.value?.id),
			material.user.roles?.isOfficialAccount && user.value?.roles.isSubscribed,
			user.value?.account.organizationsIn.find((o) => o.id === material.user.id) && material.user.roles.isSubscribed
		].some((v) => v)
	})

	return { hasAccess }
}