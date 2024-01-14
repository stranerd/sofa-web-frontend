<template>
	<expanded-layout :hide="{ bottom: true }" width="mdlg:!w-[75%] lg:!w-[60%]" layout-style="mdlg:py-5">
		<div class="mdlg:hidden w-full flex items-center gap-3 justify-between bg-lightGray p-4">
			<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
			<SofaNormalText class="!font-bold !text-base">{{ title }}</SofaNormalText>
			<span class="w-4" />
		</div>

		<div v-if="!index" class="mdlg:hidden w-full">
			<slot />
		</div>

		<div :class="`${index ? 'grid' : 'hidden mdlg:grid'} flex-grow overflow-y-auto grid-cols-12 w-full gap-5 text-left`">
			<div class="mdlg:col-span-3 mdlg:flex col-span-full flex-col relative mdlg:px-0 px-4">
				<div class="flex flex-col gap-3 mdlg:p-4 mdlg:bg-white mdlg:rounded-2xl mdlg:gap-4 mdlg:shadow-custom">
					<div
						v-for="option in settingOptions"
						:key="option.title"
						class="flex flex-col gap-1 mdlg:gap-0 items-start bg-white p-2 mdlg:p-0 rounded-custom shadow-custom mdlg:shadow-none mdlg:border-none">
						<sofa-header-text size="xl" custom-class="px-2 hidden mdlg:block mb-2" :content="option.title" />
						<template v-for="(optionItem, i) in option.subPages" :key="optionItem.title">
							<router-link
								v-if="optionItem.show()"
								class="w-full flex flex-col items-start p-2 hover:bg-skyBlue rounded-lg"
								:class="{ 'border-t border-lightGray mdlg:border-none': i !== 0 }"
								exact-active-class="bg-lightBlue font-semibold"
								:to="optionItem.to">
								<sofa-normal-text :content="optionItem.title" />
							</router-link>
						</template>
					</div>

					<div class="border-t-2 border-darkLightGray mdlg:border-0 mt-1 mdlg:mt-0 pt-4 mdlg:pt-0 flex flex-col gap-3 mdlg:gap-0">
						<a
							v-for="action in [
								{ title: 'Logout', onClick: signout },
								{ title: 'Delete account', onClick: deleteAccount },
							]"
							:key="action.title"
							class="bg-white p-4 mdlg:p-2 rounded-custom shadow-custom mdlg:border-none mdlg:shadow-none mdlg:rounded-lg mdlg:hover:bg-lightBlue"
							@click="action.onClick">
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
	</expanded-layout>
</template>

<script setup lang="ts">
import { useAuth } from '@app/composables/auth/auth'
import { Logic } from 'sofa-logic'
import { defineProps } from 'vue'

defineProps({
	title: {
		type: String,
		required: true,
	},
	index: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const { userType, auth, signout, deleteAccount } = useAuth()

const settingOptions = [
	{
		title: 'Account',
		subPages: [
			{
				title: 'Profile',
				to: '/settings/profile',
				show: () => true,
			},
			{
				title: 'Organizations',
				to: '/settings/organizations',
				show: () => !userType.value.isOrg,
			},
			{
				title: 'Verification',
				to: '/verification',
				show: () => !auth.value?.roles.isVerified,
			},
			{
				title: 'Tutor Application',
				to: '/verification/tutor',
				show: () => userType.value.isTeacher,
			},
		],
	},
	{
		title: 'Billing',
		subPages: [
			{
				title: 'Wallet',
				to: '/settings/wallet',
				show: () => true,
			},
			{
				title: 'Subscription',
				to: '/settings/subscription',
				show: () => true,
			},
		],
	},
	{
		title: 'Preferences',
		subPages: [
			{
				title: 'Notifications',
				to: '/settings/notifications',
				show: () => true,
			},
			{
				title: 'Security',
				to: '/settings/security',
				show: () => true,
			},
		],
	},
	{
		title: 'Support',
		subPages: [
			{
				title: 'Contact us',
				to: '/settings/contact_us',
				show: () => true,
			},
		],
	},
]
</script>
