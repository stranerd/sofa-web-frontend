import { ConversationRepository } from './data/repositories/conversations'
import { MessageRepository } from './data/repositories/messages'
import { ConversationsUseCase } from './domain/usecases/conversations'
import { MessagesUseCase } from './domain/usecases/messages'

export const ConversationsUseCases = new ConversationsUseCase(ConversationRepository.getInstance)
export const MessagesUseCases = new MessagesUseCase(MessageRepository.getInstance)

export { ConversationEntity } from './domain/entities/conversations'
export { MessageEntity } from './domain/entities/messages'
export { ConversationFactory } from './domain/factories/conversations'
export { MessageFactory } from './domain/factories/messages'
