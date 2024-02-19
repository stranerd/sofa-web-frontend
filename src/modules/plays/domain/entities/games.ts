import { EmbeddedUser, PlayTypes } from '../types'
import { PlayEntity } from './plays'
import { GameFromModel } from '@modules/plays/data/models/games'

export class GameEntity extends PlayEntity {
	public readonly user: EmbeddedUser
	public readonly participants: string[]

	constructor(data: GameFromModel) {
		super(PlayTypes.games, data)
		this.user = data.user
		this.participants = data.participants
	}
}
