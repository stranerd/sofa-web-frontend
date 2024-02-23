import { v } from 'valleyed'
import { CurrencyCountries, WithdrawData } from '../types'
import { BaseFactory } from '@modules/core'

type Keys = Omit<WithdrawData, 'account'> & WithdrawData['account']

export class WithdrawalFactory extends BaseFactory<WithdrawData, WithdrawData, Keys> {
	readonly rules = {
		amount: v.number().gte(1000, 'cannot withdraw less than 1000'),
		country: v.in(Object.values(CurrencyCountries)),
		bankCode: v.string().min(1),
		bankNumber: v.string().min(1),
		bankName: v.string().min(1),
		ownerName: v.string().min(1),
	}

	constructor() {
		super({
			amount: 0,
			country: CurrencyCountries.NG,
			bankCode: '',
			bankNumber: '',
			bankName: '',
			ownerName: '',
		})
	}

	get amount() {
		return this.values.amount
	}

	set amount(value: number) {
		this.set('amount', value)
	}

	get country() {
		return this.values.country
	}

	set country(value: CurrencyCountries) {
		this.set('country', value)
	}

	get bankCode() {
		return this.values.bankCode
	}

	set bankCode(value: string) {
		this.set('bankCode', value)
	}

	get bankNumber() {
		return this.values.bankNumber
	}

	set bankNumber(value: string) {
		this.set('bankNumber', value)
	}

	get bankName() {
		return this.values.bankName
	}

	set bankName(value: string) {
		this.set('bankName', value)
	}

	get ownerName() {
		return this.values.ownerName
	}

	set ownerName(value: string) {
		this.set('ownerName', value)
	}

	model = async () => {
		const { amount, country, bankCode, bankName, bankNumber, ownerName } = this.validValues
		return {
			amount,
			account: { country, bankCode, bankName, bankNumber, ownerName },
		}
	}

	loadEntity = (entity: WithdrawData) => {
		this.amount = entity.amount
		this.country = entity.account.country
		this.bankCode = entity.account.bankCode
		this.bankName = entity.account.bankName
		this.bankNumber = entity.account.bankNumber
		this.ownerName = entity.account.ownerName
	}
}
