import { Logic, Purchase } from 'sofa-logic'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	purchases: reactive<Purchase[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return Logic.Common.listenToMany<Purchase>('payment/purchases', {
			created: async (entity) => {
				Logic.addToArray(store.purchases, entity, (e) => e.id, (e) => e.createdAt)
			},
			updated: async (entity) => {
				Logic.addToArray(store.purchases, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				const index = store.purchases.findIndex((p) => p.id === entity.id)
				if (index !== -1) store.purchases.splice(index, 1)
			}
		})
	})
}

export const useMyPurchases = () => {
	const { id } = useAuth()

	const fetchPurchases = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const purchases = await Logic.Payment.GetMyPurchases({
				where: [{ field: 'userId', value: id.value }],
				all: true
			})
			purchases.results.forEach((r) => Logic.addToArray(store.purchases, r, (e) => e.id, (e) => e.createdAt))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchPurchases()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const purchasesCoursesIds = computed(() => store.purchases
		.filter((p) => p.data.type === 'courses')
		.map((p) => p.data.id))

	return { ...store, purchasesCoursesIds }
}