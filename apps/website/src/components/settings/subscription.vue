<template>
	<div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
		<div class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
			<sofa-header-text :size="'xl'" :customClass="'text-left'">
				My subscription
			</sofa-header-text>

			<sofa-normal-text :customClass="'text-left'" v-if="userWallet.subscription.active == false">
				You have no active subscription
			</sofa-normal-text>
			<template v-else>
				<div class="w-full flex flex-col gap-3">
					<div class="w-full flex flex-col gap-2 items-start">
						<sofa-header-text :color="'text-primaryPurple !text-2xl !font-extrabold'">
							{{
								userWallet.subscription.current.id == "premium-plan"
									? "Stranerd Premium"
									: "Stranerd for organization"
							}}
						</sofa-header-text>

						<div class="w-full flex flex-col gap-1 pb-1">
							<sofa-normal-text>
								Expires
								{{
									Logic.Common.fomartDate(
										userWallet.subscription.current.expiredAt,
										"MMMM D YYYY"
									)
								}}
							</sofa-normal-text>
							<sofa-normal-text v-if="Logic.Common.momentInstance(
								userWallet.subscription.current.expiredAt
							).diff(Logic.Common.momentInstance(new Date()), 'days') > 0
							">
								{{
									Logic.Common.momentInstance(
										userWallet.subscription.current.expiredAt
									).diff(Logic.Common.momentInstance(new Date()), "days")
								}}
								days left
							</sofa-normal-text>
							<sofa-normal-text v-else> Expired </sofa-normal-text>
						</div>

						<div class="w-full flex flex-row justify-between items-center gap-4 py-3 pb-1 border-t border-darkLightGray"
							@click="
								autoRenewIsOn ? (autoRenewIsOn = false) : (autoRenewIsOn = true)
							">
							<sofa-normal-text :customClass="'!font-bold'">Auto-renewal</sofa-normal-text>
							<div class="!w-auto">
								<sofa-icon :customClass="'h-[17px]'" :name="autoRenewIsOn ? 'toggle-on' : 'toggle-off'" />
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>

		<template v-if="!userWallet.subscription.active">
			<div v-if="Logic.Users.getUserType() == 'organization'"
				class="w-full flex flex-col gap-3 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<sofa-header-text :size="'xl'" :customClass="'text-left'">
					Stranerd Suite
				</sofa-header-text>

				<div class="w-full flex flex-col gap-2">
					<div class="flex flex-row gap-2 items-center">
						<sofa-header-text :customClass="'text-left !text-2xl !font-bold'">
							{{
								Logic.Common.convertToMoney(
									AllPlans.results.filter(
										(item) => item.id == "organization-plan"
									)[0]?.amount,
									false,
									"ngn"
								)
							}}
							per student
						</sofa-header-text>
						<sofa-normal-text :customClass="'!text-2xl'">
							/ month
						</sofa-normal-text>
					</div>

					<sofa-normal-text :customClass="'text-left'">
						Provide cost-free access to your paid courses for your physical
						students.
					</sofa-normal-text>

					<div class="flex flex-row pt-3">
						<sofa-button :padding="'px-5 py-2'" @click="subscibeToPlan('organization-plan')">
							Subscribe
						</sofa-button>
					</div>
				</div>
			</div>

			<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
				v-if="Logic.Users.getUserType() == 'student'">
				<sofa-header-text :size="'xl'" :customClass="'text-left w-full pb-2 border-b border-lightGray'">
					StranerdPlus
				</sofa-header-text>

				<div class="w-full flex flex-col gap-3">
					<div :class="`w-full flex-col gap-1 pb-2 items-start ${index != subscriptionInfo.length - 1
						? 'border-b border-lightGray'
						: ''
					} `" v-for="(info, index) in subscriptionInfo" :key="index">
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
						<sofa-button @click="subscibeToPlan('premium-plan')" :padding="'px-7 py-2'" :customClass="'!w-auto'">
							Subscribe
						</sofa-button>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script lang="ts">
import { FormValidations } from '@/composables'
import { Logic } from 'sofa-logic'
import {
	SofaButton,
	SofaHeaderText,
	SofaIcon,
	SofaNormalText,
} from 'sofa-ui-components'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
	components: {
		SofaHeaderText,
		SofaNormalText,
		SofaButton,
		SofaIcon,
	},
	setup () {
		const userWallet = ref(Logic.Payment.UserWallet)
		const autoRenewIsOn = ref(true)
		const subscriptionInfo = [
			{
				title: 'Expert help',
				value:
          'Get step-by-step solutions from expert tutors and AI, no matter how hard the problem.',
				icon: 'expert-help',
			},
			{
				title: 'Customized resources',
				value:
          'Access top learning materials tailored to your curriculum from verified experts.',
				icon: 'customized-material',
			},
			{
				title: 'Fun challenges',
				value:
          'Compete against friends and classmates in unlimited gaming challenges.',
				icon: 'challenges',
			},
			{
				title: 'Study offline',
				value: 'Stay focused and download our resources for offline studying.',
				icon: 'study-offline',
			},
		]

		const AllPlans = ref(Logic.Payment.AllPlans)

		onMounted(() => {
			Logic.Payment.watchProperty('UserWallet', userWallet)
		})

		const subscibeToPlan = (type: 'premium-plan' | 'organization-plan') => {
			Logic.Payment.SubscribeToPlan(type).then((data) => {
				if (data) {
					Logic.Common.showAlert({
						message: 'Subscription successful',
						type: 'success',
					})
				}
			})
		}



		return {
			FormValidations,
			Logic,
			subscriptionInfo,
			userWallet,
			AllPlans,
			autoRenewIsOn,
			subscibeToPlan,
		}
	},
})
</script>
