import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from '../common/ReadOnlyService'
import { CommercialBanks, Wallet } from '../../logic/types/domains/payment'
import { FundWalletInput, UpdateAccountNumberInput, WithdrawalFromWalletInput } from '../../logic/types/forms/payment'

export default class WalletsApi extends ReadOnlyApiService {
	constructor() {
		super('payment/wallets')
	}

	public async getUserWallet() {
		try {
			const response: AxiosResponse<Wallet> = await this.axiosInstance.get(this.getUrl())

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getCommercialBanks() {
		try {
			const response: AxiosResponse<CommercialBanks[]> = await this.axiosInstance.get(this.getUrl() + '/account/banks/NG')

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async subscribeToPlan(data: { planId: string }) {
		try {
			const response: AxiosResponse<any> = await this.axiosInstance.post(this.getUrl() + '/subscriptions', data)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async fundWallet(data: FundWalletInput) {
		try {
			const response: AxiosResponse<Wallet> = await this.axiosInstance.post(this.getUrl() + '/fund', data)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async updateAccountNumber(data: UpdateAccountNumberInput) {
		try {
			const response: AxiosResponse<Wallet> = await this.axiosInstance.post(this.getUrl() + '/account', data)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async verifyAccountNumber(data: UpdateAccountNumberInput) {
		try {
			const response: AxiosResponse<Wallet> = await this.axiosInstance.post(this.getUrl() + '/account/verify', data)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async withdrawFromWallet(data: WithdrawalFromWalletInput) {
		try {
			const response: AxiosResponse<Wallet> = await this.axiosInstance.post(this.getUrl() + '/withdraw', data)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async toggleSubscriptionRenew(renew: boolean) {
		try {
			const response: AxiosResponse<Wallet> = await this.axiosInstance.post(this.getUrl() + '/subscriptions/renewal/toggle', {
				renew,
			})

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
