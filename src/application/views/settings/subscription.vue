<template>
	<SettingsLayout title="Subscription">
		<div v-if="wallet" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<SofaHeaderText size="xl"> My subscription </SofaHeaderText>

				<SofaNormalText v-if="!wallet.subscription.active"> You have no active subscription </SofaNormalText>
				<template v-else-if="wallet.subscription.current && currentPlan">
					<div class="w-full flex flex-col gap-3">
						<div class="w-full flex flex-col gap-2 items-start">
							<SofaHeaderText size="2xl" color="text-primaryPurple">
								{{ currentPlan.title }}
							</SofaHeaderText>

							<div class="w-full flex flex-col gap-1 pb-1">
								<SofaNormalText> Expires {{ formatTime(wallet.subscription.current.expiredAt) }} </SofaNormalText>
								<SofaNormalText v-if="wallet.subscription.current.expiredAt > Date.now()">
									{{ Logic.Common.daysDiff(new Date(), new Date(wallet.subscription.current.expiredAt)) }}
									days left
								</SofaNormalText>
								<SofaNormalText v-else> Expired </SofaNormalText>
							</div>

							<SofaCheckbox
								v-if="wallet.subscription.current.expiredAt > Date.now()"
								v-model="autoRenewIsOn"
								type="switch"
								class="w-full flex justify-between py-3 border-t border-darkLightGray">
								<SofaNormalText customClass="!font-bold">Auto-renewal</SofaNormalText>
							</SofaCheckbox>
						</div>
					</div>
				</template>
			</div>

			<div
				v-if="userType.isOrg && currentPlan && wallet.subscription.current"
				class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl" class="capitalize" content="Billing Details" />

				<div class="w-full flex flex-col items-start p-4 mdlg:p-6 bg-primaryPurple text-white rounded-xl">
					<SofaHeaderText size="2xl" color="text-current">
						{{ Logic.Common.formatPrice(wallet.getCurrentBill(currentPlan), currentPlan.currency) }}
					</SofaHeaderText>

					<SofaNormalText class="text-current">Current Bill</SofaNormalText>

					<SofaButton padding="px-5 py-2" class="mt-4" bgColor="bg-white" textColor="text-primaryPurple" @click="renewPlan()">
						Pay Now
					</SofaButton>
				</div>

				<div class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
					<SofaNormalText class="!font-bold">Current license</SofaNormalText>
					<SofaNormalText>{{ wallet.currentAverageMembers }} members</SofaNormalText>
				</div>

				<div v-if="wallet.subscription.active" class="flex flex-col gap-2 bg-lightGray p-4 mdlg:p-6 rounded-xl">
					<SofaNormalText class="!font-bold">Next billing date</SofaNormalText>
					<SofaNormalText>{{ formatTime(wallet.subscription.current.expiredAt) }}</SofaNormalText>
				</div>
			</div>

			<template v-if="!wallet.subscription.active">
				<div
					v-if="userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<SofaHeaderText size="xl" class="capitalize">
						{{ myApplicablePlan.title }}
					</SofaHeaderText>

					<div class="w-full flex flex-col gap-2 items-start">
						<div class="flex gap-2 items-center">
							<SofaHeaderText customClass="!text-2xl !font-bold">
								{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }} per student
							</SofaHeaderText>
							<SofaNormalText customClass="!text-2xl"> / {{ myApplicablePlan.intervalInWord }} </SofaNormalText>
						</div>

						<SofaNormalText> Provide cost-free access to your paid courses for your physical students. </SofaNormalText>

						<SofaButton padding="px-5 py-2" class="mt-3" @click="subscibeToPlan(myApplicablePlan.id)"> Subscribe </SofaButton>
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
							{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
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
							<SofaButton padding="px-7 py-2" customClass="!w-auto" @click="subscibeToPlan(myApplicablePlan.id)">
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
import SettingsLayout from '@app/components/settings/SettingsLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { usePlansList, useSubscription } from '@app/composables/payment/plans'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'SubscriptionSettingPage',
	components: { SettingsLayout },
	routeConfig: { goBackRoute: '/settings' },
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

		const { userType, wallet } = useAuth()
		const autoRenewIsOn = computed({
			get: () => !!wallet.value?.subscription.next,
			set: (value) => {
				toggleRenewPlan(value)
			},
		})
		const { currentPlan, firstPaidPlan: myApplicablePlan } = usePlansList()
		const { subscribeToPlan, renewPlan, toggleRenewPlan } = useSubscription()

		const subscibeToPlan = async (id: string) => {
			await subscribeToPlan(id)
		}

		return {
			Logic,
			formatTime,
			myApplicablePlan,
			currentPlan,
			subscriptionInfo,
			wallet,
			userType,
			autoRenewIsOn,
			subscibeToPlan,
			renewPlan,
		}
	},
})
</script>
