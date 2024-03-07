<template>
	<div
		v-if="classInst.lessons.length === 0"
		class="w-full shadow-custom bg-white text-bodyBlack rounded-b-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div class="w-full flex items-center justify-center gap-6 px-4 md:px-6 py-10">
			<SofaEmptyStateNew
				:title="emptyLessonContent.title"
				:contents="emptyLessonContent.contents"
				:imageUrl="emptyLessonContent.imageURL"
				:firstButton="subjectsEmptyStateButtonConfig.firstButton" />
		</div>
	</div>
	<div v-else class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<SofaHeaderText content="Lessons" />
		<div class="h-[1px] w-full bg-lightGray" />
		<div class="flex items-center justify-between">
			<div
				class="bg-white w-[60%] mdlg:w-[50%] px-4 py-3 rounded-[24px] flex flex-row items-center gap-2 border border-darkLightGray">
				<SofaIcon customClass="h-[15px]" name="search"></SofaIcon>
				<SofaTextField
					v-model="searchQuery"
					customClass="bg-transparent text-bodyBlack w-full focus:outline-none rounded-full"
					placeholder="Search"
					padding="px-1" />
			</div>
			<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-3 px-4" @click="openCreateSubjectModal">
				Create a lesson
			</SofaButton>
		</div>
		<LessonCard
			v-for="lesson in filteredLessons"
			:key="lesson.id"
			:classInst="classInst"
			:lesson="lesson"
			@click="openLessonDetails(lesson)" />
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { ClassEntity, ClassLesson } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
}>()
const searchQuery = ref('')
const emptyLessonContent = {
	imageURL: '/images/empty-subjects.png',
	title: 'Getting started with lessons',
	contents: [
		'Comprehensive subject based curriculum.',
		'Assign teachers to manage their specific subjects.',
		'Contains live teaching sessions and study materials.',
		'Students choose how may lessons to take in a class.',
	],
}

const filteredLessons = computed(() => {
	if (searchQuery.value)
		return props.classInst.lessons.filter((lesson) => lesson.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
	else return props.classInst.lessons
})

const openLessonDetails = (lesson: ClassLesson) => {
	useModals().organizations.lessonDetails.open({
		classInst: props.classInst,
		lesson,
	})
}
const openCreateSubjectModal = () => {
	useModals().organizations.createLesson.open({ classInst: props.classInst })
}

const subjectsEmptyStateButtonConfig = computed(() => ({
	firstButton: {
		label: 'Add subject',
		action: () => {
			openCreateSubjectModal()
		},
	},
}))
</script>
