<template>
	<DashboardLayout :topbarOptions="{ title: 'Classes' }">
		<template #left-session>
			<span>Announcements</span>
		</template>

		<template #right-session>
			<span>Live Sessions</span>
		</template>

		<template #middle-session>
			<div v-if="classes.length === 0" class="h-full mdlg:h-auto flex flex-col justify-center p-4 mdlg:p-0">
				<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-2 p-4 mdlg:p-6">
					<div class="mdlg:bg-lightGray flex flex-col gap-2 p-4 mdlg:p-6 text-center items-center w-full">
						<img :src="emptyClassesContent.imageURL" class="w-[64px] h-[64px]" />
						<SofaHeaderText :content="emptyClassesContent.title" />
						<SofaNormalText :content="emptyClassesContent.sub" color="text-grayColor" />
						<router-link to="/classes/explore">
							<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-3 px-5">Explore</SofaButton>
						</router-link>
					</div>
				</div>
			</div>
			<template v-else>
				<div class="flex flex-col mdlg:flex-row gap-4 justify-between items-center px-4">
					<div class="flex gap-2 mdlg:gap-4 w-full items-center">
						<a
							v-for="t in tabs"
							:key="t"
							class="capitalize py-3 px-4 font-bold rounded-custom border bg-white border-darkLightGray"
							:class="{ '!bg-primaryPurple !text-white !border-primaryPurple': t === tab }"
							@click="tab = t">
							{{ t }}
						</a>
						<router-link class="ml-auto mdlg:hidden" to="/classes/explore">
							<SofaButton padding="py-3 px-5">Explore</SofaButton>
						</router-link>
					</div>
				</div>
			</template>
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

		const emptyClassesContent = {
			imageURL: '/images/empty-class.png',
			title: 'You are not in any class',
			sub: 'Explore classes to find ones you would like to join',
		}

		const tabs = ['active', 'saved']
		const tab = ref(tabs[0])

		const { classes } = useMyClassesIn()
		return { classes, tabs, tab, emptyClassesContent }
	},
})
</script>
