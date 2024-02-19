import { EmbeddedUser } from '../../domain/types'
import { PlayFromModel, PlayToModel } from './plays'

export interface GameFromModel extends PlayFromModel {
	user: EmbeddedUser
	participants: string[]
}

export interface GameToModel extends PlayToModel {
	join: boolean
}
