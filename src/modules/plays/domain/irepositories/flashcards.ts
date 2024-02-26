import { FlashCardToModel } from '../../data/models/flashcards'
import { FlashCardEntity } from '../entities/flashcards'
import { IPlayRepository } from './plays'

export interface IFlashCardRepository extends IPlayRepository<FlashCardEntity, FlashCardToModel> {}
