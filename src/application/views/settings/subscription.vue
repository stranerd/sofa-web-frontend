<template>
	<SettingsLayout title="Subscription">
		<div v-if="wallet" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<SofaHeading size="title"> My subscription </SofaHeading>

				<SofaText v-if="!wallet.subscription.active"> You have no active subscription </SofaText>
				<template v-else-if="wallet.subscription.current && currentPlan">
					<div class="w-full flex flex-col gap-3">
						<div class="w-full flex flex-col items-start p-4 mdlg:p-6 bg-primaryPurple text-white rounded-xl">
							<SofaHeading size="title3" class="capitalize">{{ currentPlan.title }}</SofaHeading>
							<SofaText v-if="wallet.subscription.current.expiredAt > Date.now()">
								{{ $utils.daysDiff(new Date(), new Date(wallet.subscription.current.expiredAt)) }}
								days left
							</SofaText>
							<SofaText v-else> Expired </SofaText>
						</div>

						<div v-if="userType.isOrg" class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
							<SofaHeading class="!font-bold">Plan info</SofaHeading>
							<SofaText>
								Giving license to students that pay for and attend your learning center physically so that they get
								cost-free access to your online classes and quizzes.
							</SofaText>
						</div>

						<SofaCheckbox
							v-if="wallet.subscription.current.expiredAt > Date.now()"
							v-model="autoRenewIsOn"
							type="switch"
							class="w-full flex justify-between p-4 border rounded-2xl border-darkLightGray">
							<SofaHeading>Auto-renewal</SofaHeading>
						</SofaCheckbox>
					</div>
				</template>
			</div>

			<div
				v-if="userType.isOrg && currentPlan && wallet.subscription.current"
				class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeading size="title" class="capitalize" content="Billing Details" />

				<div class="w-full flex flex-col items-start p-4 mdlg:p-6 bg-primaryPurple text-white rounded-xl">
					<SofaHeading size="title3">
						{{ $utils.formatPrice(wallet.getCurrentBill(currentPlan), currentPlan.currency) }}
					</SofaHeading>

					<SofaText>Current Bill</SofaText>

					<SofaButton
						v-if="wallet.getCurrentBill(currentPlan) > 0"
						padding="px-5 py-2"
						class="mt-4"
						bgColor="bg-white"
						textColor="text-primaryPurple"
						@click="renewPlan()">
						Pay Now
					</SofaButton>
				</div>

				<div class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
					<SofaHeading>Currently licensed</SofaHeading>
					<SofaText>{{ wallet.currentAverageMembers }} members</SofaText>
				</div>

				<div v-if="wallet.subscription.active" class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
					<SofaHeading>Next billing date</SofaHeading>
					<SofaText>{{ $utils.formatTime(wallet.subscription.current.expiredAt) }}</SofaText>
				</div>
			</div>

			<template v-if="!wallet.subscription.active">
				<div
					v-if="userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
					<SofaHeading size="title" class="capitalize" content="Subscription Plan" />

					<div class="w-full flex flex-col items-start p-4 mdlg:p-6 bg-primaryPurple text-white rounded-xl">
						<SofaText class="capitalize">{{ myApplicablePlan.title }}</SofaText>
						<SofaHeading size="title3">
							{{ $utils.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
						</SofaHeading>

						<SofaText>per member/month</SofaText>

						<SofaButton
							padding="px-5 py-2"
							class="mt-4"
							bgColor="bg-white"
							textColor="text-primaryPurple"
							@click="subscribeToPlan(myApplicablePlan)">
							Subscribe
						</SofaButton>
					</div>

					<div class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
						<SofaHeading>Plan info</SofaHeading>
						<SofaText>
							Giving license to students that pay for and attend your learning center physically so that they get cost-free
							access to your online classes and quizzes.
						</SofaText>
					</div>
				</div>

				<div
					v-if="!userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
					<SofaHeading size="title" class="w-full pb-2 border-b border-lightGray">
						{{ myApplicablePlan.title }}
					</SofaHeading>

					<div class="flex flex-row gap-2 items-center">
						<SofaHeading size="title3">
							{{ $utils.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
						</SofaHeading>
						<SofaText size="title3"> / {{ myApplicablePlan.intervalInWord }}</SofaText>
					</div>

					<div class="w-full flex flex-col gap-3">
						<div
							v-for="(info, index) in subscriptionInfo"
							:key="index"
							class="w-full flex-col flex gap-1 pb-2 items-start"
							:class="{ 'border-b border-lightGray': index != subscriptionInfo.length - 1 }">
							<SofaIcon class="h-[23px]" :name="info.icon" />
							<SofaHeading bold>{{ info.title }}</SofaHeading>
							<SofaText>{{ info.value }}</SofaText>
						</div>
					</div>

					<SofaButton padding="px-7 py-2" class="w-auto" @click="subscribeToPlan(myApplicablePlan)"> Subscribe </SofaButton>
				</div>
			</template>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { usePlansList, useSubscription } from '@app/composables/payment/plans'
import { PlanEntity } from '@modules/payment'

export default defineComponent({
	name: 'SettingsSubscriptionPage',
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
			title: 'Subscription',
		})

		const subscriptionInfo = [
			{
				title: 'Expert help',
				value: 'Get step-by-step solutions from expert tutors and AI, no matter how hard the problem.',
				icon: 'expert-help',
			},
			{
				title: 'Customized resources',
				value: 'Access top learning materials tailored to your curriculum from verified experts.',
				icon: 'customized-material',
			},
			{
				title: 'Fun challenges',
				value: 'Compete against friends and classmates in unlimited gaming challenges.',
				icon: 'challenges',
			},
			{
				title: 'Study offline',
				value: 'Stay focused and download our resources for offline studying.',
				icon: 'study-offline',
			},
		] as const

		const router = useRouter()
		const { userType, wallet } = useAuth()
		const autoRenewIsOn = computed({
			get: () => !!wallet.value?.subscription.next,
			set: (value) => {
				toggleRenewPlan(value)
			},
		})
		const { currentPlan, firstPaidPlan: myApplicablePlan } = usePlansList()
		const { renewPlan, toggleRenewPlan } = useSubscription()

		const subscribeToPlan = async (plan: PlanEntity) => {
			await router.push(`/marketplace/plans/${plan.id}?back=/settings/subscription`)
		}

		return {
			myApplicablePlan,
			currentPlan,
			subscriptionInfo,
			wallet,
			userType,
			autoRenewIsOn,
			subscribeToPlan,
			renewPlan,
		}
	},
})
</script>
