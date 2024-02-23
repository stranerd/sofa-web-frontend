import { AxiosResponse } from 'axios'
import { ReadOnlyApiService } from '../common/ReadOnlyService'
import { CommercialBanks } from '../../logic/types/domains/payment'
import { UpdateAccountNumberInput, WithdrawalFromWalletInput } from '../../logic/types/forms/payment'

export default class WalletsApi extends ReadOnlyApiService {
	constructor() {
		super('payment/wallets')
	}

	public async getCommercialBanks() {
		try {
			const response: AxiosResponse<CommercialBanks[]> = await this.axiosInstance.get(this.getUrl() + '/account/banks/NG')

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async verifyAccountNumber(data: UpdateAccountNumberInput) {
		try {
			const response = await this.axiosInstance.post(this.getUrl() + '/account/verify', data)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async withdrawFromWallet(data: WithdrawalFromWalletInput) {
		try {
			const response = await this.axiosInstance.post(this.getUrl() + '/withdraw', data)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
