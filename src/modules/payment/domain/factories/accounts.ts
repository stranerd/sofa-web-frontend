import { v } from 'valleyed'
import { AccountDetails, CurrencyCountries } from '../types'
import { BaseFactory } from '@modules/core'
import { asArray } from '@modules/core/domain/factories/arrays'

type AccountUpdate = Omit<AccountDetails, 'ownerName' | 'bankName'>

class _AccountUpdateFactory extends BaseFactory<AccountDetails, AccountUpdate, AccountUpdate> {
	readonly rules = {
		country: v.in(Object.values(CurrencyCountries)),
		bankCode: v.string().min(1),
		bankNumber: v.string().min(1),
	}

	constructor() {
		super({ country: CurrencyCountries.NG, bankCode: '', bankNumber: '' })
	}

	model = () => {
		const { country, bankCode, bankNumber } = this.validValues
		return { country, bankCode, bankNumber }
	}

	load = (entity: AccountDetails) => {
		this.country = entity.country
		this.bankCode = entity.bankCode
		this.bankNumber = entity.bankNumber
	}
}
export class AccountUpdateFactory extends asArray(_AccountUpdateFactory) {}
