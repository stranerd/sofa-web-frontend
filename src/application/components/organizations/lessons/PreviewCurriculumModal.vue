<template>
	<div class="p-4 flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText v-if="isPreview" class="!font-bold !text-deepGray" content="Preview" />
			<SofaIcon class="h-[16px]" :class="isPreview ? '' : 'ml-auto'" name="circle-close" @click="close" />
		</div>
		<div class="flex items-center justify-center">
			<SofaNormalText
				v-if="isPreview"
				color="text-primaryPurple"
				class="text-[14px] font-700 pb-2 h-full border-b-2 border-primaryPurple">
				{{ lesson.title }}
			</SofaNormalText>
			<SofaHeaderText v-else class="!font-bold !text-deepGray" content="Curriculum" />
			<SofaIcon :name="curriculumViewIcon" class="h-[20px] ml-auto" @click="toggleView" />
		</div>
		<LessonCurriculum :classInst="classInst" :lesson="lesson" :view="curriculumView" :curriculum="curriculum" :isModal="true" />
	</div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useCurriculumViewToggle } from '@app/composables/organizations/lessons'
import { ClassEntity, ClassLesson } from '@modules/organizations'

const props = defineProps<{
	close: () => void
	lesson: ClassLesson
	classInst: ClassEntity
	curriculum: ClassLesson['curriculum']
	isPreview: boolean
}>()
const { curriculumView, curriculumViewIcon, toggleView } = useCurriculumViewToggle()

watch(
	() => $screen.width,
	() => {
		if ($screen.desktop && !props.isPreview) props.close()
	},
	{ immediate: true },
)
</script>
