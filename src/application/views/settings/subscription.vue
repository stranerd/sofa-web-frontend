<template>
	<SettingsLayout title="Subscription">
		<div v-if="wallet" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<SofaHeaderText size="xl" customClass="text-left"> My subscription </SofaHeaderText>

				<SofaNormalText v-if="!wallet.subscription.active" customClass="text-left">
					You have no active subscription
				</SofaNormalText>
				<template v-else-if="wallet.subscription.current">
					<div class="w-full flex flex-col gap-3">
						<div class="w-full flex flex-col gap-2 items-start">
							<SofaHeaderText color="text-primaryPurple !text-2xl !font-extrabold">
								{{ myPlan?.title ?? 'Stranerd Premium' }}
							</SofaHeaderText>

							<div class="w-full flex flex-col gap-1 pb-1">
								<SofaNormalText> Expires {{ formatTime(wallet.subscription.current.expiredAt) }} </SofaNormalText>
								<SofaNormalText v-if="wallet.subscription.current.expiredAt > Date.now()">
									{{ Logic.Common.daysDiff(new Date(), new Date(wallet.subscription.current.expiredAt)) }}
									days left
								</SofaNormalText>
								<SofaNormalText v-else> Expired </SofaNormalText>
							</div>

							<a
								v-if="wallet.subscription.current.expiredAt > Date.now()"
								class="w-full flex flex-row justify-between items-center gap-4 py-3 pb-1 border-t border-darkLightGray"
								@click="toggleRenewal">
								<SofaNormalText customClass="!font-bold">Auto-renewal</SofaNormalText>
								<div class="!w-auto">
									<SofaIcon customClass="h-[17px]" :name="autoRenewIsOn ? 'toggle-on' : 'toggle-off'" />
								</div>
							</a>
						</div>
					</div>
				</template>
			</div>

			<template v-if="!wallet.subscription.active">
				<div
					v-if="userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<SofaHeaderText size="xl" class="text-left capitalize">
						{{ myApplicablePlan.title }}
					</SofaHeaderText>

					<div class="w-full flex flex-col gap-2">
						<div class="flex flex-row gap-2 items-center">
							<SofaHeaderText customClass="text-left !text-2xl !font-bold">
								{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }} per student
							</SofaHeaderText>
							<SofaNormalText customClass="!text-2xl"> / month </SofaNormalText>
						</div>

						<SofaNormalText customClass="text-left">
							Provide cost-free access to your paid courses for your physical students.
						</SofaNormalText>

						<div class="flex flex-row pt-3">
							<SofaButton padding="px-5 py-2" @click="subscibeToPlan(myApplicablePlan.id)"> Subscribe </SofaButton>
						</div>
					</div>
				</div>

				<div
					v-if="!userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
					<SofaHeaderText size="xl" customClass="text-left w-full pb-2 border-b border-lightGray">
						{{ myApplicablePlan.title }}
					</SofaHeaderText>

					<div class="flex flex-row gap-2 items-center">
						<SofaHeaderText customClass="text-left !text-2xl !font-bold">
							{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
						</SofaHeaderText>
						<SofaNormalText customClass="!text-2xl"> / month </SofaNormalText>
					</div>

					<div class="w-full flex flex-col gap-3">
						<div
							v-for="(info, index) in subscriptionInfo"
							:key="index"
							:class="`w-full flex-col flex gap-1 pb-2 items-start ${
								index != subscriptionInfo.length - 1 ? 'border-b border-lightGray' : ''
							} `">
							<SofaIcon customClass="h-[23px] " :name="info.icon" />
							<SofaNormalText customClass="text-left !font-bold">
								{{ info.title }}
							</SofaNormalText>
							<SofaNormalText color="text-grayColor" customClass="text-left">
								{{ info.value }}
							</SofaNormalText>
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
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'
import { usePlansList, usePlan } from '@app/composables/payment/plans'

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
		const autoRenewIsOn = computed(() => !!wallet.value?.subscription.next)
		const { myPlans, currentPlan: myPlan } = usePlansList()
		const { subscribeToPlan, toggleRenewPlan } = usePlan()

		const myApplicablePlan = computed(() => myPlans.value.at(0) ?? null)

		const subscibeToPlan = async (id: string) => {
			await subscribeToPlan(id)
		}

		const toggleRenewal = async () => {
			await toggleRenewPlan({ renew: autoRenewIsOn.value })
		}

		return {
			Logic,
			formatTime,
			myApplicablePlan,
			myPlan,
			subscriptionInfo,
			wallet,
			userType,
			autoRenewIsOn,
			subscibeToPlan,
			toggleRenewal,
		}
	},
})
</script>
