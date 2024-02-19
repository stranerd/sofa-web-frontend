import { AnswerRepository } from './data/repositories/answers'
import { GameRepository } from './data/repositories/games'
import { TestRepository } from './data/repositories/tests'

import { AnswersUseCase } from './domain/useCases/answers'
import { GamesUseCase } from './domain/useCases/games'
import { TestsUseCase } from './domain/useCases/tests'

export const GamesUseCases = new GamesUseCase(GameRepository.getInstance())
export const AnswersUseCases = new AnswersUseCase(AnswerRepository.getInstance())
export const TestsUseCases = new TestsUseCase(TestRepository.getInstance())

export { AnswerEntity } from './domain/entities/answers'
export { GameEntity } from './domain/entities/games'
export { TestEntity } from './domain/entities/tests'
