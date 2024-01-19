<template>
	<div
		v-if="classObj.lessons.length === 0"
		class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
			<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
				<img :src="emptyLessonContent.imageURL" class="w-[144px] h-[144px]" />
			</div>
			<div class="flex flex-col items-start gap-1">
				<SofaHeaderText :content="emptyLessonContent.title" size="xl" />
				<div class="flex flex-col gap-2 py-2">
					<div v-for="(content, index) in emptyLessonContent.contents" :key="index" class="flex mdlg:items-center gap-1">
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
		<LessonCard v-for="(lesson, index) in filteredLessons" :key="index" :lesson="lesson" @click="openLessonDetails(lesson)" />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useRoute } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { ClassEntity } from '@modules/organizations'
import { MemberEntity } from '@modules/organizations'
import { SelectOption } from 'sofa-logic'
export default defineComponent({
	props: {
		classObj: {
			type: ClassEntity,
			required: true,
		},
		teachers: {
			type: Array as PropType<MemberEntity[]>,
			required: true,
		},
	},
	setup(props) {
		const { id: userId } = useAuth()
		const route = useRoute()

		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
		const searchQuery = ref('')
		const emptyLessonContent = {
			imageURL: '/images/no-lessons.png',
			title: 'Getting started with lessons',
			contents: [
				'Comprehensive subject based curriculum.',
				'Assign teachers to manage their specific subjects. ',
				'Assign teachers to manage their specific subjects. ',
				'Contains live teaching sessions and study materials.',
			],
		}

		const teachersOptions = computed((): SelectOption[] => {
			return props.teachers.map((teacher: MemberEntity) => {
				return { key: teacher?.user?.id || '', value: teacher.user?.bio.name.full || '' }
			})
		})

		const filteredLessons = computed(() => {
			if (searchQuery.value) return props.classObj.lessons.filter((lesson) => lesson.title.includes(searchQuery.value))
			else return props.classObj.lessons
		})

		const openLessonDetails = (val: any) => {
			useModals().organizations.lessonDetails.open({
				organizationId,
				classId,
				userId: userId.value,
				lesson: val,
				teachers: props.teachers,
			})
		}
		const openCreateClassModal = () => {
			useModals().organizations.createLesson.open({ organizationId, classId, userId: userId.value, teachers: teachersOptions.value })
		}

		return { openLessonDetails, searchQuery, openCreateClassModal, teachersOptions, emptyLessonContent, filteredLessons }
	},
})
</script>
