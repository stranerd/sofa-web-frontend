import { AnswerRepository } from './data/repositories/answers'
import { PlayRepository } from './data/repositories/plays'
import { AnswersUseCase } from './domain/useCases/answers'
import { PlaysUseCase } from './domain/useCases/plays'

export { PlayStatus, PlayTypes } from './domain/types'

export const AnswersUseCases = new AnswersUseCase(AnswerRepository.getInstance)
export const PlaysUseCases = new PlaysUseCase(PlayRepository.getInstance())

export { AnswerEntity } from './domain/entities/answers'
export { PlayEntity } from './domain/entities/plays'
