import { onMounted, onUnmounted, ref } from 'vue'
import { addToArray } from 'valleyed'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { TransactionEntity } from '@modules/payment/domain/entities/transactions'
import { TransactionsUseCases } from '@modules/payment'

type ListenerType = ReturnType<typeof useListener>

const store = {
	transactions: ref([] as TransactionEntity[]),
	hasMore: ref<boolean>(false),
	listener: ref<ListenerType | null>(null),
}

export const useTransactionsList = () => {
	store.listener.value = useListener(() =>
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

	const { called, asyncFn: fetchTransactions } = useAsyncFn(async () => {
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
	})

	const fetchOlderTransactions = async () => {
		fetchTransactions()
		await store.listener.value?.restart()
	}

	onMounted(async () => {
		if (!called.value) await fetchTransactions()
		await store.listener.value?.start()
	})

	onUnmounted(async () => {
		await store.listener.value?.close()
	})

	return { ...store, fetchOlderTransactions, fetchTransactions }
}
