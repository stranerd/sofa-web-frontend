<template>
	<SettingsLayout title="Subscription">
		<div v-if="wallet" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<SofaHeaderText size="xl"> My subscription </SofaHeaderText>

				<SofaNormalText v-if="!wallet.subscription.active"> You have no active subscription </SofaNormalText>
				<template v-else-if="wallet.subscription.current && currentPlan">
					<div class="w-full flex flex-col gap-3">
						<div class="w-full flex flex-col items-start p-4 mdlg:p-6 bg-primaryPurple text-white rounded-xl">
							<SofaHeaderText size="2xl" color="text-current" class="capitalize">{{ currentPlan.title }}</SofaHeaderText>
							<SofaNormalText v-if="wallet.subscription.current.expiredAt > Date.now()" color="text-current">
								{{ $utils.daysDiff(new Date(), new Date(wallet.subscription.current.expiredAt)) }}
								days left
							</SofaNormalText>
							<SofaNormalText v-else color="text-current"> Expired </SofaNormalText>
						</div>

						<div v-if="userType.isOrg" class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
							<SofaNormalText class="!font-bold">Plan info</SofaNormalText>
							<SofaNormalText>
								Giving license to students that pay for and attend your learning center physically so that they get
								cost-free access to your online classes and quizzes.
							</SofaNormalText>
						</div>

						<SofaCheckbox
							v-if="wallet.subscription.current.expiredAt > Date.now()"
							v-model="autoRenewIsOn"
							type="switch"
							class="w-full flex justify-between p-4 border rounded-2xl border-darkLightGray">
							<SofaNormalText customClass="!font-bold">Auto-renewal</SofaNormalText>
						</SofaCheckbox>
					</div>
				</template>
			</div>

			<div
				v-if="userType.isOrg && currentPlan && wallet.subscription.current"
				class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl" class="capitalize" content="Billing Details" />

				<div class="w-full flex flex-col items-start p-4 mdlg:p-6 bg-primaryPurple text-white rounded-xl">
					<SofaHeaderText size="2xl" color="text-current">
						{{ $utils.formatPrice(wallet.getCurrentBill(currentPlan), currentPlan.currency) }}
					</SofaHeaderText>

					<SofaNormalText class="text-current">Current Bill</SofaNormalText>

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
					<SofaNormalText class="!font-bold">Currently licensed</SofaNormalText>
					<SofaNormalText>{{ wallet.currentAverageMembers }} members</SofaNormalText>
				</div>

				<div v-if="wallet.subscription.active" class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
					<SofaNormalText class="!font-bold">Next billing date</SofaNormalText>
					<SofaNormalText>{{ $utils.formatTime(wallet.subscription.current.expiredAt) }}</SofaNormalText>
				</div>
			</div>

			<template v-if="!wallet.subscription.active">
				<div
					v-if="userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
					<SofaHeaderText size="xl" class="capitalize" content="Subscription Plan" />

					<div class="w-full flex flex-col items-start p-4 mdlg:p-6 bg-primaryPurple text-white rounded-xl">
						<SofaNormalText class="text-current capitalize">{{ myApplicablePlan.title }}</SofaNormalText>
						<SofaHeaderText size="2xl" color="text-current">
							{{ $utils.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
						</SofaHeaderText>

						<SofaNormalText class="text-current">per member/month</SofaNormalText>

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
						<SofaNormalText class="!font-bold">Plan info</SofaNormalText>
						<SofaNormalText>
							Giving license to students that pay for and attend your learning center physically so that they get cost-free
							access to your online classes and quizzes.
						</SofaNormalText>
					</div>
				</div>

				<div
					v-if="!userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
					<SofaHeaderText size="xl" class="w-full pb-2 border-b border-lightGray">
						{{ myApplicablePlan.title }}
					</SofaHeaderText>

					<div class="flex flex-row gap-2 items-center">
						<SofaHeaderText class="!text-2xl !font-bold">
							{{ $utils.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
						</SofaHeaderText>
						<SofaNormalText customClass="!text-2xl"> / {{ myApplicablePlan.intervalInWord }}</SofaNormalText>
					</div>

					<div class="w-full flex flex-col gap-3">
						<div
							v-for="(info, index) in subscriptionInfo"
							:key="index"
							class="w-full flex-col flex gap-1 pb-2 items-start"
							:class="{ 'border-b border-lightGray': index != subscriptionInfo.length - 1 }">
							<SofaIcon customClass="h-[23px] " :name="info.icon" />
							<SofaNormalText customClass="!font-bold">
								{{ info.title }}
							</SofaNormalText>
							<SofaNormalText color="text-grayColor">{{ info.value }}</SofaNormalText>
						</div>
					</div>

					<div class="w-full flex flex-row">
						<div class="w-auto flex flex-row">
							<SofaButton padding="px-7 py-2" customClass="!w-auto" @click="subscribeToPlan(myApplicablePlan)">
								Subscribe
							</SofaButton>
						</div>
					</div>
				</div>
			</template>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useAuth } from '@app/composables/auth/auth'
import { useRouter } from '@app/composables/core/routes'
import { usePlansList, useSubscription } from '@app/composables/payment/plans'
import { PlanEntity } from '@modules/payment'

export default defineComponent({
	name: 'SettingsSubscriptionPage',
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
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
