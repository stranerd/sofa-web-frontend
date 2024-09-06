<template>
	<FullLayout :topbarOptions="{ title }" :hide="{ right: true }">
		<template #left-session>
			<div class="w-full min-h-screen shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col px-4">
				<div
					v-for="(tab, index) in tabs"
					:key="index"
					class="w-full flex flex-col py-2"
					:class="{ 'border-t-2 border-b-lightGray': index !== 0 }">
					<SofaText :content="tab.title" class="text-grayColor p-2.5" />
					<router-link
						v-for="item in tab.items"
						:key="item.link"
						:to="item.link"
						class="w-full flex items-center gap-3 p-2.5 rounded-lg"
						activeClass="bg-lightBlue font-bold">
						<SofaIcon class="h-[1.25em] fill-black" :name="item.icon" />
						<SofaText :content="item.name" />
					</router-link>
				</div>
			</div>
		</template>
		<template #middle-session>
			<div class="flex flex-col grow overflow-y-auto mdlg:mr-4">
				<slot />
			</div>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed } from 'vue'

const props = defineProps<{
	title: string
}>()

const tabs = [
	{
		title: 'Applications',
		items: [
			{
				name: 'Tutor',
				link: '/admin/applications/tutors',
				icon: 'tutor',
			},
			{
				name: 'Verification',
				link: '/admin/applications/verifications',
				icon: 'verify-stroke',
			},
		],
	},
	{
		title: 'Accounts',
		items: [
			{
				name: 'Admins',
				link: '/admin/accounts/admins',
				icon: 'admin',
			},
			{
				name: 'Students',
				link: '/admin/accounts/students',
				icon: 'users',
			},
			{
				name: 'Teachers',
				link: '/admin/accounts/teachers',
				icon: 'tutor',
			},
			{
				name: 'Organizations',
				link: '/admin/accounts/organizations',
				icon: 'organization',
			},
		],
	},
	{
		title: 'Resources',
		items: [
			{
				name: 'Quizzes',
				link: '/admin/resources/quizzes',
				icon: 'quiz',
			},
			{
				name: 'Courses',
				link: '/admin/resources/courses',
				icon: 'courses',
			},
			{
				name: 'Classes',
				link: '/admin/resources/classes',
				icon: 'classes',
			},
		],
	},
] as const

useHead(
	computed(() => ({
		title: props.title,
	})),
)
</script>
