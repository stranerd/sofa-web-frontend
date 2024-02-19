import { FlashCardFromModel, FlashCardToModel } from '../models/flashcards'
import { PlayRepository } from './plays'
import { PlayTypes } from '@modules/plays/domain/types'
import { FlashCardEntity } from '@modules/plays/domain/entities/flashcards'
import { IFlashCardRepository } from '@modules/plays/domain/irepositories/flashcards'

export class FlashCardRepository
	extends PlayRepository<FlashCardEntity, FlashCardFromModel, FlashCardToModel>
	implements IFlashCardRepository
{
	private static instance: FlashCardRepository

	private constructor() {
		super(PlayTypes.flashCards, (model: FlashCardFromModel | null) => (model ? new FlashCardEntity(model) : null) as FlashCardEntity)
	}

	static getInstance() {
		if (!FlashCardRepository.instance) FlashCardRepository.instance = new FlashCardRepository()
		return FlashCardRepository.instance
	}
}
