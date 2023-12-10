import { Course, Logic, Quiz } from 'sofa-logic'
import { computed, onMounted, ref } from 'vue'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const recentStore = {
	materials: ref<(Quiz | Course)[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
}

export const useRecent = () => {
	const fetchMaterials = async () => {
		try {
			await recentStore.setError('')
			await recentStore.setLoading(true)
			const materials = await Logic.Study.GetRecentMaterials()
			recentStore.materials.value = materials
			recentStore.fetched.value = true
		} catch (e) {
			await recentStore.setError(e)
		}
		await recentStore.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!recentStore.loading.value) await fetchMaterials()
	})

	const quizzes = computed(() => recentStore.materials.value
		.filter((m) => m.__type === 'QuizEntity') as Quiz[])
	const courses = computed(() => recentStore.materials.value
		.filter((m) => m.__type === 'CourseEntity') as Course[])

	return { ...recentStore, quizzes, courses }
}