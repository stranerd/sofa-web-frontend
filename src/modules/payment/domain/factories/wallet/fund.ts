import { v } from 'valleyed'
import { FundDetails } from '../../types'
import { BaseFactory } from '@modules/core'

export class FundWalletFactory extends BaseFactory<FundDetails, FundDetails, FundDetails> {
	readonly rules = {
		amount: v.number().gt(99),
		methodId: v.string().min(1),
	}

	constructor() {
		super({
			amount: 0,
			methodId: '',
		})
	}

	get amount() {
		return this.values.amount
	}

	set amount(value: number) {
		this.set('amount', value)
	}

	get methodId() {
		return this.values.methodId
	}

	set methodId(value: string) {
		this.set('methodId', value)
	}

	model = async () => {
		const { amount, methodId } = this.validValues
		return {
			amount,
			methodId,
		}
	}

	loadEntity = (entity: FundDetails) => {
		this.amount = entity.amount
		this.methodId = entity.methodId
	}
}
