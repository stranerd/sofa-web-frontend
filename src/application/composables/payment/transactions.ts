import { addToArray } from 'valleyed'
import { onMounted, onUnmounted, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { loadScript } from '../core/scripts'
import { createStore } from '../core/store'
import { FlutterwaveSecrets, TransactionEntity, TransactionType, TransactionsUseCases } from '@modules/payment'

const store = createStore(
	{
		flutterwave: null as FlutterwaveSecrets | null,
		transactions: ref<TransactionEntity[]>([]),
		hasMore: ref(false),
	},
	'payment/transactions',
)

const listener = useListener(() =>
	TransactionsUseCases.listen(
		{
			created: async (entity) => {
				addToArray(
					store.transactions.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					store.transactions.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.transactions.value = store.transactions.value.filter((m) => m.id !== entity.id)
			},
		},
		store.transactions.value.at(-1)?.createdAt,
	),
)

export const useMyTransactions = () => {
	const { called, asyncFn: fetchTransactions } = useAsyncFn(
		async () => {
			const transactions = await TransactionsUseCases.get(store.transactions.value.at(-1)?.createdAt)
			store.hasMore.value = !!transactions.pages.next
			transactions.results.map((transaction) =>
				addToArray(
					store.transactions.value,
					transaction,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: 'payment/transactions/mine' },
	)

	const fetchOlderTransactions = async () => {
		fetchTransactions()
		await listener.restart()
	}

	onMounted(async () => {
		if (!called.value) await fetchTransactions()
		await listener.start()
	})

	onUnmounted(async () => {
		await listener.close()
	})

	return { ...store, fetchOlderTransactions }
}

export const createTransaction = async (amount: number, type: TransactionType, description: string) => {
	const unload = await loadScript('flutterwave', 'https://checkout.flutterwave.com/v3.js')
	if (!window.FlutterwaveCheckout) return false
	if (!store.flutterwave) store.flutterwave = await TransactionsUseCases.getFlutterwaveSecrets()
	const { id, amount: txAmnt, currency, email } = await TransactionsUseCases.create({ amount, data: { type } })
	await new Promise<void>((res, rej) => {
		const supportedMethods = ['card']
		if (type !== TransactionType.newCard) supportedMethods.push('ussd', 'banktransfer')
		const modal = window.FlutterwaveCheckout({
			public_key: store.flutterwave!.publicKey,
			tx_ref: id,
			amount: txAmnt,
			currency,
			customer: { email },
			payment_options: supportedMethods.join(', '),
			customizations: { title: 'Stranerd', description, logo: $utils.environment.domain + '/images/logo.svg' },
			callback: () => {
				modal.close()
				res()
			},
			onclose: (incomplete: boolean) => (incomplete ? rej('transaction not completed') : res()),
		})
	})
	const res = await TransactionsUseCases.fulfill(id)
	unload()
	return res
}
