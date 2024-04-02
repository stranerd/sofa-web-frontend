import { IPushRepository } from '../../domain/irepositories/push'
import { EnablePushInput, PushInput } from '../../domain/types'
import { HttpClient } from '@modules/core'

export class PushRepository implements IPushRepository {
	private static instance: PushRepository
	private client: HttpClient

	private constructor() {
		this.client = new HttpClient('/notifications/push')
	}

	static getInstance() {
		if (!PushRepository.instance) PushRepository.instance = new PushRepository()
		return PushRepository.instance
	}

	async enable(data: EnablePushInput) {
		return await this.client.post<EnablePushInput, boolean>('/enable', data)
	}

	async subscribe(data: PushInput) {
		return await this.client.post<PushInput, boolean>('/devices/subscribe', data)
	}

	async unsubscribe(data: PushInput) {
		return await this.client.post<PushInput, boolean>('/devices/unsubscribe', data)
	}
}
