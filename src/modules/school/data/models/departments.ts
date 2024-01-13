export interface DepartmentFromModel extends DepartmentToModel {
	id: string
	institutionId: string
	createdAt: number
	updatedAt: number
}

export interface DepartmentToModel {
	title: string
	facultyId: string
}
