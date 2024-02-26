import { FlashCardToModel } from '../../data/models/flashcards'
import { FlashCardEntity } from '../entities/flashcards'
import { IFlashCardRepository } from '../irepositories/flashcards'
import { PlaysUseCase } from './plays'

export class FlashCardUseCase extends PlaysUseCase<FlashCardEntity, FlashCardToModel, IFlashCardRepository> {}
