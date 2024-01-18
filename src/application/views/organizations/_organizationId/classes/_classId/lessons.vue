<template>
	<ClassLayout>
		<template #default="{ classObj }">
			<template v-if="classObj.isAdmin(userId)">
				<div
					v-if="lessons.length === 0"
					class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
					<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
						<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
							<img :src="emptyLessonContent.imageURL" class="w-[144px] h-[144px]" />
						</div>
						<div class="flex flex-col items-start gap-1">
							<SofaHeaderText :content="emptyLessonContent.title" size="xl" />
							<div class="flex flex-col gap-2 py-2">
								<div
									v-for="(content, index) in emptyLessonContent.contents"
									:key="index"
									class="flex mdlg:items-center gap-1">
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
					<LessonCard v-for="(lesson, index) in lessons" :key="index" :lesson="lesson" @click="openLessonDetails(lesson)" />
				</div>
			</template>
			<template v-if="classObj.isTeacher(userId)">
				<div v-if="lessons.length === 0">
					<SofaHeaderText content="Lessons" />
					<div class="h-[1px] w-full bg-lightGray" />
					<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
						<img :src="emptyLessonContent.imageURL" class="w-[84px] h-[84px]" />
						<SofaNormalText customClass="font-bold" content="There’s nothing here" />
						<SofaNormalText color="text-grayColor text-center" content="No lessons" />
					</div>
				</div>
				<div v-else></div>
			</template>
			<template v-if="classObj.isStudent(userId)">
				<div v-if="lessons.length === 0">
					<SofaHeaderText content="Lessons" />
					<div class="h-[1px] w-full bg-lightGray" />
					<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
						<img :src="emptyLessonContent.imageURL" class="w-[84px] h-[84px]" />
						<SofaNormalText customClass="font-bold" content="There’s nothing here" />
						<SofaNormalText color="text-grayColor text-center" content="No lessons" />
					</div>
				</div>
				<div v-else class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
					<SofaHeaderText content="Choose a lesson to study" customClass="text-center" />
					<div class="h-[1px] w-full bg-lightGray" />
					<LessonCard v-for="(lesson, index) in lessons" :key="index" :lesson="lesson" />
				</div>
			</template>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useModals } from '@app/composables/core/modals'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdLessons',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const { id: userId } = useAuth()
		const lessons = ref([
			{
				title: 'Mathematics',
				students: [],
				teachers: [1],
			},
			{
				title: 'English',
				students: [],
				teachers: [2, 3],
			},
			{
				title: 'Literature',
				students: [],
				teachers: [],
			},
			{
				title: 'Biology',
				students: [],
				teachers: [],
			},
			{
				title: 'Chemistry',
				students: [],
				teachers: [],
			},
		])
		const searchQuery = ref('')
		const route = useRoute()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
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
		const openCreateClassModal = () => {
			useModals().organizations.createLesson.open({ organizationId, classId, userId: userId.value })
		}
		const openLessonDetails = (val: any) => {
			useModals().organizations.lessonDetails.open({ organizationId, classId, userId: userId.value, lesson: val })
		}
		return {
			userId,
			lessons,
			emptyLessonContent,
			openCreateClassModal,
			searchQuery,
			openLessonDetails,
		}
	},
})
</script>
