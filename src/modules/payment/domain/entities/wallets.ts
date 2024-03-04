import { divideByZero, Differ } from 'valleyed'
import { WalletFromModel } from '../../data/models/wallets'
import { Subscription } from '../types'
import { PlanEntity } from './plans'
import { BaseEntity } from '@modules/core'

export class WalletEntity extends BaseEntity<WalletFromModel> {
	constructor(data: WalletFromModel) {
		super(data)
	}

	getCurrentBill(plan: PlanEntity) {
		if (!this.subscription.current) return 0
		if (plan.id !== this.subscription.current.id) return 0
		return plan.pricePerDay * this.subscription.membersDays
	}

	get currentAverageMembers() {
		if (!this.subscription.current) return 0
		const days = (Date.now() - this.subscription.current.activatedAt) / (1000 * 60 * 60 * 24)
		return divideByZero(this.subscription.membersDays, days)
	}

	private getSubscription(data: Subscription['data']) {
		return this.subscriptions.find((s) => Differ.equal(s.data, data))
	}

	getClassSubscription(data: { organizationId: string; classId: string }) {
		return this.getSubscription({ ...data, type: 'classes' })
	}
}
