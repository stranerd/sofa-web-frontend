import { Ref, computed, onMounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'
import { createStore } from '../core/store'
import { useMyPurchases } from '../payment/purchases'
import { CourseEntity, CoursesUseCases, QuizEntity, QuizzesUseCases, StudyKeys, StudyMaterial, StudyUseCases } from '@modules/study'

export const handleShowAddMaterial = () => {
	useModals().study.addMaterial.open({})
}

const store = createStore(
	<
		Record<
			string,
			{
				materials: Ref<StudyMaterial[]>
			}
		>
	>{},
	'study/index',
)

const similarStore = createStore<
	Record<
		string,
		{
			materials: Ref<StudyMaterial[]>
		}
	>
>({}, 'study/index/similar')

export const useMyStudy = (key: StudyKeys, alwaysRefetch = false) => {
	store[key] ??= {
		materials: ref([]),
	}

	const {
		asyncFn: fetchMaterials,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const materials = await StudyUseCases.get(key)
			store[key].materials.value = materials
		},
		{ key: `study/study/${key}` },
	)

	onMounted(async () => {
		if (!called.value || alwaysRefetch) await fetchMaterials()
	})

	return { ...store[key], loading, error }
}

export const useRecent = () => {
	const recent = useMyStudy('recent', true)

	const quizzes = computed(() => recent.materials.value.filter((m) => m.isQuiz()) as QuizEntity[])
	const courses = computed(() => recent.materials.value.filter((m) => m.isCourse()) as CourseEntity[])

	return { quizzes, courses }
}

export const useSimilar = (material: StudyMaterial) => {
	const key = `${material.__type}/${material.id}`

	similarStore[key] ??= {
		materials: ref([]),
	}

	const {
		asyncFn: fetchSimilar,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const materials = material.isQuiz() ? await QuizzesUseCases.similar(material.id) : await CoursesUseCases.similar(material.id)
			similarStore[key].materials.value = materials
		},
		{ key: `study/study/${key}/similar` },
	)

	onMounted(async () => {
		if (!called.value) await fetchSimilar()
	})

	return { ...similarStore[key], loading, error }
}

export const useHasAccess = () => {
	const { id, user } = useAuth()
	const { purchasesCoursesIds } = useMyPurchases()
	const hasAccess = computed(() => (material: StudyMaterial | null) => {
		if (!material) return false
		const purchases = purchasesCoursesIds.value
		const coursesIds = material.isCourse() ? [material.id] : material.courseIds
		return [
			material.isQuiz() && !material.courseIds.length,
			coursesIds.some((id) => purchases.includes(id)),
			material.user.id === user.value?.id,
			material.isQuiz() && material.access.members.includes(id.value),
			material.user.roles?.isOfficialAccount && user.value?.roles.isSubscribed,
			user.value?.account.organizationsIn.find((o) => o.id === material.user.id) && material.user.roles.isSubscribed,
		].some((v) => v)
	})

	return { hasAccess }
}
