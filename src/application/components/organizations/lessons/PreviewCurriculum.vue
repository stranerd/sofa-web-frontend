<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Preview" />

			<div>
				<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
			</div>
		</div>
		<div class="flex items-center gap-3 py-2">
			<button class="text-[14px] font-700 pb-2 h-full text-primaryPurple border-b-2 border-primaryPurple">
				{{ selectedLesson.title }}
			</button>
		</div>
		<LessonCurriculum
			:classInst="classInst"
			:view="CurriculumView.list"
			:curriculum="curriculum"
			:factory="undefined"
			:lesson="selectedLesson"
			:isModal="true" />
	</div>
</template>

<script lang="ts" setup>
// import { computed, ref, watch, onMounted } from 'vue'
import { ClassLesson, ClassEntity, CurriculumView } from '@modules/organizations'
defineProps<{
	close: () => void
	selectedLesson: ClassLesson
	classInst: ClassEntity
	curriculum: ClassLesson['curriculum']
}>()
</script>
