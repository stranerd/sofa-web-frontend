<template>
	<div class="p-4 h-full flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px]" name="back-arrow" :class="canPrev ? 'fill-black' : 'fill-grayColor'" @click="prev" />
				<SofaIcon class="h-[16px]" name="arrow-right" :class="canNext ? 'fill-black' : 'fill-grayColor'" @click="next" />
				<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
			</div>
		</div>
		<EmbeddedSection
			v-if="curriculumItem"
			class="h-full overflow-y-auto"
			:item="curriculumItem"
			:classInst="classInst"
			:lesson="lesson" />
		<div v-if="curriculumSection" class="flex flex-col gap-2">
			<SofaHeaderText>{{ itemTitle }}</SofaHeaderText>
			<SofaNormalText>{{ lesson.title }}/{{ curriculumSection.label }}</SofaNormalText>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import EmbeddedSection from '@app/components/core/EmbeddedSection.vue'
import { ClassEntity, ClassLesson, ClassLessonable, ExtendedCurriculum } from '@modules/organizations'
import { PlayTypes } from '@modules/plays'
import { FileType } from '@modules/study'
const props = defineProps<{
	close: () => void
	classInst: ClassEntity
	lesson: ClassLesson
	curriculum: ExtendedCurriculum
	itemIndex: number
	sectionIndex: number
}>()

const title = computed(() => {
	if (curriculumItem.value?.type === ClassLessonable.schedule) return 'Live Session'
	if (curriculumItem.value?.type === ClassLessonable.quiz) {
		if (curriculumItem.value.quizMode === PlayTypes.practice) return 'Practice'
		if (curriculumItem.value.quizMode === PlayTypes.tests) return 'Test'
		else return curriculumItem.value.quizMode
	}
	if (curriculumItem.value?.type === ClassLessonable.file) {
		if (curriculumItem.value.fileType === FileType.document) return 'Document'
		if (curriculumItem.value.fileType === FileType.image) return 'Image'
		if (curriculumItem.value.fileType === FileType.video) return 'Video'
	}
	return 'Curriculum Item'
})
const itemTitle = computed(() => {
	if (curriculumItem.value?.type === ClassLessonable.file) return curriculumItem.value.file.title
	else if (curriculumItem.value?.type === ClassLessonable.quiz) return curriculumItem.value.quiz.title
	else return curriculumItem.value?.schedule.title
})

const curriculumSection = computed(() => props.curriculum.at(props.sectionIndex))
const activeItemIndex = ref(props.itemIndex)

const curriculumItem = computed(() => curriculumSection.value?.items.at(activeItemIndex.value))

const canNext = computed(() => activeItemIndex.value < props.curriculum[props.sectionIndex].items.length - 1)
const canPrev = computed(() => activeItemIndex.value > 0)
const next = () => {
	if (canNext.value) activeItemIndex.value++
}
const prev = () => {
	if (canPrev.value) activeItemIndex.value--
}
</script>
