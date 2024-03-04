<template>
	<DashboardLayout :topbarOptions="{ title: 'Checkout' }">
		<template #left-session>
			<span />
		</template>

		<template #right-session>
			<span />
		</template>
		<template #middle-session>
			<div v-if="plan" class="flex gap-6">
				<div class="flex flex-col gap-6 w-[70%]">
					<div class="w-full bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
						<SofaHeaderText>Subscription Details</SofaHeaderText>
						<div class="flex items-center justify-between rounded-custom border border-hoverBlue p-4">
							<SofaHeaderText>{{ plan.title }}</SofaHeaderText>
							<SofaHeaderText>{{ plan.currency }}{{ plan.amount.toLocaleString() }}/month</SofaHeaderText>
						</div>
						<SofaNormalText color="text-grayColor">Your subscription includes:</SofaNormalText>
						<ul class="flex flex-col gap-3">
							<li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
								<SofaIcon name="checkmark-circle" class="h-[16px]" />
								<p class="text-[14px]">{{ feature }}</p>
							</li>
						</ul>
					</div>
					<PaymentMethodCard :showWallet="false" @methodSelected="selectMethod" />
				</div>
				<div class="w-[30%] bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
					<SofaHeaderText>Summary</SofaHeaderText>
					<div class="flex flex-col gap-4">
						<div class="flex items-center justify-between">
							<SofaNormalText>Item (1)</SofaNormalText>
							<SofaNormalText>{{ plan.currency }}{{ plan.amount.toLocaleString() }}</SofaNormalText>
						</div>
						<div class="flex items-center justify-between">
							<SofaNormalText>Tax</SofaNormalText>
							<SofaNormalText>{{ plan.currency }}0</SofaNormalText>
						</div>
						<hr class="bg-grayColor" />
						<div class="flex items-center justify-between">
							<SofaNormalText customClass="font-semibold">Total</SofaNormalText>
							<SofaNormalText customClass="font-semibold">
								{{ plan.currency }}{{ plan.amount.toLocaleString() }}
							</SofaNormalText>
						</div>
					</div>
					<SofaButton customClass="w-full" padding="py-3 px-5" :disabled="!methodId" @click="subscribe">
						Make Payment
					</SofaButton>
					<p class="text-grayColor">
						Your subscription will renew automatically every month as one payment of
						<b>{{ plan.currency }}{{ plan.amount.toLocaleString() }}</b> Cancel it anytime from your
						<router-link to="/settings/subscription" class="text-primaryBlue">subscription</router-link> settings. By making
						this payment you agree to the
						<router-link to="/legal/terms-of-service" class="text-primaryBlue">Terms & Conditions</router-link>.
					</p>
				</div>
			</div>
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute, useRouter } from 'vue-router'
import { usePlan, useSubscription } from '@app/composables/payment/plans'
import { MethodEntity } from '@modules/payment'
import { Logic } from 'sofa-logic'
export default defineComponent({
	routeConfig: {
		middlewares: ['isSubscription'],
	},
	setup() {
		useMeta({
			title: 'Plan Subscription',
		})

		const route = useRoute()
		const router = useRouter()
		const planId = route.params.planId as string
		const methodId = ref('')

		const { plan } = usePlan(planId)
		const { subscribeToPlan } = useSubscription()

		const selectMethod = (method: MethodEntity) => {
			methodId.value = method.id
		}

		const planData = computed(() => ({ planId, methodId: methodId.value }))

		const subscribe = async () => {
			const path = await Logic.Common.getRedirectToRoute()
			await subscribeToPlan(planData.value)
			router.push(path)
		}

		return {
			plan,
			selectMethod,
			subscribe,
			planData,
			methodId,
		}
	},
})
</script>
