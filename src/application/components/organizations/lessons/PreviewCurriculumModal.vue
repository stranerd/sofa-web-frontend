<template>
	<div class="p-4 flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Preview" />
			<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
		</div>
		<SofaNormalText color="text-primaryPurple" class="text-[14px] font-700 pb-2 h-full border-b-2 border-primaryPurple">
			{{ lesson.title }}
		</SofaNormalText>
		<LessonCurriculum :classInst="classInst" :view="CurriculumView.list" :curriculum="curriculum" :isModal="true" />
	</div>
</template>

<script lang="ts" setup>
import { ClassLesson, ClassEntity, CurriculumView } from '@modules/organizations'
defineProps<{
	close: () => void
	lesson: ClassLesson
	classInst: ClassEntity
	curriculum: ClassLesson['curriculum']
}>()
</script>
