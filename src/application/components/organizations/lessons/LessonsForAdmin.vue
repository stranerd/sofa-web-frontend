<template>
	<div
		v-if="classInst.lessons.length === 0"
		class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
			<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
				<img :src="emptyLessonContent.imageURL" class="w-[144px] h-[144px]" />
			</div>
			<div class="flex flex-col items-start gap-1">
				<SofaHeaderText :content="emptyLessonContent.title" size="xl" />
				<div class="flex flex-col gap-2 py-2">
					<div v-for="content in emptyLessonContent.contents" :key="content" class="flex mdlg:items-center gap-1">
						<SofaIcon customClass="h-[16px]" name="checkmark-circle" />
						<SofaNormalText :content="content" color="text-grayColor" />
					</div>
				</div>
				<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6" @click="openCreateClassModal">
					Create a Lesson
				</SofaButton>
			</div>
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
			<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-3 px-4" @click="openCreateClassModal">
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
	imageURL: '/images/empty-lessons.png',
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
const openCreateClassModal = () => {
	useModals().organizations.createLesson.open({ classInst: props.classInst })
}
</script>
