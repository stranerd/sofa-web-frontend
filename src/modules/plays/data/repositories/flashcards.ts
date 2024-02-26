import { FlashCardEntity } from '../../domain/entities/flashcards'
import { IFlashCardRepository } from '../../domain/irepositories/flashcards'
import { PlayTypes } from '../../domain/types'
import { FlashCardFromModel, FlashCardToModel } from '../models/flashcards'
import { PlayRepository } from './plays'

export class FlashCardRepository
	extends PlayRepository<FlashCardEntity, FlashCardFromModel, FlashCardToModel>
	implements IFlashCardRepository
{
	private static instance: FlashCardRepository

	private constructor() {
		super(PlayTypes.flashcards, (model: FlashCardFromModel | null) => (model ? new FlashCardEntity(model) : null) as FlashCardEntity)
	}

	static getInstance() {
		if (!FlashCardRepository.instance) FlashCardRepository.instance = new FlashCardRepository()
		return FlashCardRepository.instance
	}
}
