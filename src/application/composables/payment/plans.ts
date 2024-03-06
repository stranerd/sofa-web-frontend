import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { PlanEntity, PlansUseCases, WalletsUseCases } from '@modules/payment'
import { Logic } from 'sofa-logic'
import { UserType } from '@modules/users'

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
		if (!planId) return myPlans.value.find((p) => p.amount === 0) ?? null
		return myPlans.value.find((p) => p.id === planId) ?? null
	})

	const firstPaidPlan = computed(() => myPlans.value.find((p) => p.amount > 0) ?? null)

	const studentsPlans = computed(() => store.plans.value.filter((p) => p.usersFor.includes(UserType.student)))
	const orgsPlans = computed(() => store.plans.value.filter((p) => p.usersFor.includes(UserType.organization)))

	return { ...store, myPlans, currentPlan, firstPaidPlan, studentsPlans, orgsPlans }
}

export const usePlan = (id: string) => {
	const { plans } = usePlansList()

	const plan = computed(() => plans.value.find((p) => p.id === id) ?? null)

	return { plan }
}

export const useSubscription = () => {
	const { wallet } = useAuth()
	const { setMessage } = useSuccessHandler()
	const router = useRouter()

	const { asyncFn: subscribeToPlan } = useAsyncFn(async (data: { planId: string; methodId: string | null }) => {
		wallet.value = await WalletsUseCases.subscribeToPlan(data)
		setMessage('Subscription successful')
		const redirect = await Logic.Common.getRedirectToRoute()
		if (redirect) await router.push(redirect)
	})

	const { asyncFn: renewPlan } = useAsyncFn(async () => {
		wallet.value = await WalletsUseCases.renewPlan()
		setMessage('Renewal successful')
	})

	const { asyncFn: toggleRenewPlan } = useAsyncFn(async (renew: boolean) => {
		wallet.value = await WalletsUseCases.toggleRenewSubscription(renew)
	})

	return { subscribeToPlan, renewPlan, toggleRenewPlan }
}
