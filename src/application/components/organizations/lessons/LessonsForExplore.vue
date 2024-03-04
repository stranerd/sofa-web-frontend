<template>
	<div class="w-[70%] flex flex-col">
		<div class="w-full">
			<div class="flex items-center justify-between pb-3">
				<SofaHeaderText content="Curriculum" customClass="!text-xl" />
				<SofaIcon :name="curriculumViewIcon" class="h-[20px] ml-auto" @click="toggleView" />
			</div>
			<div v-if="curriculum.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray py-10 rounded-md">
				<img src="/images/empty-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center">
					{{ 'No curriculum set yet!' }}
				</SofaNormalText>
			</div>
			<div v-else class="bg-lightGray p-4 rounded-md">
				<LessonCurriculum
					:classInst="classInst"
					:lesson="lesson"
					:view="curriculumView"
					:curriculum="curriculum"
					class="bg-white rounded-md p-4"
					:disableClick="true" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCurriculumViewToggle, useLessonCurriculum } from '@app/composables/organizations/lessons'
import { ClassEntity, ClassLesson } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	lesson: ClassLesson
}>()

const { curriculum } = useLessonCurriculum(
	props.classInst,
	computed(() => props.lesson.curriculum),
)
const { curriculumView, curriculumViewIcon, toggleView } = useCurriculumViewToggle()
</script>
