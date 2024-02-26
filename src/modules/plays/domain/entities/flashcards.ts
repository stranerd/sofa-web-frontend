import { FlashCardFromModel } from '../../data/models/flashcards'
import { PlayTypes } from '../types'
import { PlayEntity } from './plays'

export class FlashCardEntity extends PlayEntity<FlashCardFromModel> {
	constructor(data: FlashCardFromModel) {
		super(PlayTypes.flashcards, data)
	}
}