<template>
	<FullLayout :topbarOptions="{ title: 'Classes' }">
		<template #left-session>
			<span />
		</template>

		<template #right-session>
			<span />
		</template>

		<template #middle-session>
			<div v-if="!classes.length" class="px-4">
				<EmptyState
					image="classes"
					title="You are not in any class"
					sub="Explore classes to find ones you would like to join"
					class="bg-white"
					:primary="{ label: 'Explore', action: () => $router.push('/marketplace/classes') }" />
			</div>
			<template v-else>
				<div class="flex flex-col mdlg:flex-row gap-4 justify-between items-center px-4 mdlg:px-0">
					<div class="flex gap-2 mdlg:gap-4 w-full items-center">
						<SofaText
							v-for="t in tabs"
							:key="t"
							as="a"
							class="capitalize py-2 px-4 rounded-xl border bg-white border-darkLightGray"
							:class="{ '!bg-primaryPurple !text-white !border-primaryPurple': t === tab }"
							@click="tab = t">
							{{ t }}
						</SofaText>
						<router-link class="ml-auto mdlg:hidden" to="/marketplace/classes">
							<SofaButton padding="py-3 px-5">Explore</SofaButton>
						</router-link>
					</div>
					<div class="w-full flex items-center gap-4">
						<SofaInput
							v-model="searchQuery"
							placeholder="Search"
							type="search"
							class="grow rounded-custom bg-white"
							padding="p-3">
							<template #prefix>
								<SofaIcon name="search" class="h-[16px]" />
							</template>
						</SofaInput>
						<router-link class="hidden mdlg:inline-block" to="/marketplace/classes">
							<SofaButton padding="py-3 px-5">Explore</SofaButton>
						</router-link>
					</div>
				</div>
				<div class="flex flex-col gap-4 items-start px-4 mdlg:px-0">
					<ClassCard v-for="classInst in filteredClasses" :key="classInst.hash" :classInst="classInst">
						<template #side-icons>
							<SofaIcon class="h-[18px]" name="share" @click.stop.prevent="shareClass(classInst)" />
						</template>
					</ClassCard>
				</div>
			</template>
		</template>
	</FullLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { ClassEntity } from '@modules/organizations'
import { useAuth } from '@app/composables/auth/auth'
import { useClassesInList, useMyClasses } from '@app/composables/organizations/classes-explore'

export default defineComponent({
	name: 'ClassesIndexPage',
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Classes',
		})

		const tabs = ['active', 'saved']
		const tab = ref(tabs[0])

		const searchQuery = ref('')
		const { user } = useAuth()
		const { classes } = useMyClasses()
		const { classes: savedClasses } = useClassesInList(computed(() => user.value?.account.saved.classes ?? []))

		const filteredClasses = computed(() => {
			const list = tab.value === 'saved' ? savedClasses.value : classes.value
			if (!searchQuery.value) return list
			return list.filter((c) => c.search(searchQuery.value))
		})

		const shareClass = (classInst: ClassEntity) => {
			$utils.share(`Join ${classInst.title} class on SOFA`, classInst.description, classInst.shareLink)
		}

		return { classes, filteredClasses, tabs, tab, searchQuery, shareClass }
	},
})
</script>
