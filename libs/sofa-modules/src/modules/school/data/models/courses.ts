export interface CourseFromModel extends CourseToModel {
	id: string
	facultyId: string | null
	createdAt: number
	updatedAt: number
}

export interface CourseToModel {
	title: string
	institutionId: string
	departmentId: string | null
}
