<template>
	<DashboardLayout :title="title" :index="index">
		<div
			v-if="$screen.desktop"
			class="bg-white text-bodyBlack py-4 px-6 rounded-t-2xl border-b border-lightGray flex items-center gap-4">
			<SofaIcon v-if="!index" class="h-[15px]" name="back-arrow" @click="$utils.goBack()" />
			<div class="flex items-center gap-1 shrink-0">
				<template v-for="(breadcrumb, i) in breadcrumbs" :key="i">
					<SofaText
						as="router-link"
						:to="breadcrumb.to"
						:content="breadcrumb.text"
						:class="i === breadcrumbs.length - 1 ? 'text-deepGray' : 'text-grayColor'" />
					{{ i !== breadcrumbs.length - 1 ? '/' : '' }}
				</template>
			</div>
			<SofaInput v-model="searchQuery" placeholder="Search" type="search" class="max-w-[300px] ml-auto" padding="p-3">
				<template #prefix>
					<SofaIcon name="search" class="h-[16px]" />
				</template>
			</SofaInput>
			<SofaButton
				v-if="primary"
				bgColor="bg-primaryBlue"
				padding="py-3 px-6"
				textColor="text-white"
				class="border border-primaryBlue"
				@click="primary.action()">
				{{ primary.label }}
			</SofaButton>
		</div>
		<slot :searchQuery="searchQuery" :filteredItems="filteredItems" />
	</DashboardLayout>
</template>

<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'

type ButtonConfig = {
	action: () => void
	label: string
}

const props = withDefaults(
	defineProps<{
		title: string
		index?: boolean
		breadcrumbs: { text: string; to: string }[]
		filter: (query: string) => T[]
		primary?: ButtonConfig
	}>(),
	{
		index: false,
		primary: undefined,
	},
)

const searchQuery = ref('')
const filteredItems = computed(() => props.filter(searchQuery.value))
</script>
