<template>
	<div class="p-4 flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Preview" />
			<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
		</div>
		<div class="flex items-center justify-center">
			<SofaNormalText color="text-primaryPurple" class="text-[14px] font-700 pb-2 h-full border-b-2 border-primaryPurple">
				{{ lesson.title }}
			</SofaNormalText>
			<SofaIcon :name="curriculumViewIcon" class="h-[20px] ml-auto" @click="toggleView" />
		</div>
		<LessonCurriculum :classInst="classInst" :view="curriculumView" :curriculum="curriculum" :isModal="true" />
	</div>
</template>

<script lang="ts" setup>
import { ClassLesson, ClassEntity } from '@modules/organizations'
import { useCurriculumViewToggle } from '@app/composables/organizations/lessons'
defineProps<{
	close: () => void
	lesson: ClassLesson
	classInst: ClassEntity
	curriculum: ClassLesson['curriculum']
}>()
const { curriculumView, curriculumViewIcon, toggleView } = useCurriculumViewToggle()
</script>
