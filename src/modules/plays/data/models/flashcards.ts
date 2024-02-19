import { PlayFromModel, PlayToModel } from './plays'

export interface FlashCardFromModel extends PlayFromModel {
	userId: string
}

export interface FlashCardToModel extends PlayToModel {
	quizId: string
}
