import { FlashCardEntity } from '../entities/flashcards'
import { IPlayRepository } from './plays'
import { FlashCardToModel } from '@modules/plays/data/models/flashcards'

export interface IFlashCardRepository extends IPlayRepository<FlashCardEntity, FlashCardToModel> {}
