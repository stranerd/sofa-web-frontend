import { ref, computed, onMounted, onUnmounted } from 'vue'
import { addToArray } from 'valleyed'
import { useAsyncFn } from '../core/hooks'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { PlansUseCases } from '@modules/payment'
import { PlanEntity } from '@modules/payment/domain/entities/plans'

const store = {
	plans: ref([] as PlanEntity[]),
	listener: useListener(async () =>
		PlansUseCases.listenToAll({
			created: async (entity) => {
				addToArray(
					store.plans.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					store.plans.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.plans.value = store.plans.value.filter((m) => m.id !== entity.id)
			},
		}),
	),
}

export const usePlansList = () => {
	const { userType } = useAuth()

	const { called, asyncFn: fetchPlans } = useAsyncFn(async () => {
		const plans = await PlansUseCases.getAll()
		plans.results.forEach((r) =>
			addToArray(
				store.plans.value,
				r,
				(e) => e.id,
				(e) => e.createdAt,
			),
		)
	})

	onMounted(async () => {
		if (!called.value) await fetchPlans()
		await store.listener.start()
	})

	onUnmounted(async () => {
		await store.listener.close()
	})

	const subscriptionPlans = computed(() => store.plans.value.filter((plan) => plan.usersFor.includes(userType.value.type)))

	return { subscriptionPlans, ...store }
}
