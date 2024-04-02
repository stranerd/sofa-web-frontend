import { INotificationRepository } from '../irepositories/notifications'

export class NotificationsUseCase {
	private repository: INotificationRepository

	constructor(repository: () => INotificationRepository) {
		this.repository = repository()
	}
}
