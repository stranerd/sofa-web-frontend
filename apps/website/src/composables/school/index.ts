import { computed, reactive, watch } from 'vue'
import { useDepartmentList } from './departments'
import { useFacultyList } from './faculties'
import { useInstitutionList } from './institutions'

export const useChooseSchool = (school: { institutionId: string; facultyId: string; departmentId: string }) => {
	const { schools, gatewayExams } = useInstitutionList()
	const { faculties, fetchFaculties } = useFacultyList()
	const { departments, fetchDepartments } = useDepartmentList()
	const filteredFaculties = computed(() => faculties.value.filter((f) => f.institutionId === school.institutionId))
	const filteredDepartments = computed(() => departments.value.filter((d) => d.facultyId === school.facultyId))

	watch(
		() => school.institutionId,
		async () => {
			if (school.institutionId) await fetchFaculties(school.institutionId)
		},
		{ immediate: true },
	)

	watch(
		() => school.facultyId,
		async () => {
			if (school.facultyId) await fetchDepartments(school.facultyId)
		},
		{ immediate: true },
	)

	return {
		school,
		schools,
		gatewayExams,
		filteredDepartments,
		filteredFaculties,
	}
}
