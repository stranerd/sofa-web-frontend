import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '@/composables/core/states'
import { FacultiesUseCases, FacultyEntity, FacultyFactory } from '@modules/school'
import { addToArray } from '@utils/commons'
import { Logic } from 'sofa-logic'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const store = {
	fetched: ref(false),
	faculties: ref([] as FacultyEntity[]),
	institutions: {} as Record<string, boolean>,
	...useErrorHandler(),
	...useLoadingHandler(),
}

const fetchFaculties = async (institutionId: string) => {
	if (store.institutions[institutionId]) return
	await store.setError('')
	await store.setLoading(true)
	try {
		const faculties = await FacultiesUseCases.getInstitutionFaculties(institutionId)
		faculties.results.forEach((c) =>
			addToArray(
				store.faculties.value,
				c,
				(e) => e.id,
				(e) => e.title,
				true,
			),
		)
		store.fetched.value = true
		store.institutions[institutionId] = true
	} catch (error) {
		await store.setError(error)
	}
	await store.setLoading(false)
}

export const useFacultyList = () => {
	return { ...store, fetchFaculties }
}

export const useFaculty = (institutionId: string, id: string) => {
	const faculty = computed({
		get: () => store.faculties.value.find((s) => s.id === id) ?? null,
		set: (c) => {
			if (c)
				addToArray(
					store.faculties.value,
					c,
					(e) => e.id,
					(e) => e.title,
					true,
				)
		},
	})
	onMounted(async () => {
		if (!store.institutions[institutionId]) await fetchFaculties(institutionId)
	})

	return { faculty }
}

let creatingInstitutionFaculty = null as string | null
export const openFacultyCreateModal = async (institutionId: string) => {
	creatingInstitutionFaculty = institutionId
}

export const useCreateFaculty = () => {
	const router = useRouter()
	const factory = new FacultyFactory()
	const { error, setError } = useErrorHandler()
	const { setMessage } = useSuccessHandler()
	const { loading, setLoading } = useLoadingHandler()
	if (creatingInstitutionFaculty) factory.institutionId = creatingInstitutionFaculty

	const createFaculty = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			await setLoading(true)
			try {
				const faculty = await FacultiesUseCases.add(factory)
				addToArray(
					store.faculties.value,
					faculty,
					(e) => e.id,
					(e) => e.title,
					true,
				)
				factory.reset()
				await setMessage('Faculty created successfully')
				await router.push(`/admin/school/institutions/${faculty.institutionId}/faculties/${faculty.id}`)
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { factory, loading, error, createFaculty }
}

let editingFaculty = null as FacultyEntity | null
export const openFacultyEditModal = async (faculty: FacultyEntity) => {
	editingFaculty = faculty
}

export const useEditFaculty = () => {
	const router = useRouter()
	const factory = new FacultyFactory()
	const { error, setError } = useErrorHandler()
	const { setMessage } = useSuccessHandler()
	const { loading, setLoading } = useLoadingHandler()
	if (editingFaculty) factory.loadEntity(editingFaculty)

	const editFaculty = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			await setLoading(true)
			try {
				const updatedFaculty = await FacultiesUseCases.update(editingFaculty!.id, factory)
				addToArray(
					store.faculties.value,
					updatedFaculty,
					(e) => e.id,
					(e) => e.title,
					true,
				)
				factory.reset()
				await setMessage('Faculty updated successfully')
				await router.push(`/admin/school/institutions/${updatedFaculty.institutionId}/faculties/${updatedFaculty.id}`)
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { factory, loading, error, editFaculty }
}

export const useDeleteFaculty = (facultyId: string) => {
	const { loading, setLoading } = useLoadingHandler()
	const { error, setError } = useErrorHandler()
	const { setMessage } = useSuccessHandler()

	const deleteFaculty = async () => {
		await setError('')
		const accepted = await Logic.Common.confirm({
			title: 'Are you sure you want to delete this faculty?',
			sub: '',
			right: { label: 'Yes, delete' },
		})
		if (accepted) {
			await setLoading(true)
			try {
				await FacultiesUseCases.delete(facultyId)
				store.faculties.value = store.faculties.value.filter((s) => s.id !== facultyId)
				await setMessage('Faculty deleted successfully')
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		}
	}

	return { loading, error, deleteFaculty }
}
