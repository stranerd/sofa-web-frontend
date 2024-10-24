import { v } from 'valleyed'
import { FundDetails } from '../types'
import { BaseFactory } from '@modules/core'

export class FundWalletFactory extends BaseFactory<null, FundDetails, FundDetails> {
	readonly rules = {
		amount: v.number().gte(100, 'cannot fund less than 100'),
		methodId: v.string().min(1),
	}

	constructor() {
		super({
			amount: undefined as unknown as number,
			methodId: '',
		})
	}

	model = () => {
		const { amount, methodId } = this.validValues
		return {
			amount,
			methodId,
		}
	}

	load = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
