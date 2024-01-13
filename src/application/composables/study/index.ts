import { CourseEntity, QuizEntity, StudyKeys, StudyUseCases } from '@modules/study'
import { ResourceType } from 'sofa-logic'
import { Ref, computed, onMounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useMyPurchases } from '../payment/purchases'
import { useStudyModal } from '../core/modals'

export const handleShowAddMaterial = () => {
	useStudyModal().addMaterial.open({})
}

export const handleShowMaterialMoreOptions = (data: ResourceType) => {
	useStudyModal().materialMoreOptionsModal.open({ material: data.original })
}

const store: Record<
	string,
	{
		materials: Ref<(QuizEntity | CourseEntity)[]>
		fetched: Ref<boolean>
	}
> = {}

export const useMyStudy = (key: StudyKeys, alwaysRefetch = false) => {
	store[key] ??= {
		materials: ref([]),
		fetched: ref(false),
	}

	const {
		asyncFn: fetchMaterials,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			const materials = await StudyUseCases.get(key)
			store[key].materials.value = materials
			store[key].fetched.value = true
		},
		{ key: `study/study/${key}` },
	)

	onMounted(async () => {
		if (!store[key].fetched.value || alwaysRefetch) await fetchMaterials()
	})

	return { ...store[key], loading, error }
}

export const useRecent = () => {
	const recent = useMyStudy('recent', true)

	const quizzes = computed(() => recent.materials.value.filter((m) => m.isQuiz()) as QuizEntity[])
	const courses = computed(() => recent.materials.value.filter((m) => m.isCourse()) as CourseEntity[])

	return { quizzes, courses }
}

export const useHasAccess = () => {
	const { user } = useAuth()
	const { purchasesCoursesIds } = useMyPurchases()
	const hasAccess = computed(() => (material: QuizEntity | CourseEntity | null) => {
		if (!material) return false
		return [
			material.isQuiz() && !material.courseId,
			purchasesCoursesIds.value.includes(material.isCourse() ? material.id : material.courseId),
			material.user.id === user.value?.id,
			material.isQuiz() && material.access.members.includes(user.value?.id),
			material.user.roles?.isOfficialAccount && user.value?.roles.isSubscribed,
			user.value?.account.organizationsIn.find((o) => o.id === material.user.id) && material.user.roles.isSubscribed,
		].some((v) => v)
	})

	return { hasAccess }
}
