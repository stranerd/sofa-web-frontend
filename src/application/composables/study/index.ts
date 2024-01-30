import { Ref, computed, onMounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useMyPurchases } from '../payment/purchases'
import { useModals } from '../core/modals'
import { ResourceType } from 'sofa-logic'
import { CourseEntity, QuizEntity, StudyKeys, StudyUseCases } from '@modules/study'

export const handleShowAddMaterial = () => {
	useModals().study.addMaterial.open({})
}

export const handleShowMaterialMoreOptions = (event: Event, data: ResourceType) => {
	useModals().study.materialMoreOptions.open({ material: data.original }, event)
}

const store: Record<
	string,
	{
		materials: Ref<(QuizEntity | CourseEntity)[]>
	}
> = {}

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

export const useHasAccess = () => {
	const { id, user } = useAuth()
	const { purchasesCoursesIds } = useMyPurchases()
	const hasAccess = computed(() => (material: QuizEntity | CourseEntity | null) => {
		if (!material) return false
		return [
			material.isQuiz() && !material.courseId,
			purchasesCoursesIds.value.includes(material.isCourse() ? material.id : material.courseId ?? ''),
			material.user.id === user.value?.id,
			material.isQuiz() && material.access.members.includes(id.value),
			material.user.roles?.isOfficialAccount && user.value?.roles.isSubscribed,
			user.value?.account.organizationsIn.find((o) => o.id === material.user.id) && material.user.roles.isSubscribed,
		].some((v) => v)
	})

	return { hasAccess }
}
