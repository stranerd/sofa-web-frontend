import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { PlanEntity, PlansUseCases, WalletsUseCases } from '@modules/payment'

const store = {
	plans: ref<PlanEntity[]>([]),
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
	const { userType, wallet } = useAuth()

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

	const myPlans = computed(() => store.plans.value.filter((plan) => plan.usersFor.includes(userType.value.type)))

	const currentPlan = computed(() => {
		const planId = wallet.value?.subscription.current?.id ?? null
		if (!planId) return null
		return myPlans.value.find((p) => p.id === planId) ?? null
	})

	return { ...store, myPlans, currentPlan }
}

export const usePlan = (id: string) => {
	const plan = ref<PlanEntity | null>(null)
	const {
		asyncFn: fetchPlan,
		loading,
		error,
		called,
	} = useAsyncFn(async () => {
		const response = await PlansUseCases.find(id)
		plan.value = response
	})

	onMounted(async () => {
		if (!called.value) await fetchPlan()
	})

	return { plan, fetchPlan, loading, error }
}

export const useSubscription = () => {
	const { setMessage } = useSuccessHandler()
	const { asyncFn: subscribeToPlan } = useAsyncFn(async (data: { planId: string; methodId?: string | null }) => {
		await WalletsUseCases.subscribeToPlan(data)
		setMessage('Subscription successful')
	})

	const { asyncFn: toggleRenewPlan } = useAsyncFn(async (renew: boolean) => {
		await WalletsUseCases.toggleRenewSubscription(renew)
	})

	return { subscribeToPlan, toggleRenewPlan }
}
