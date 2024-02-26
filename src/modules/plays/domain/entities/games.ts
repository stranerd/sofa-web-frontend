import { GameFromModel } from '../../data/models/games'
import { PlayTypes } from '../types'
import { PlayEntity } from './plays'

export class GameEntity extends PlayEntity {
	public readonly participants: string[]

	constructor(data: GameFromModel) {
		super(PlayTypes.games, data)
		this.participants = data.participants
	}
}
