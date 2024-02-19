import { PlayFromModel, PlayToModel } from './plays'

export interface PracticeFromModel extends PlayFromModel {
	userId: string
}

export interface PracticeToModel extends PlayToModel {
	quizId: string
}
