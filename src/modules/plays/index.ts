import { AnswerRepository } from './data/repositories/answers'
import { PlayRepository } from './data/repositories/plays'
import { AnswersUseCase } from './domain/useCases/answers'
import { PlaysUseCase } from './domain/useCases/plays'

export type { PlayToModel } from './data/models/plays'
export { PlayFactory } from './domain/factories/plays'
export { PlayStatus, PlayTypes, PlayTiming } from './domain/types'
export type { PlayAnswer } from './domain/types'

export const AnswersUseCases = new AnswersUseCase(AnswerRepository.getInstance)
export const PlaysUseCases = new PlaysUseCase(PlayRepository.getInstance())

export { AnswerEntity } from './domain/entities/answers'
export { PlayEntity } from './domain/entities/plays'
