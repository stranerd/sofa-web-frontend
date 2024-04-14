import { v } from 'valleyed'
import { CurrencyCountries, WithdrawData } from '../types'
import { BaseFactory } from '@modules/core'

export class WithdrawalFactory extends BaseFactory<null, WithdrawData, WithdrawData> {
	readonly rules = {
		amount: v.number().gte(1000, 'cannot withdraw less than 1000'),
		account: v.object({
			country: v.in(Object.values(CurrencyCountries)),
			bankCode: v.string().min(1),
			bankNumber: v.string().min(1),
		}),
	}

	constructor() {
		super({
			amount: 0,
			account: {
				country: CurrencyCountries.NG,
				bankCode: '044',
				bankNumber: '',
			},
		})
	}

	model = () => {
		const { amount, account } = this.validValues
		return { amount, account }
	}

	load = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
