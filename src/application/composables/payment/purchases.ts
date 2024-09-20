import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { createStore } from '../core/store'
import { Purchasables, PurchaseEntity, PurchasesUseCases, SelectedPaymentMethod } from '@modules/payment'

const store = createStore(
	{
		purchases: reactive<PurchaseEntity[]>([]),
		listener: useListener(async () => {
			const { id } = useAuth()
			return PurchasesUseCases.listenToUsers(id.value, {
				created: async (entity) => {
					addToArray(
						store.purchases,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
						store.purchases,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					store.purchases = store.purchases.filter((m) => m.id !== entity.id)
				},
			})
		}),
	},
	'payments/purchases',
)

export const useMyPurchases = () => {
	const { id } = useAuth()

	const {
		asyncFn: fetchPurchases,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const purchases = await PurchasesUseCases.getUsers(id.value)
			purchases.results.forEach((r) =>
				addToArray(
					store.purchases,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: 'payments/purchases/mine' },
	)

	onMounted(async () => {
		if (!called.value) await fetchPurchases()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const purchasesCoursesIds = computed(() => store.purchases.filter((p) => p.data.type === Purchasables.courses).map((p) => p.data.id))

	return { ...store, loading, error, purchasesCoursesIds }
}

export const useCreatePurchase = (id: string, type: Purchasables) => {
	const {
		asyncFn: createPurchase,
		loading,
		error,
	} = useAsyncFn(async (methodId: SelectedPaymentMethod) => await PurchasesUseCases.create({ id, type, methodId }))
	return { createPurchase, loading, error }
}
