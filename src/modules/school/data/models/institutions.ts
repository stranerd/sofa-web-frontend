export interface InstitutionFromModel extends InstitutionToModel {
	id: string
	createdAt: number
	updatedAt: number
}

export interface InstitutionToModel {
	title: string
	isGateway: boolean
}
