<template>
	<DashboardLayout :topbarOptions="{ title: 'Classes' }">
		<template #left-session>
			<span />
		</template>

		<template #right-session>
			<span />
		</template>

		<template #middle-session>
			<div v-if="classes.length === 0" class="h-full mdlg:h-auto flex flex-col justify-center p-4 mdlg:p-0">
				<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-2 p-4 mdlg:p-6">
					<div class="mdlg:bg-lightGray flex flex-col gap-2 p-4 mdlg:p-6 text-center items-center w-full">
						<img :src="emptyClassesContent.imageURL" class="w-[64px] h-[64px]" />
						<SofaHeaderText :content="emptyClassesContent.title" />
						<SofaNormalText :content="emptyClassesContent.sub" color="text-grayColor" />
						<router-link to="/classes/explore">
							<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-3 px-5">Explore </SofaButton>
						</router-link>
					</div>
				</div>
			</div>
			<template v-else>
				<div class="flex flex-col mdlg:flex-row gap-4 justify-between items-center px-4 mdlg:px-0">
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
					<div class="w-full flex items-center gap-4">
						<SofaTextField
							v-model="searchQuery"
							class="bg-white border border-darkLightGray rounded-custom flex-1"
							customClass="!border-none w-full"
							placeholder="Search">
							<template #inner-prefix>
								<SofaIcon name="search-black" class="h-[17px]" />
							</template>
						</SofaTextField>
						<router-link class="hidden mdlg:inline-block" to="/classes/explore">
							<SofaButton padding="py-3 px-5">Explore</SofaButton>
						</router-link>
					</div>
				</div>
				<div class="flex flex-col gap-4 items-start px-4 mdlg:px-0">
					<MyClassCard v-for="classInst in filteredClasses" :key="classInst.hash" :classInst="classInst" />
				</div>
			</template>
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import MyClassCard from '@app/components/organizations/classes/MyClassCard.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useClassesInList, useMyClassesIn } from '@app/composables/organizations/classes-explore'

export default defineComponent({
	name: 'Classes',
	components: { MyClassCard },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Classes',
		})

		const emptyClassesContent = {
			imageURL: '/images/empty-classes.png',
			title: 'You are not in any class',
			sub: 'Explore classes to find ones you would like to join',
		}

		const tabs = ['active', 'saved']
		const tab = ref(tabs[0])

		const searchQuery = ref('')
		const { user } = useAuth()
		const { classes } = useMyClassesIn()
		const { classes: savedClasses } = useClassesInList(computed(() => user.value?.account.saved.classes ?? []))

		const filteredClasses = computed(() => {
			const list = tab.value === 'saved' ? savedClasses.value : classes.value
			if (!searchQuery.value) return list
			return list.filter((c) => c.search(searchQuery.value))
		})

		return { classes, filteredClasses, tabs, tab, emptyClassesContent, searchQuery }
	},
})
</script>
