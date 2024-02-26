import { AnswerRepository } from './data/repositories/answers'
import { FlashCardRepository } from './data/repositories/flashcards'
import { GameRepository } from './data/repositories/games'
import { PracticeRepository } from './data/repositories/practice'
import { TestRepository } from './data/repositories/tests'
import { AnswersUseCase } from './domain/useCases/answers'
import { FlashCardUseCase } from './domain/useCases/flashcards'
import { GamesUseCase } from './domain/useCases/games'
import { PracticeUseCase } from './domain/useCases/practice'
import { TestsUseCase } from './domain/useCases/tests'

export type { PlayToModel } from './data/models/plays'
export type { PlayEntity } from './domain/entities/plays'
export type { IPlayRepository } from './domain/irepositories/plays'
export { PlayStatus, PlayTypes } from './domain/types'
export type { PlaysUseCase } from './domain/useCases/plays'

export const GamesUseCases = new GamesUseCase(GameRepository.getInstance())
export const AnswersUseCases = new AnswersUseCase(AnswerRepository.getInstance)
export const TestsUseCases = new TestsUseCase(TestRepository.getInstance())
export const PracticeUseCases = new PracticeUseCase(PracticeRepository.getInstance())
export const FlashCardUseCases = new FlashCardUseCase(FlashCardRepository.getInstance())

export { AnswerEntity } from './domain/entities/answers'
export { FlashCardEntity } from './domain/entities/flashcards'
export { GameEntity } from './domain/entities/games'
export { PracticeEntity } from './domain/entities/practice'
export { TestEntity } from './domain/entities/tests'
