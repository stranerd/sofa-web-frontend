<template>
	<ExpandedLayout width="mdlg:!w-[75%] lg:!w-[60%]" layoutStyle="mdlg:py-5">
		<div class="mdlg:hidden w-full flex items-center gap-3 justify-between bg-lightGray p-4">
			<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
			<SofaHeading>{{ title }}</SofaHeading>
			<span class="w-4" />
		</div>

		<div v-if="!index" class="mdlg:hidden w-full">
			<slot />
		</div>

		<div :class="index ? 'grid' : 'hidden mdlg:grid'" class="grow overflow-y-auto grid-cols-12 w-full gap-5 text-left">
			<div class="mdlg:col-span-3 mdlg:flex col-span-full flex-col relative mdlg:px-0 px-4">
				<div class="flex flex-col gap-3 mdlg:p-2 mdlg:bg-white mdlg:rounded-2xl mdlg:gap-4 mdlg:shadow-custom">
					<div
						v-for="option in settingOptions"
						:key="option.title"
						class="flex flex-col gap-1 mdlg:gap-0 items-start bg-white p-2 mdlg:p-0 rounded-custom shadow-custom mdlg:shadow-none mdlg:border-none">
						<SofaHeading v-if="$screen.desktop" size="title" class="px-2 mb-2" :content="option.title" />
						<template v-for="(optionItem, i) in option.subPages" :key="optionItem.title">
							<SofaText
								v-if="optionItem.show()"
								as="router-link"
								:content="optionItem.title"
								class="w-full flex flex-col items-start p-2 hover:bg-lightBlue rounded-lg"
								:class="{ 'border-t border-lightGray mdlg:border-none': i !== 0 }"
								exactActiveClass="bg-lightBlue font-semibold"
								:to="optionItem.to" />
						</template>
					</div>

					<div class="border-t-2 border-darkLightGray mdlg:border-0 mt-1 mdlg:mt-0 pt-4 mdlg:pt-0 flex flex-col gap-3 mdlg:gap-0">
						<SofaText
							v-for="action in [
								{ title: 'Logout', onClick: signout },
								{ title: 'Delete account', onClick: deleteAccount },
							]"
							:key="action.title"
							as="a"
							:content="action.title"
							class="bg-white text-primaryRed p-4 mdlg:p-2 rounded-custom shadow-custom mdlg:border-none mdlg:shadow-none mdlg:rounded-lg mdlg:hover:bg-lightBlue"
							@click="action.onClick" />
					</div>
				</div>
			</div>

			<div class="col-span-full mdlg:col-span-9 grow overflow-y-auto">
				<slot />
			</div>
		</div>
	</ExpandedLayout>
</template>

<script setup lang="ts">
import { useAuth } from '@app/composables/auth/auth'

withDefaults(
	defineProps<{
		title: string
		index?: boolean
	}>(),
	{
		index: false,
	},
)

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
				to: '/settings/contact',
				show: () => true,
			},
		],
	},
]
</script>
