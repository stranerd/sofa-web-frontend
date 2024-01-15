<template>
	<div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
		<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
			<SofaHeaderText :size="'xl'" :custom-class="'text-left'"> Wallet </SofaHeaderText>

			<div class="w-full flex flex-col gap-1">
				<div class="flex flex-row items-center gap-2">
					<SofaNormalText>Balance</SofaNormalText>
					<SofaIcon
						:custom-class="`${showMoney ? 'h-[10px]' : 'h-[15px]'} cursor-pointer`"
						:name="showMoney ? 'hide' : 'show'"
						@click="showMoney ? (showMoney = false) : (showMoney = true)" />
				</div>

				<div class="w-full flex flex-col items-left">
					<SofaHeaderText :custom-class="'text-left mdlg:!text-3xl !text-2xl'">
						{{ showMoney ? Logic.Common.formatPrice(UserWallet.balance.amount, UserWallet.balance.currency) : '****' }}
					</SofaHeaderText>
				</div>

				<div class="mt-3 grid grid-cols-2 gap-3 pt-4">
					<div
						class="col-span-1 flex flex-row items-center py-3 px-3 gap-2 cursor-pointer rounded-custom justify-center border-2 border-darkLightGray"
						@click="showFundWallet()">
						<SofaIcon :custom-class="'h-[16px]'" :name="'fund-wallet'" />
						<SofaNormalText :custom-class="'text-grayColor'">Fund wallet</SofaNormalText>
					</div>

					<div
						class="col-span-1 flex flex-row items-center py-3 px-3 gap-2 rounded-custom cursor-pointer justify-center border-2 border-darkLightGray"
						@click="showWalletWithdraw()">
						<SofaIcon :custom-class="'h-[16px]'" :name="'withdraw-wallet'" />
						<SofaNormalText :custom-class="'text-grayColor'">Withdraw</SofaNormalText>
					</div>
				</div>
			</div>
		</div>

		<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom pb-7">
			<SofaHeaderText :size="'xl'" :custom-class="'text-left'"> Payment method </SofaHeaderText>

			<a class="w-full flex flex-row items-center gap-3 p-3" @click="Logic.Payment.initialPayment()">
				<SofaIcon :custom-class="'h-[18px]'" :name="'add-card'" />
				<SofaNormalText :color="'text-grayColor'">Add credit or debit card</SofaNormalText>
			</a>

			<div
				v-for="(method, index) in PaymentMethods.results"
				:key="index"
				:class="`w-full flex flex-row items-center gap-3 p-3 border-2 border-darkLightGray justify-between rounded-custom`">
				<div class="flex flex-row items-center gap-3">
					<SofaIcon :custom-class="'h-[20px]'" :name="'card'" />
					<SofaNormalText> **** **** **** {{ method.data.last4Digits }} </SofaNormalText>
				</div>

				<div class="flex flex-row items-center gap-4">
					<span v-if="method.primary" class="px-4 py-1 bg-primaryGreen rounded-[14px] cursor-pointer">
						<SofaNormalText :color="'text-white'" :custom-class="'!text-xs'">Primary</SofaNormalText>
					</span>
					<a v-else class="px-4 py-1 bg-primaryPurple rounded-[14px]" @click="Logic.Payment.MakeMethodPrimary(method.id)">
						<SofaNormalText :color="'text-white'" :custom-class="'!text-xs'">Set as primary</SofaNormalText>
					</a>
					<SofaIcon
						:custom-class="'h-[20px] cursor-pointer'"
						:name="'remove'"
						@click="
							async () => {
								const confirm = await Logic.Common.confirm({
									title: 'Are you sure?',
									sub: 'This action is permanent',
									right: { label: 'Yes, delete' },
								})
								if (!confirm) return
								await Logic.Payment.DeleteMethod(method.id)
							}
						" />
				</div>
			</div>
		</div>

		<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
			<div class="w-full flex flex-row items-center justify-between border-b border-lightGray pb-2">
				<SofaHeaderText :size="'xl'" :custom-class="'text-left'"> Transaction history </SofaHeaderText>

				<SofaIcon :custom-class="'h-[20px]'" :name="'calendar'" />
			</div>

			<div v-if="transactions.length" class="w-full flex flex-col gap-2">
				<a
					v-for="(transaction, index) in transactions"
					:key="index"
					:class="`w-full flex flex-col gap-1 pb-2 ${index != transactions.length - 1 ? 'border-b border-lightGray' : ''}`"
					@click="showTransactionInfo(transaction.data)">
					<div class="w-full flex flex-row items-center justify-between">
						<SofaNormalText :custom-class="'text-left'">
							{{ transaction.title }}
						</SofaNormalText>
						<SofaNormalText :custom-class="'!font-bold'" :color="getTransactionColor(transaction)">
							{{ Logic.Common.formatPrice(transaction.amount, transaction.currency) }}
						</SofaNormalText>
					</div>
					<div class="w-full flex flex-row justify-start gap-2 items-center">
						<SofaNormalText :color="'text-grayColor'">
							{{ transaction.time }}
						</SofaNormalText>
					</div>
				</a>
				<div
					v-if="AllTransactions.pages.next"
					class="w-full flex flex-row items-center justify-center border-t border-lightGray pt-3 cursor-pointer"
					@click="loadMoreTransactions()">
					<SofaNormalText :color="'text-primaryPink'">load more</SofaNormalText>
				</div>
			</div>

			<SofaEmptyState v-else :title="'No transaction yet'" :sub-title="'All you wallet transaction would show up here'" />
		</div>
	</div>
	<SofaModalOld v-if="showModal" :close="() => (showModal = false)" :can-close="false">
		<div class="mdlg:!w-[40%] lg:!w-[35%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative">
			<div
				class="bg-white w-full flex flex-col lg:!px-6 md:!gap-5 gap-3 py-0 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-0 md:!px-0 mdlg:!rounded-[16px] rounded-t-[16px] items-center justify-center">
				<div
					v-if="modalContent == 'fund_wallet' || modalContent == 'withdraw_money'"
					class="w-full hidden flex-col gap-3 justify-center items-center mdlg:!flex">
					<SofaHeaderText :custom-class="'text-xl'" :content="modalTitle" />
				</div>
				<div v-if="modalContent == 'transaction_info'" class="w-full hidden flex-row justify-between items-center mdlg:!flex">
					<SofaHeaderText :custom-class="'text-xl'">
						{{ modalTitle }}
					</SofaHeaderText>
					<SofaIcon :custom-class="'h-[20px] cursor-pointer'" :name="'circle-close'" @click="showModal = false" />
				</div>

				<div
					class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-lightGray border-b px-4">
					<SofaNormalText :custom-class="'!font-bold !text-base'">
						{{ modalTitle }}
					</SofaNormalText>
					<SofaIcon :custom-class="'h-[19px]'" :name="'circle-close'" @click="showModal = false" />
				</div>

				<div v-if="modalContent == 'fund_wallet'" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
					<SofaTextField
						ref="amount"
						v-model="fundWalletAmount"
						:custom-class="'rounded-custom !bg-lightGray'"
						type="text"
						:name="'Amount'"
						:placeholder="'Amount'"
						:border-color="'border-transparent'"
						:rules="[Logic.Form.RequiredRule]"
						:is-formatted="true">
						<template #inner-prefix>
							<SofaNormalText>₦</SofaNormalText>
						</template>
					</SofaTextField>

					<div class="w-full flex flex-col gap-2 border-t border-lightGray pt-3">
						<a
							:class="`w-full flex items-center gap-3 p-3 bg-lightGray ${
								fundWalletMethod == 'online' ? 'border-primaryBlue  border-2' : ''
							}  rounded-custom`"
							@click="payOnline()">
							<SofaIcon :custom-class="'h-[20px]'" :name="'website'" />
							<SofaNormalText> Pay online </SofaNormalText>
						</a>

						<a
							v-for="(method, index) in PaymentMethods.results"
							:key="index"
							:class="`w-full flex items-center gap-3 p-3 bg-lightGray ${
								fundWalletMethod == method.id ? 'border-primaryBlue border-2' : ''
							}  rounded-custom`"
							@click="fundWalletMethod ? (fundWalletMethod = '') : (fundWalletMethod = method.id)">
							<SofaIcon :custom-class="'h-[20px]'" :name="'card'" />
							<SofaNormalText> **** **** **** {{ method.data.last4Digits }} </SofaNormalText>
						</a>

						<div
							class="w-full flex flex-row items-center gap-3 px-3 py-3 cursor-pointer border-2 rounded-custom border-darkLightGray"
							@click="Logic.Payment.initialPayment()">
							<SofaIcon :custom-class="'h-[18px]'" :name="'add-card'" />
							<SofaNormalText :color="'text-grayColor'">Add credit or debit card</SofaNormalText>
						</div>
					</div>
				</div>

				<div v-if="modalContent == 'transaction_info'" class="w-full flex flex-col gap-3 mdlg:!px-0 px-4">
					<div class="w-full flex flex-col px-4 py-4 justify-start border-2 border-darkLightGray rounded-custom">
						<SofaNormalText>
							{{ transactionTitle }}
						</SofaNormalText>
						<SofaHeaderText :custom-class="'text-left mdlg:!text-3xl !text-2xl'">
							{{ transactionDetails.amount }}
						</SofaHeaderText>
					</div>

					<div class="w-full flex flex-col gap-4 pt-3 md:!pb-0 pb-4">
						<div
							v-for="(item, index) in transactionDetails"
							:key="index"
							class="w-full flex flex-row items-center justify-between">
							<SofaNormalText :color="'text-grayColor'">
								{{ capitalize(index.split('_').join(' ')) }}
							</SofaNormalText>
							<SofaNormalText :custom-class="'!font-semibold'" :color="'text-deepGray'">
								{{ item }}
							</SofaNormalText>
						</div>
					</div>
				</div>

				<div v-if="modalContent == 'withdraw_money'" class="w-full flex flex-col gap-3 mdlg:!px-0 px-4">
					<SofaTextField
						ref="amount"
						v-model="withdrawForm.amount"
						:custom-class="'rounded-custom !bg-lightGray'"
						type="text"
						:name="'Amount'"
						:placeholder="'Amount'"
						:border-color="'border-transparent'"
						:rules="[Logic.Form.RequiredRule]"
						:is-formatted="true">
						<template #inner-prefix>
							<SofaNormalText>
								{{ Logic.Common.getCurrency(UserWallet.balance.currency) }}
							</SofaNormalText>
						</template>
					</SofaTextField>

					<SofaTextField
						ref="account_number"
						v-model="withdrawForm.account_number"
						:custom-class="'rounded-custom !bg-lightGray'"
						type="tel"
						:name="'Account number'"
						:placeholder="'Account number'"
						:border-color="'border-transparent'"
						:rules="[Logic.Form.RequiredRule]">
					</SofaTextField>

					<SofaSelect
						ref="bank"
						v-model="withdrawForm.bank"
						:custom-class="'rounded-custom !bg-lightGray'"
						:name="'Bank'"
						:placeholder="'Bank'"
						:border-color="'border-transparent'"
						:rules="[Logic.Form.RequiredRule]"
						:options="AllCommercialBanks.map((bank) => ({ key: bank.code, value: bank.name }))">
					</SofaSelect>
				</div>

				<div
					v-if="modalContent != 'transaction_info'"
					class="w-full md:flex flex-row justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:!px-0 px-4 mdlg:!py-0 py-4">
					<div class="md:!w-auto col-span-1 md:!flex flex-col hidden">
						<SofaButton
							:text-color="'text-grayColor'"
							:bg-color="'bg-white'"
							:padding="'px-4 py-1'"
							:custom-class="`border-2 border-gray-100 md:!min-w-[100px] md:!w-auto w-full`"
							@click="showModal = false">
							Cancel
						</SofaButton>
					</div>

					<div class="md:!w-auto col-span-2 flex flex-col">
						<SofaButton
							:text-color="'text-white'"
							:bg-color="'bg-primaryBlue'"
							:padding="'px-4 md:!py-1 py-3'"
							:custom-class="`border-2 border-transparent md:!min-w-[100px] md:!w-auto w-full`"
							@click="handleContinue()">
							Continue
						</SofaButton>
					</div>
				</div>
			</div>
		</div>
	</SofaModalOld>
</template>
<script lang="ts">
import { formatTime } from '@utils/dates'
import { Conditions, Logic, SelectOption, Transaction } from 'sofa-logic'
import { capitalize, defineComponent, onMounted, reactive, ref, watch } from 'vue'

export default defineComponent({
	setup() {
		const UserWallet = ref(Logic.Payment.UserWallet!)
		const AllTransactions = ref(Logic.Payment.AllTransactions!)
		const PaymentMethods = ref(Logic.Payment.PaymentMethods!)
		const AllCommercialBanks = ref(Logic.Payment.AllCommercialBanks!)

		const resolvingNumber = ref(false)
		const resolvingStatus = ref('')

		const fundWalletAmount = ref('')
		const selectedMethodId = ref('')
		const fundWalletMethod = ref('')

		const showModal = ref(false)
		const modalTitle = ref('')
		const modalContent = ref('')
		const transactionTitle = ref('Withdrawal')

		const showMoney = ref(true)

		const commercialBankOptions = ref<SelectOption[]>([])

		const withdrawForm = reactive({
			amount: '',
			account_number: '',
			bank: '',
		})

		const transactionDetails = reactive({
			amount: '₦10,000',
			title: '',
			time: '8:22 AM',
		})

		const transactions = ref<any[]>([])

		const getTransactionColor = (transaction: any) => {
			if (transaction.status === 'failed') return 'text-primaryRed'
			if (transaction.status === 'initialized' || transaction.status === 'fulfilled') return 'text-primaryOrange'
			return transaction.amount >= 0 ? 'text-primaryGreen' : 'text-primaryRed'
		}

		const setTransactions = () => {
			transactions.value.length = 0
			AllTransactions.value.results.forEach((transaction) => {
				if (transaction.data.type !== 'newCard' && transaction.amount !== 0)
					transactions.value.push({
						title: transaction.title,
						time: formatTime(transaction.createdAt),
						amount: transaction.amount,
						currency: transaction.currency,
						data: transaction,
						status: transaction.status,
						createdAt: transaction.createdAt,
					})
			})

			transactions.value.sort((a, b) => b.createdAt - a.createdAt)
		}

		const setCommercialBankOptions = () => {
			commercialBankOptions.value.length = 0
			AllCommercialBanks.value?.forEach((bank) => {
				commercialBankOptions.value.push({
					key: bank.code,
					value: bank.name,
				})
			})
		}

		const showFundWallet = () => {
			modalTitle.value = 'Fund wallet'
			modalContent.value = 'fund_wallet'
			showModal.value = true
		}

		const showWalletWithdraw = () => {
			modalTitle.value = 'Withdraw money'
			modalContent.value = 'withdraw_money'
			showModal.value = true
		}

		const showTransactionInfo = (transaction: Transaction) => {
			let transactionType = 'Withdrawal'

			if (transaction.title.includes('Test charge') || transaction.title.includes('Fund')) {
				transactionType = 'Wallet funding'
			}

			if (transaction.title.includes('Purchasing') || transaction.title.includes('Purchase')) {
				transactionType = 'Course purchase'
			}

			if (transaction.title.includes('Withdrawal')) {
				transactionType = 'Withdrawal'
			}

			transactionDetails.title = transaction.title

			transactionTitle.value = transactionType
			transactionDetails.amount = Logic.Common.formatPrice(transaction.amount, transaction.currency)
			transactionDetails.time = formatTime(transaction.createdAt)

			modalTitle.value = 'Transaction details'
			modalContent.value = 'transaction_info'
			showModal.value = true
		}

		const handleContinue = () => {
			if (modalContent.value == 'fund_wallet' && fundWalletAmount.value) {
				const amount = parseFloat(fundWalletAmount.value.replace(/,/g, ''))
				if (fundWalletMethod.value) {
					Logic.Payment.FundWalletForm = {
						amount,
						methodId: fundWalletMethod.value,
					}
					Logic.Payment.FundWallet()
						?.then((data) => {
							if (data) {
								Logic.Common.showAlert({
									message: 'Funding successful',
									type: 'success',
								})
							}

							showModal.value = false
							fundWalletAmount.value = '0'
							fundWalletMethod.value = ''
						})
						.catch((error) => {
							Logic.Common.showAlert({
								message: capitalize(error.response.data[0]?.message),
								type: 'error',
							})
						})
				} else {
					Logic.Payment.initialPayment(amount)
				}
			} else if (modalContent.value == 'withdraw_money') {
				if (withdrawForm.account_number && withdrawForm.amount && withdrawForm.bank) {
					const amount = parseFloat(withdrawForm.amount.replace(/,/g, ''))

					if (amount < 1000) {
						Logic.Common.showAlert({
							message: `Withdrawal amount cannot be less than ${Logic.Common.formatPrice(1000)}`,
							type: 'warning',
						})
						return
					}

					Logic.Payment.WithdrawalFromWalletForm = {
						amount,
						account: {
							bankCode: withdrawForm.bank,
							bankNumber: withdrawForm.account_number,
							country: 'NG',
						},
					}

					Logic.Payment.WithdrawFromWallet()
						?.then((data) => {
							if (data) {
								Logic.Common.showAlert({
									message: 'Withdrawal successful',
									type: 'success',
								})

								showModal.value = false
								withdrawForm.account_number = ''
								withdrawForm.amount = ''
								withdrawForm.bank = ''
							} else {
								Logic.Common.showAlert({
									message: 'Withdrawal failed',
									type: 'error',
								})
							}

							showModal.value = false
							fundWalletAmount.value = '0'
							fundWalletMethod.value = ''
						})
						.catch((error) => {
							Logic.Common.showAlert({
								message: capitalize(error.response.data[0]?.message),
								type: 'error',
							})
						})
				}
			}
		}

		const payOnline = () => {
			const amount = parseFloat(fundWalletAmount.value.replace(/,/g, ''))

			if (amount < 200) {
				Logic.Common.showAlert({
					message: `Funding amount cannot be less than ${Logic.Common.formatPrice(200)}`,
					type: 'warning',
				})
				return
			}

			Logic.Payment.initialPayment(amount, 'fundWallet')
		}

		onMounted(() => {
			Logic.Payment.watchProperty('UserWallet', UserWallet)
			Logic.Payment.watchProperty('AllTransactions', AllTransactions)
			Logic.Payment.watchProperty('PaymentMethods', PaymentMethods)

			setTransactions()
			if (!AllCommercialBanks.value) {
				Logic.Payment.GetCommercialBanks().then(() => {
					AllCommercialBanks.value = Logic.Payment.AllCommercialBanks!
					setCommercialBankOptions()
				})
			}
		})

		watch(AllTransactions, () => {
			setTransactions()
		})

		watch(withdrawForm, () => {
			Logic.Common.debounce(() => {
				if (withdrawForm.account_number.length >= 10 && withdrawForm.bank) {
					Logic.Payment.verifyAccountNumberForm = {
						bankCode: withdrawForm.bank,
						bankNumber: withdrawForm.account_number,
						country: 'NG',
					}

					Logic.Payment.VerifyAccountNumber()
						?.then(() => {
							// console.log(data);
						})
						.catch(() => {
							//
						})
				}
			})
		})

		const loadMoreTransactions = () => {
			Logic.Payment.GetTransactions(
				{
					limit: 10,
					where: [
						{
							field: 'userId',
							condition: Conditions.eq,
							value: Logic.Common.AuthUser?.id,
						},
					],
					sort: [
						{
							field: 'createdAt',
							desc: false,
						},
					],
					page: AllTransactions.value.pages.next,
				},
				true,
			)
		}

		return {
			Logic,
			transactions,
			UserWallet,
			AllCommercialBanks,
			AllTransactions,
			showModal,
			modalTitle,
			modalContent,
			PaymentMethods,
			selectedMethodId,
			fundWalletAmount,
			transactionDetails,
			transactionTitle,
			withdrawForm,
			fundWalletMethod,
			commercialBankOptions,
			showMoney,
			resolvingNumber,
			resolvingStatus,
			showFundWallet,
			handleContinue,
			showTransactionInfo,
			capitalize,
			showWalletWithdraw,
			payOnline,
			getTransactionColor,
			loadMoreTransactions,
		}
	},
})
</script>
