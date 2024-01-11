import { useSuccessHandler } from '@/composables/core/states'
import { DepartmentEntity, DepartmentFactory, DepartmentsUseCases } from '@modules/school'
import { addToArray } from '@utils/commons'
import { Logic } from 'sofa-logic'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'

const store = {
	fetched: ref(false),
	departments: ref([] as DepartmentEntity[]),
	faculties: {} as Record<string, boolean>,
}

const {
	asyncFn: fetchDepartments,
	loading,
	error,
} = useAsyncFn(async (facultyId: string) => {
	if (store.faculties[facultyId]) return
	const departments = await DepartmentsUseCases.getFacultyDepartments(facultyId)
	departments.results.forEach((c) =>
		addToArray(
			store.departments.value,
			c,
			(e) => e.id,
			(e) => e.title,
			true,
		),
	)
	store.fetched.value = true
	store.faculties[facultyId] = true
})

export const useDepartmentList = () => {
	return { ...store, loading, error, fetchDepartments }
}

export const useDepartment = (facultyId: string, id: string) => {
	const department = computed({
		get: () => store.departments.value.find((s) => s.id === id) ?? null,
		set: (c) => {
			if (c)
				addToArray(
					store.departments.value,
					c,
					(e) => e.id,
					(e) => e.title,
					true,
				)
		},
	})
	onMounted(async () => {
		if (!store.faculties[facultyId]) await fetchDepartments(facultyId)
	})

	return { department }
}

let creatingFacultyDepartment = null as string | null
export const openDepartmentCreateModal = async (facultyId: string) => {
	creatingFacultyDepartment = facultyId
}

export const useCreateDepartment = () => {
	const router = useRouter()
	const factory = new DepartmentFactory()
	const { setMessage } = useSuccessHandler()
	if (creatingFacultyDepartment) factory.facultyId = creatingFacultyDepartment

	const {
		asyncFn: createDepartment,
		loading,
		error,
	} = useAsyncFn(async () => {
		const department = await DepartmentsUseCases.add(factory)
		addToArray(
			store.departments.value,
			department,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		factory.reset()
		await setMessage('Department created successfully')
		await router.push(
			`/admin/school/institutions/${department.institutionId}/faculties/${department.facultyId}/departments/${department.id}`,
		)
	})

	return { factory, loading, error, createDepartment }
}

let editingDepartment = null as DepartmentEntity | null
export const openDepartmentEditModal = async (department: DepartmentEntity) => {
	editingDepartment = department
}

export const useEditDepartment = () => {
	const router = useRouter()
	const factory = new DepartmentFactory()
	const { setMessage } = useSuccessHandler()
	if (editingDepartment) factory.loadEntity(editingDepartment)

	const {
		asyncFn: editDepartment,
		loading,
		error,
	} = useAsyncFn(async () => {
		const updatedDepartment = await DepartmentsUseCases.update(editingDepartment!.id, factory)
		addToArray(
			store.departments.value,
			updatedDepartment,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		factory.reset()
		await setMessage('Department updated successfully')
		await router.push(
			`/admin/school/institutions/${updatedDepartment.institutionId}/faculties/${updatedDepartment.facultyId}/departments/${updatedDepartment.id}`,
		)
	})

	return { factory, loading, error, editDepartment }
}

export const useDeleteDepartment = (departmentId: string) => {
	const { setMessage } = useSuccessHandler()

	const {
		asyncFn: deleteDepartment,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			await DepartmentsUseCases.delete(departmentId)
			store.departments.value = store.departments.value.filter((s) => s.id !== departmentId)
			await setMessage('Department deleted successfully')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure you want to delete this department?',
					sub: '',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return { loading, error, deleteDepartment }
}
