import { NotificationRepository } from './data/repositories/notifications'
import { PushRepository } from './data/repositories/push'
import { NotificationsUseCase } from './domain/usecases/notifications'
import { PushUseCase } from './domain/usecases/push'

export const NotificationsUseCases = new NotificationsUseCase(NotificationRepository.getInstance)
export const PushUseCases = new PushUseCase(PushRepository.getInstance)

export { NotificationEntity } from './domain/entities/notifications'
