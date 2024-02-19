import { PlayFromModel, PlayToModel } from './plays'

export interface TestFromModel extends PlayFromModel {
	userId: string
}

export interface TestToModel extends PlayToModel {
	quizId: string
}
