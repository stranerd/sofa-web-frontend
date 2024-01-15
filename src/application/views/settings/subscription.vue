<template>
	<SettingsLayout title="Subscription">
		<div v-if="wallet" class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<SofaHeaderText :size="'xl'" :custom-class="'text-left'"> My subscription </SofaHeaderText>

				<SofaNormalText v-if="wallet.subscription.active == false" :custom-class="'text-left'">
					You have no active subscription
				</SofaNormalText>
				<template v-else-if="wallet.subscription.current">
					<div class="w-full flex flex-col gap-3">
						<div class="w-full flex flex-col gap-2 items-start">
							<SofaHeaderText :color="'text-primaryPurple !text-2xl !font-extrabold'">
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

							<div
								v-if="wallet.subscription.current.expiredAt > Date.now()"
								class="w-full flex flex-row justify-between items-center gap-4 py-3 pb-1 border-t border-darkLightGray"
								@click="autoRenewIsOn = !autoRenewIsOn">
								<SofaNormalText :custom-class="'!font-bold'">Auto-renewal</SofaNormalText>
								<div class="!w-auto">
									<SofaIcon :custom-class="'h-[17px]'" :name="autoRenewIsOn ? 'toggle-on' : 'toggle-off'" />
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>

			<template v-if="wallet.subscription.active">
				<div
					v-if="userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
					<SofaHeaderText :size="'xl'" class="text-left capitalize">
						{{ myApplicablePlan.title }}
					</SofaHeaderText>

					<div class="w-full flex flex-col gap-2">
						<div class="flex flex-row gap-2 items-center">
							<SofaHeaderText :custom-class="'text-left !text-2xl !font-bold'">
								{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }} per student
							</SofaHeaderText>
							<SofaNormalText :custom-class="'!text-2xl'"> / month </SofaNormalText>
						</div>

						<SofaNormalText :custom-class="'text-left'">
							Provide cost-free access to your paid courses for your physical students.
						</SofaNormalText>

						<div class="flex flex-row pt-3">
							<SofaButton :padding="'px-5 py-2'" @click="subscibeToPlan(myApplicablePlan.id)"> Subscribe </SofaButton>
						</div>
					</div>
				</div>

				<div
					v-if="!userType.isOrg && myApplicablePlan"
					class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom">
					<SofaHeaderText :size="'xl'" :custom-class="'text-left w-full pb-2 border-b border-lightGray'">
						{{ myApplicablePlan.title }}
					</SofaHeaderText>

					<div class="flex flex-row gap-2 items-center">
						<SofaHeaderText :custom-class="'text-left !text-2xl !font-bold'">
							{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
						</SofaHeaderText>
						<SofaNormalText :custom-class="'!text-2xl'"> / month </SofaNormalText>
					</div>

					<div class="w-full flex flex-col gap-3">
						<div
							v-for="(info, index) in subscriptionInfo"
							:key="index"
							:class="`w-full flex-col flex gap-1 pb-2 items-start ${
								index != subscriptionInfo.length - 1 ? 'border-b border-lightGray' : ''
							} `">
							<SofaIcon :custom-class="'h-[23px] '" :name="info.icon" />
							<SofaNormalText :custom-class="'text-left !font-bold'">
								{{ info.title }}
							</SofaNormalText>
							<SofaNormalText :color="'text-grayColor'" :custom-class="'text-left'">
								{{ info.value }}
							</SofaNormalText>
						</div>
					</div>

					<div class="w-full flex flex-row">
						<div class="w-auto flex flex-row">
							<SofaButton :padding="'px-7 py-2'" :custom-class="'!w-auto'" @click="subscibeToPlan(myApplicablePlan.id)">
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
import SettingsLayout from '@app/components/settings/SettingsLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'SubscriptionSettingPage',
	components: { SettingsLayout },
	routeConfig: {
		fetchRules: [
			{
				domain: 'Payment',
				property: 'AllPlans',
				method: 'GetPlans',
				params: [],
				requireAuth: true,
				ignoreProperty: false,
			},
		],
		goBackRoute: '/settings',
	},
	setup() {
		useMeta({
			title: 'Subscription',
		})

		const autoRenewIsOn = ref(true)
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
		]

		const { userType, wallet } = useAuth()

		const plans = ref(Logic.Payment.AllPlans)

		const myApplicablePlan = computed(() => {
			return plans.value?.results.find((item) => item.usersFor.includes(userType.value.type)) ?? null
		})

		const myPlan = computed(() => {
			return plans.value?.results.find((item) => item.id == wallet.value?.subscription.current?.id) ?? null
		})

		const subscibeToPlan = (id: string) => {
			Logic.Payment.SubscribeToPlan(id).then((data) => {
				if (data) {
					Logic.Common.showAlert({
						message: 'Subscription successful',
						type: 'success',
					})
				}
			})
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
		}
	},
})
</script>
