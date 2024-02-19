import { AnswerRepository } from './data/repositories/answers'
import { GameRepository } from './data/repositories/games'
import { TestRepository } from './data/repositories/tests'
import { PracticeRepository } from './data/repositories/practice'
import { FlashCardRepository } from './data/repositories/flashcards'

import { AnswersUseCase } from './domain/useCases/answers'
import { GamesUseCase } from './domain/useCases/games'
import { TestsUseCase } from './domain/useCases/tests'
import { PracticeUseCase } from './domain/useCases/practice'
import { FlashCardUseCase } from './domain/useCases/flashcards'

export const GamesUseCases = new GamesUseCase(GameRepository.getInstance())
export const AnswersUseCases = new AnswersUseCase(AnswerRepository.getInstance())
export const TestsUseCases = new TestsUseCase(TestRepository.getInstance())
export const PracticeUseCases = new PracticeUseCase(PracticeRepository.getInstance())
export const FlashCardUseCases = new FlashCardUseCase(FlashCardRepository.getInstance())

export { AnswerEntity } from './domain/entities/answers'
export { GameEntity } from './domain/entities/games'
export { TestEntity } from './domain/entities/tests'
export { PracticeEntity } from './domain/entities/practice'
export { FlashCardEntity } from './domain/entities/flashcards'
