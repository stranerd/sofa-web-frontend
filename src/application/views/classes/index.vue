<template>
	<DashboardLayout :topbarOptions="{ title: 'Classes' }">
		<template #left-session>
			<span>Announcements</span>
		</template>

		<template #right-session>
			<span>Live Sessions</span>
		</template>

		<template #middle-session>
			<div class="flex flex-col mdlg:flex-row gap-4 justify-between items-center px-4">
				<div class="flex gap-2 mdlg:gap-4 w-full items-center">
					<a
						v-for="t in tabs"
						:key="t"
						class="capitalize py-3 px-4 font-bold rounded-custom border bg-white border-darkLightGray"
						:class="{ '!bg-primaryBlue !text-white !border-primaryBlue': t === tab }"
						@click="tab = t">
						{{ t }}
					</a>
					<router-link class="ml-auto mdlg:hidden" to="/classes/explore">
						<SofaButton padding="py-3 px-5">Explore</SofaButton>
					</router-link>
				</div>
			</div>
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { useMyClassesIn } from '@app/composables/organizations/classes-explore'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'Classes',
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Classes',
		})

		const tabs = ['active', 'saved']
		const tab = ref(tabs[0])

		const { classes } = useMyClassesIn()
		return { classes, tabs, tab }
	},
})
</script>
