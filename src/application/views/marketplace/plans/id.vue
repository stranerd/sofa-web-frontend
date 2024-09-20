<template>
	<FullLayout :topbarOptions="{ title: 'Checkout' }">
		<template #left-session>
			<span />
		</template>

		<template #right-session>
			<span />
		</template>

		<template #middle-session>
			<div v-if="plan" class="flex flex-col mdlg:flex-row gap-6 px-4 mdlg:p-0">
				<div class="flex flex-col gap-6 w-full mdlg:w-[70%]">
					<div class="w-full bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
						<SofaHeading size="title">Subscription Details</SofaHeading>
						<div class="flex items-center justify-between rounded-custom border border-hoverBlue p-4">
							<SofaHeading size="title">{{ plan.title }}</SofaHeading>
							<SofaHeading size="title">
								{{ $utils.formatPrice(plan.amount, plan.currency) }}/{{ plan.intervalInWord }}
							</SofaHeading>
						</div>
						<SofaText class="text-grayColor">Your subscription includes:</SofaText>
						<ul class="flex flex-col gap-3">
							<li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
								<SofaIcon name="checkmark-circle" class="h-[16px]" />
								<SofaText>{{ feature }}</SofaText>
							</li>
						</ul>
					</div>
					<div class="w-full bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
						<SofaHeading size="title">Payment Method</SofaHeading>
						<SelectPaymentMethod v-model="methodId" :price="plan" />
					</div>
				</div>
				<div class="w-full mdlg:w-[30%] bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
					<SofaHeading size="title">Summary</SofaHeading>
					<div class="flex flex-col gap-4">
						<div class="flex items-center justify-between">
							<SofaText>Item (1)</SofaText>
							<SofaText>{{ $utils.formatPrice(plan.amount, plan.currency) }}</SofaText>
						</div>
						<div class="flex items-center justify-between">
							<SofaText>Tax</SofaText>
							<SofaText>{{ $utils.formatPrice(0, plan.currency) }}</SofaText>
						</div>
						<hr class="bg-grayColor" />
						<div class="flex items-center justify-between">
							<SofaText bold>Total</SofaText>
							<SofaText bold>
								{{ $utils.formatPrice(plan.amount, plan.currency) }}
							</SofaText>
						</div>
					</div>
					<SofaButton class="w-full" padding="py-3 px-5" :disabled="!methodId" @click="subscribe"> Make Payment </SofaButton>
					<SofaText class="text-grayColor">
						Your subscription will renew automatically every month as one payment of
						<b>{{ plan.currency }}{{ plan.amount.toLocaleString() }}</b> Cancel it anytime from your
						<router-link to="/settings/subscription" class="text-primaryBlue">subscription</router-link>
						settings. By making this payment you agree to the
						<router-link to="/legal/terms-of-service" class="text-primaryBlue">Terms of Service</router-link>.
					</SofaText>
				</div>
			</div>
		</template>
	</FullLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlan, useSubscription } from '@app/composables/payment/plans'

export default defineComponent({
	name: 'MarketplacePlansIdPage',
	routeConfig: {
		middlewares: [
			async ({ from, to }) => {
				const back = (to.query.back as string) ?? from?.fullPath
				if (back) await $utils.setRedirectToRoute(back)
			},
			'isAuthenticated',
		],
	},
	setup() {
		useHead({
			title: 'Plan Subscription',
		})

		const route = useRoute()
		const planId = route.params.id as string
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
		}
	},
})
</script>
