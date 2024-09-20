import { addToArray } from 'valleyed'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { createStore } from '../core/store'
import { FacultiesUseCases, FacultyEntity, FacultyFactory } from '@modules/school'
import { useSuccessHandler } from '@app/composables/core/states'

const store = createStore(
	{
		faculties: ref([] as FacultyEntity[]),
		institutions: {} as Record<string, boolean>,
	},
	'school/faculties',
)

const {
	asyncFn: fetchFaculties,
	loading,
	error,
} = useAsyncFn(
	async (institutionId: string) => {
		if (store.institutions[institutionId]) return
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
		store.institutions[institutionId] = true
	},
	{ key: 'school/faculties/all' },
)

export const useFacultyList = () => ({ ...store, loading, error, fetchFaculties })

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
	const { setMessage } = useSuccessHandler()
	if (creatingInstitutionFaculty) factory.institutionId = creatingInstitutionFaculty

	const {
		asyncFn: createFaculty,
		loading,
		error,
	} = useAsyncFn(async () => {
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
	})

	return { factory, loading, error, createFaculty }
}

let editingFaculty = null as FacultyEntity | null
export const openFacultyEditModal = async (faculty: FacultyEntity) => {
	editingFaculty = faculty
}

export const useEditFaculty = () => {
	const router = useRouter()
	const factory = new FacultyFactory()
	const { setMessage } = useSuccessHandler()
	if (editingFaculty) factory.loadEntity(editingFaculty)

	const {
		asyncFn: editFaculty,
		loading,
		error,
	} = useAsyncFn(async () => {
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
	})

	return { factory, loading, error, editFaculty }
}

export const useDeleteFaculty = (facultyId: string) => {
	const { setMessage } = useSuccessHandler()

	const {
		asyncFn: deleteFaculty,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			await FacultiesUseCases.delete(facultyId)
			store.faculties.value = store.faculties.value.filter((s) => s.id !== facultyId)
			await setMessage('Faculty deleted successfully')
		},
		{
			pre: async () =>
				$utils.confirm({
					title: 'Are you sure you want to delete this faculty?',
					sub: '',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return { loading, error, deleteFaculty }
}
