<template>
	<FullLayout :topbarOptions="{ title }" :hide="{ right: true }">
		<template #left-session>
			<div class="w-full min-h-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col p-4 gap-4">
				<div v-for="(tab, index) in tabs" :key="index" class="min-h-[120px] min-w-full border-b-[#F1F6FA] border-b-2">
					<SofaNormalText :content="tab.title" class="text-grayColor p-2" />
					<div class="flex flex-col gap-2">
						<div v-for="item in tab.items" :key="item.link">
							<RouterLink
								:to="item.link"
								class="w-full flex items-center gap-3 h-[34px] p-2"
								activeClass="bg-blue-100 rounded font-bold">
								<SofaIcon class="h-[15px]" :name="item.icon" />
								<SofaNormalText :content="item.name" class="text-[10px]" />
							</RouterLink>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template #middle-session>
			<div class="min-h-full rounded-[22px] flex flex-col grow overflow-y-auto mdlg:mr-4 bg-white">
				<slot />
			</div>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMeta } from 'vue-meta'
import { RouterLink } from 'vue-router'
const props = withDefaults(
	defineProps<{
		title: string
	}>(),
	{
		title: '',
	},
)
const tabs = {
	// general: {
	// 	title: 'General',
	// 	items: [
	// 		{
	// 			name: 'Dashboard',
	// 			link: '/admin/applications/tutors',
	// 			icon: 'tutor' as const,
	// 		},
	// 		{
	// 			name: 'Analytics',
	// 			link: '/admin/applications/verifications',
	// 			icon: 'verify-stroke' as const,
	// 		},
	// 		{
	// 			name: 'Report',
	// 			link: '/admin/applications/verifications',
	// 			icon: 'verify-stroke' as const,
	// 		},
	// 		{
	// 			name: 'Sales',
	// 			link: '/admin/applications/verifications',
	// 			icon: 'verify-stroke' as const,
	// 		},
	// 	],
	// },
	applications: {
		title: 'Applications',
		items: [
			{
				name: 'Tutor',
				link: '/admin/applications/tutors',
				icon: 'tutor' as const,
			},
			{
				name: 'Verification',
				link: '/admin/applications/verifications',
				icon: 'verify-stroke' as const,
			},
		],
	},
}
useMeta(
	computed(() => ({
		title: props.title,
	})),
)
</script>

<style scoped></style>
