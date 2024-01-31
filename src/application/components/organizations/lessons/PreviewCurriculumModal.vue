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
			<SofaIcon v-if="curriculum_view === CurriculumView.grid" name="list_view" class="h-[20px] ml-auto" @click="toggleView" />
			<SofaIcon v-else name="grid_view" class="h-[20px] ml-auto" @click="toggleView" />
		</div>
		<LessonCurriculum :classInst="classInst" :view="curriculum_view" :curriculum="curriculum" :isModal="true" />
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ClassLesson, ClassEntity, CurriculumView } from '@modules/organizations'
defineProps<{
	close: () => void
	lesson: ClassLesson
	classInst: ClassEntity
	curriculum: ClassLesson['curriculum']
}>()
const curriculum_view = ref(CurriculumView.list)
const toggleView = () => {
	if (curriculum_view.value === CurriculumView.list) {
		curriculum_view.value = CurriculumView.grid
	} else {
		curriculum_view.value = CurriculumView.list
	}
}
</script>
