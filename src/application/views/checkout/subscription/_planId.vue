<template>
	<DashboardLayout :topbarOptions="{ title: 'Checkout' }">
		<template #left-session>
			<span />
		</template>

		<template #right-session>
			<span />
		</template>
		<template #middle-session>
			<div v-if="plan" class="flex flex-col mdlg:flex-row gap-6 py-4 mdlg:py-0">
				<div class="flex flex-col gap-6 w-full mdlg:w-[70%]">
					<div class="w-full bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
						<SofaHeaderText>Subscription Details</SofaHeaderText>
						<div class="flex items-center justify-between rounded-custom border border-hoverBlue p-4">
							<SofaHeaderText>{{ plan.title }}</SofaHeaderText>
							<SofaHeaderText>
								{{ Logic.Common.formatPrice(plan.amount, plan.currency) }}/{{ plan.intervalInWord }}
							</SofaHeaderText>
						</div>
						<SofaNormalText color="text-grayColor">Your subscription includes:</SofaNormalText>
						<ul class="flex flex-col gap-3">
							<li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
								<SofaIcon name="checkmark-circle" class="h-[16px]" />
								<p class="text-[14px]">{{ feature }}</p>
							</li>
						</ul>
					</div>
					<SelectPaymentMethod v-model="methodId" :showWallet="false" />
				</div>
				<div class="w-full mdlg:w-[30%] bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
					<SofaHeaderText>Summary</SofaHeaderText>
					<div class="flex flex-col gap-4">
						<div class="flex items-center justify-between">
							<SofaNormalText>Item (1)</SofaNormalText>
							<SofaNormalText>{{ Logic.Common.formatPrice(plan.amount, plan.currency) }}</SofaNormalText>
						</div>
						<div class="flex items-center justify-between">
							<SofaNormalText>Tax</SofaNormalText>
							<SofaNormalText>{{ Logic.Common.formatPrice(0, plan.currency) }}</SofaNormalText>
						</div>
						<hr class="bg-grayColor" />
						<div class="flex items-center justify-between">
							<SofaNormalText customClass="font-semibold">Total</SofaNormalText>
							<SofaNormalText customClass="font-semibold">
								{{ Logic.Common.formatPrice(plan.amount, plan.currency) }}
							</SofaNormalText>
						</div>
					</div>
					<SofaButton customClass="w-full" padding="py-3 px-5" :disabled="!methodId" @click="subscribe">
						Make Payment
					</SofaButton>
					<p class="text-grayColor">
						Your subscription will renew automatically every month as one payment of
						<b>{{ plan.currency }}{{ plan.amount.toLocaleString() }}</b> Cancel it anytime from your
						<router-link to="/settings/subscription" class="text-primaryBlue">subscription</router-link>
						settings. By making this payment you agree to the
						<router-link to="/legal/terms-of-service" class="text-primaryBlue">Terms of Service</router-link>.
					</p>
				</div>
			</div>
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { usePlan, useSubscription } from '@app/composables/payment/plans'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'CheckoutSubscriptionPlanIdPage',
	routeConfig: {
		middlewares: [
			async ({ from, to }) => {
				const back = (to.query.back as string) ?? from?.fullPath
				if (back) await Logic.Common.setRedirectToRoute(back)
			},
			'isAuthenticated',
		],
	},
	setup() {
		useMeta({
			title: 'Plan Subscription',
		})

		const route = useRoute()
		const planId = route.params.planId as string
		const methodId = ref(null as string | null)

		const { plan } = usePlan(planId)
		const { subscribeToPlan } = useSubscription()

		const subscribe = async () => {
			await subscribeToPlan({ planId, methodId: methodId.value })
		}

		return {
			plan,
			subscribe,
			methodId,
			Logic,
		}
	},
})
</script>
