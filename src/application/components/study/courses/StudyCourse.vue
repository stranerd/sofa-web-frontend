<template>
	<div class="flex flex-col mdlg:grid grid-cols-12 gap-4">
		<div
			v-if="$screen.desktop || !selectedItem"
			class="col-span-3 w-full p-4 gap-4 flex flex-col mdlg:shadow-custom bg-white mdlg:rounded-2xl overflow-y-auto"
			:class="$screen.desktop ? 'h-fit max-h-full' : 'h-full'">
			<div class="w-full flex items-center justify-between gap-2">
				<SofaHeading :content="title" size="mid" />
				<SofaButton v-if="rate && $screen.desktop" padding="px-4 py-1" @click="rate"> Rate </SofaButton>
				<span v-else class="w-4" />
			</div>
			<SofaText v-if="description" :content="description" />
			<CourseSections v-model:selectedItem="selectedItem" :sections="sections" />
		</div>
		<div
			v-if="$screen.desktop || selectedItem"
			class="col-span-9 w-full px-4 pt-4 pb-2 mdlg:pb-4 gap-2 flex flex-col mdlg:shadow-custom bg-white mdlg:rounded-2xl overflow-y-auto"
			:class="$screen.desktop ? 'h-fit max-h-full' : 'h-full'">
			<div v-if="!$screen.desktop" class="flex items-center justify-between gap-4 mb-2">
				<SofaIcon class="h-[15px]" name="arrow-left" @click="selectedItem = null" />
				<SofaHeading :content="title" size="mid" />
				<span class="w-4" />
			</div>
			<div v-if="selectedItem" class="grow overflow-y-auto">
				<EmbeddedSection v-if="hasAccess" :key="selectedItem.id" v-bind="embeddedProps" :item="selectedItem" />
				<slot v-else name="noAccess" />
			</div>
			<CourseSections v-if="!$screen.desktop" v-model:selectedItem="selectedItem" :sections="sections" class="shrink-0" list />
		</div>
		<Teleport v-if="rate && !$screen.desktop" to="body">
			<a
				class="size-[60px] absolute bottom-[3%] right-[2%] z-[100] flex flex-col justify-center items-center rounded-full shadow-custom bg-primaryBlue text-white"
				@click="rate">
				<SofaIcon name="star" class="h-[15px] fill-current" />
				<SofaText content="Rate" />
			</a>
		</Teleport>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import EmbeddedSection from '@app/components/core/EmbeddedSection.vue'
import CourseSections from '@app/components/study/courses/CourseSections.vue'
import { ExtendedCourseSections, ExtendedCourseSectionItem } from '@modules/study'

defineProps<{
	title: string
	hasAccess: boolean
	sections: ExtendedCourseSections
	description?: string
	rate?: () => void
	embeddedProps: Omit<InstanceType<typeof EmbeddedSection>['$props'], 'item'>
}>()

const selectedItem = ref<ExtendedCourseSectionItem | null>(null)
</script>
