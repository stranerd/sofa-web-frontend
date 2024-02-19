import { FlashCardEntity } from '../entities/flashcards'
import { IFlashCardRepository } from '../irepositories/flashcards'
import { PlaysUseCase } from './plays'
import { FlashCardToModel } from '@modules/plays/data/models/flashcards'

export class FlashCardUseCase extends PlaysUseCase<FlashCardEntity, FlashCardToModel, IFlashCardRepository> {}
