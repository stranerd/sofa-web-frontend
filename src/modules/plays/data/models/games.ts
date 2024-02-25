import { PlayFromModel, PlayToModel } from './plays'

export interface GameFromModel extends PlayFromModel {
	participants: string[]
}

export interface GameToModel extends PlayToModel {
	join: boolean
}
