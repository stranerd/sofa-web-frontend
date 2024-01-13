import { useSuccessHandler } from '@/composables/core/states'
import { CourseEntity, CourseFactory, CoursesUseCases } from '@modules/school'
import { addToArray } from '@utils/commons'
import { Logic } from 'sofa-logic'
import { computed, onMounted, ref, watch } from 'vue'
import { useAsyncFn } from '../core/hooks'

const store = {
	fetched: ref(false),
	courses: ref([] as CourseEntity[]),
	departments: {} as Record<string, boolean>,
	faculties: {} as Record<string, boolean>,
	institutions: {} as Record<string, boolean>,
	searchMode: ref(false),
	searchValue: ref(''),
	searchResults: ref([] as CourseEntity[]),
}

const { asyncFn: fetchDepartmentCourses } = useAsyncFn(async (departmentId: string) => {
	if (store.departments[departmentId]) return
	const courses = await CoursesUseCases.getDepartmentCourses(departmentId)
	courses.results.forEach((c) =>
		addToArray(
			store.courses.value,
			c,
			(e) => e.id,
			(e) => e.title,
			true,
		),
	)
	store.fetched.value = true
	store.departments[departmentId] = true
})

const { asyncFn: fetchFacultyCourses } = useAsyncFn(async (facultyId: string, general = false) => {
	const key = general ? `${facultyId}-general` : facultyId
	if (store.faculties[key]) return
	const courses = await CoursesUseCases.getFacultyCourses(facultyId, general)
	courses.results.forEach((c) => {
		addToArray(
			store.courses.value,
			c,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		if (c.departmentId) store.departments[c.departmentId] = true
		else store.faculties[`${c.facultyId}-general`] = true
	})
	store.fetched.value = true
	store.faculties[key] = true
})

const { asyncFn: fetchInstitutionCourses } = useAsyncFn(async (institutionId: string, general = false) => {
	const key = general ? `${institutionId}-general` : institutionId
	if (store.institutions[key]) return
	const courses = await CoursesUseCases.getInstitutionCourses(institutionId, general)
	courses.results.forEach((c) => {
		addToArray(
			store.courses.value,
			c,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		if (c.facultyId) {
			store.faculties[c.facultyId] = true
			if (c.departmentId) store.departments[c.departmentId] = true
			else store.faculties[`${c.facultyId}-general`] = true
		} else store.institutions[`${institutionId}-general`] = true
	})
	store.fetched.value = true
	store.institutions[key] = true
})

export const useCourseList = () => {
	const { asyncFn: search } = useAsyncFn(async () => {
		const searchValue = store.searchValue.value
		if (!searchValue) return
		store.searchMode.value = true
		store.searchResults.value = await CoursesUseCases.search(searchValue)
	})

	watch(store.searchValue, () => {
		if (!store.searchValue.value) store.searchMode.value = false
	})

	return {
		...store,
		search,
		fetchDepartmentCourses,
		fetchFacultyCourses,
		fetchInstitutionCourses,
	}
}

export const useCourse = (id: string) => {
	const course = computed({
		get: () => store.courses.value.find((s) => s.id === id) ?? null,
		set: (c) => {
			if (c)
				addToArray(
					store.courses.value,
					c,
					(e) => e.id,
					(e) => e.title,
					true,
				)
		},
	})
	onMounted(async () => {
		if (!course.value) {
			const c = await CoursesUseCases.find(id)
			if (c)
				addToArray(
					store.courses.value,
					c,
					(e) => e.id,
					(e) => e.title,
					true,
				)
		}
	})

	return { course }
}

let creatingCourseEntity = null as {
	institutionId: string
	facultyId: string | null
	departmentId: string | null
} | null
export const openCourseCreateModal = async (institutionId: string, facultyId: string | null, departmentId: string | null) => {
	creatingCourseEntity = { institutionId, facultyId, departmentId }
}

export const useCreateCourse = () => {
	const factory = new CourseFactory()
	const { setMessage } = useSuccessHandler()
	if (creatingCourseEntity) {
		factory.institutionId = creatingCourseEntity.institutionId
		factory.departmentId = creatingCourseEntity.departmentId
	}

	const {
		asyncFn: createCourse,
		loading,
		error,
	} = useAsyncFn(async () => {
		const course = await CoursesUseCases.add(factory)
		addToArray(
			store.courses.value,
			course,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		factory.reset()
		await setMessage('Course created successfully')
	})

	return { factory, loading, error, createCourse }
}

let editingCourse = null as CourseEntity | null
export const openCourseEditModal = async (course: CourseEntity) => {
	editingCourse = course
}

export const useEditCourse = () => {
	const factory = new CourseFactory()
	const { setMessage } = useSuccessHandler()
	if (editingCourse) factory.loadEntity(editingCourse)

	const {
		asyncFn: editCourse,
		loading,
		error,
	} = useAsyncFn(async () => {
		const updatedCourse = await CoursesUseCases.update(editingCourse!.id, factory)
		addToArray(
			store.courses.value,
			updatedCourse,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		factory.reset()
		await setMessage('Course updated successfully')
	})

	return { factory, loading, error, editCourse }
}

export const useDeleteCourse = (courseId: string) => {
	const { setMessage } = useSuccessHandler()

	const {
		asyncFn: deleteCourse,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			await CoursesUseCases.delete(courseId)
			store.courses.value = store.courses.value.filter((s) => s.id !== courseId)
			await setMessage('Course deleted successfully')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure you want to delete this course?',
					sub: '',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return { loading, error, deleteCourse }
}
