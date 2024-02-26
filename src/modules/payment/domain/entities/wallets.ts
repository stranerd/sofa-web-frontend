import { Differ } from 'valleyed'
import { WalletFromModel } from '../../data/models/wallets'
import { Subscription } from '../types'
import { BaseEntity } from '@modules/core'

export class WalletEntity extends BaseEntity<WalletFromModel> {
	constructor(data: WalletFromModel) {
		super(data)
	}

	private getSubscription(data: Subscription['data']) {
		return this.subscriptions.find((s) => Differ.equal(s.data, data))
	}

	getClassSubscription(data: { organizationId: string; classId: string }) {
		return this.getSubscription({ ...data, type: 'classes' })
	}
}
