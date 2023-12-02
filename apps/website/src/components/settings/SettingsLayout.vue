<template>
	<expanded-layout :hide="{ bottom: true }" width="mdlg:!w-[75%] lg:!w-[60%]" layoutStyle="mdlg:py-5">
		<div
			class="mdlg:hidden w-full flex items-center gap-3 z-[10] justify-between bg-backgroundGray p-4 sticky top-0 left-0">
			<sofa-icon customClass="h-[15px]" :name="'back-arrow'" @click="Logic.Common.goBack()" />
			<sofa-normal-text customClass="!font-bold !text-base">{{ title }}</sofa-normal-text>
			<span class="w-4" />
		</div>

		<div v-if="!index" class="mdlg:hidden w-full">
			<slot />
		</div>

		<div :class="`${index ? 'grid' : 'hidden mdlg:grid'} flex-grow overflow-y-auto grid-cols-12 w-full gap-5 text-left`">
			<div class="mdlg:col-span-3 mdlg:flex col-span-full flex-col relative mdlg:px-0 px-4">
				<div
					class="flex flex-col gap-3 mdlg:p-4 mdlg:bg-white mdlg:rounded-2xl mdlg:gap-4 mdlg:shadow-custom">
					<div v-for="option in settingOptions" :key="option.title"
						class="flex flex-col gap-1 mdlg:gap-0 items-start bg-white p-2 mdlg:p-0 rounded-custom shadow-custom mdlg:shadow-none mdlg:border-none">
						<sofa-header-text size="xl" customClass="px-2 hidden mdlg:block mb-2" :content="option.title" />
						<template v-for="(optionItem, index) in option.subPages" :key="optionItem.title">
							<router-link :class="`w-full flex flex-col items-start p-2 mdlg:hover:bg-[#E2F3FD] rounded-lg
								${index !== 0 ? 'border-t border-[#F1F6FA] mdlg:border-none' : ''}`"
								exact-active-class="font-semibold mdlg:bg-[#E2F3FD]" :to="optionItem.to"
								v-if="optionItem.show()">
								<sofa-normal-text :content="optionItem.title" />
							</router-link>
						</template>
					</div>

					<div
						class="border-t-2 border-[#E1E6EB] mdlg:border-0 mt-1 mdlg:mt-0 pt-4 mdlg:pt-0 flex flex-col gap-3 mdlg:gap-0">
						<a v-for="action in [
							{ title: 'Logout', onClick: () => showLogout = true },
							{ title: 'Delete account', onClick: () => showDeleteAccount = true }
						]" :key="action.title" @click="action.onClick"
							class="bg-white p-4 mdlg:p-2 rounded-custom shadow-custom mdlg:border-none mdlg:shadow-none mdlg:rounded-[8px] mdlg:hover:bg-[#E2F3FD]">
							<sofa-normal-text color="text-primaryRed">
								{{ action.title }}
							</sofa-normal-text>
						</a>
					</div>
				</div>
			</div>

			<div class="col-span-full mdlg:col-span-9 flex-grow overflow-y-auto">
				<slot />
			</div>
		</div>

		<sofa-delete-prompt v-if="showLogout" :title="'Are you sure you want to logout?'" subTitle=""
			:close="() => showLogout = false" :buttons="[
				{
					label: 'No',
					isClose: true,
					action: () => showLogout = false,
				},
				{
					label: 'Yes, log me out',
					isClose: false,
					action: () => Logic.Auth.SignOut()
				},
			]" />
		<sofa-delete-prompt v-if="showDeleteAccount" :title="'Are you sure?'"
			:subTitle="`This action is permanent. All your learning resources and setups will be lost`"
			:close="() => showDeleteAccount = false" :buttons="[
				{
					label: 'No',
					isClose: true,
					action: () => showDeleteAccount = false
				},
				{
					label: 'Yes, delete account',
					isClose: false,
					action: () => Logic.Auth.DeleteUserAccount()
				},
			]" />
	</expanded-layout>
</template>

<script setup lang="ts">
import { Logic } from "sofa-logic"
import { SofaDeletePrompt, SofaHeaderText, SofaIcon, SofaNormalText } from "sofa-ui-components"
import { defineProps, ref } from 'vue'

defineProps({
	title: {
		type: String,
		required: true
	},
	index: {
		type: Boolean,
		required: false,
		default: false
	}
})

const showLogout = ref(false)
const showDeleteAccount = ref(false)

const settingOptions = [
	{
		title: "Account",
		subPages: [
			{
				title: "Profile",
				to: "/settings/profile",
				show: () => true,
			},
			{
				title: "Students",
				to: "/settings/students",
				show: () => Logic.Users.UserProfile?.type?.type == "organization"
			},
			{
				title: "Organizations",
				to: "/settings/organizations",
				show: () => Logic.Users.UserProfile?.type?.type == "student"
			},
			{
				title: "Verification",
				to: "/verification",
				show: () => !Logic.Users.UserProfile?.roles?.isVerified,
			},
			{
				title: "Tutor Application",
				to: "/verification/tutor",
				show: () => Logic.Users.UserProfile?.type.type == "teacher",
			},
		],
	},
	{
		title: "Billing",
		subPages: [
			{
				title: "Wallet",
				to: "/settings/wallet",
				show: () => true,
			},
			{
				title: "Subscription",
				to: "/settings/subscription",
				show: () => true,
			},
		],
	},
	{
		title: "Preferences",
		subPages: [
			{
				title: "Notifications",
				to: "/settings/notifications",
				show: () => true,
			},
			{
				title: "Security",
				to: "/settings/security",
				show: () => true,
			},
		],
	},
	{
		title: "Support",
		subPages: [
			{
				title: "Contact us",
				to: "/settings/contact_us",
				show: () => true,
			},
		],
	},
]
</script>