<template>
	<SettingsLayout title="Subscription">
		<div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<sofa-header-text :size="'xl'" :customClass="'text-left'"> My subscription </sofa-header-text>

				<sofa-normal-text :customClass="'text-left'" v-if="wallet.subscription.active == false">
					You have no active subscription
				</sofa-normal-text>
				<template v-else-if="wallet.subscription.current">
					<div class="w-full flex flex-col gap-3">
						<div class="w-full flex flex-col gap-2 items-start">
							<sofa-header-text :color="'text-primaryPurple !text-2xl !font-extrabold'">
								{{ myPlan?.title ?? 'Stranerd Premium' }}
							</sofa-header-text>

							<div class="w-full flex flex-col gap-1 pb-1">
								<sofa-normal-text> Expires {{ formatTime(wallet.subscription.current.expiredAt) }} </sofa-normal-text>
								<sofa-normal-text v-if="wallet.subscription.current.expiredAt > Date.now()">
									{{ Logic.Common.daysDiff(new Date(), new Date(wallet.subscription.current.expiredAt)) }}
									days left
								</sofa-normal-text>
								<sofa-normal-text v-else> Expired </sofa-normal-text>
							</div>

							<div
								v-if="wallet.subscription.current.expiredAt > Date.now()"
								class="w-full flex flex-row justify-between items-center gap-4 py-3 pb-1 border-t border-darkLightGray"
								@click="autoRenewIsOn = !autoRenewIsOn">
								<sofa-normal-text :customClass="'!font-bold'">Auto-renewal</sofa-normal-text>
								<div class="!w-auto">
									<sofa-icon :customClass="'h-[17px]'" :name="autoRenewIsOn ? 'toggle-on' : 'toggle-off'" />
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
					<sofa-header-text :size="'xl'" class="text-left capitalize">
						{{ myApplicablePlan.title }}
					</sofa-header-text>

					<div class="w-full flex flex-col gap-2">
						<div class="flex flex-row gap-2 items-center">
							<sofa-header-text :customClass="'text-left !text-2xl !font-bold'">
								{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }} per student
							</sofa-header-text>
							<sofa-normal-text :customClass="'!text-2xl'"> / month </sofa-normal-text>
						</div>

						<sofa-normal-text :customClass="'text-left'">
							Provide cost-free access to your paid courses for your physical students.
						</sofa-normal-text>

						<div class="flex flex-row pt-3">
							<sofa-button :padding="'px-5 py-2'" @click="subscibeToPlan(myApplicablePlan.id)"> Subscribe </sofa-button>
						</div>
					</div>
				</div>

				<div
					class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:p-5 p-4 shadow-custom"
					v-if="!userType.isOrg && myApplicablePlan">
					<sofa-header-text :size="'xl'" :customClass="'text-left w-full pb-2 border-b border-lightGray'">
						{{ myApplicablePlan.title }}
					</sofa-header-text>

					<div class="flex flex-row gap-2 items-center">
						<sofa-header-text :customClass="'text-left !text-2xl !font-bold'">
							{{ Logic.Common.formatPrice(myApplicablePlan.amount, myApplicablePlan.currency) }}
						</sofa-header-text>
						<sofa-normal-text :customClass="'!text-2xl'"> / month </sofa-normal-text>
					</div>

					<div class="w-full flex flex-col gap-3">
						<div
							:class="`w-full flex-col flex gap-1 pb-2 items-start ${
								index != subscriptionInfo.length - 1 ? 'border-b border-lightGray' : ''
							} `"
							v-for="(info, index) in subscriptionInfo"
							:key="index">
							<sofa-icon :customClass="'h-[23px] '" :name="info.icon" />
							<sofa-normal-text :customClass="'text-left !font-bold'">
								{{ info.title }}
							</sofa-normal-text>
							<sofa-normal-text :color="'text-grayColor'" :customClass="'text-left'">
								{{ info.value }}
							</sofa-normal-text>
						</div>
					</div>

					<div class="w-full flex flex-row">
						<div class="w-auto flex flex-row">
							<sofa-button @click="subscibeToPlan(myApplicablePlan.id)" :padding="'px-7 py-2'" :customClass="'!w-auto'">
								Subscribe
							</sofa-button>
						</div>
					</div>
				</div>
			</template>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from '@/components/settings/SettingsLayout.vue'
import { useAuth } from '@/composables/auth/auth'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'
import { SofaButton, SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: {
		SettingsLayout,
		SofaHeaderText,
		SofaNormalText,
		SofaButton,
		SofaIcon,
	},
	middlewares: {
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
	name: 'SubscriptionSettingPage',
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
			return plans.value.results.find((item) => item.usersFor.includes(userType.value.type)) ?? null
		})

		const myPlan = computed(() => {
			return plans.value.results.find((item) => item.id == wallet.value.subscription.current?.id) ?? null
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
