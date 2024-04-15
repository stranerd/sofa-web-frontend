<template>
	<EditCourseWrapper :id="$route.params.id as string">
		<template #default="{ course, extras }">
			<FullLayout
				v-if="course"
				:hide="{ bottom: true, top: true }"
				bgColor="mdlg:bg-lightGray bg-white"
				:topbarOptions="{
					type: 'sub',
					title: course.title,
					actions: [
						{
							label: 'Settings',
							icon: 'cog',
							handler: () => openEditModal(course),
							size: 'h-[20px]',
							hide: !extras.isMine,
							bordered: true,
						},
						{
							label: 'Exit',
							outlined: true,
							handler: () => $router.push('/library/courses'),
						},
						{
							label: 'Save',
							disabled: !extras.sectionsFactory.valid || !extras.sectionsFactory.hasChanges,
							outlined: false,
							handler: () => extras.updateSections(),
						},
					],
					badges: [{ text: course.status, color: course.isPublished ? 'green' : 'gray' }],
				}">
				<template #left-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<EditCourseSections
							:course="course"
							:item="selectedItem"
							:factory="extras.sectionsFactory"
							:sections="extras.sections"
							@selectItem="(item) => (selectedItem = item)" />
					</div>
				</template>

				<template #middle-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<EditCourseSectionItemBody :course="course" :item="selectedItem" />
					</div>
				</template>

				<template #right-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<EditCourseSectionItem :course="course" :item="selectedItem" />
					</div>
				</template>
			</FullLayout>
		</template>
	</EditCourseWrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import EditCourseSectionItem from '@app/components/study/courses/EditCourseSectionItem.vue'
import EditCourseSectionItemBody from '@app/components/study/courses/EditCourseSectionItemBody.vue'
import EditCourseSections from '@app/components/study/courses/EditCourseSections.vue'
import EditCourseWrapper from '@app/components/study/courses/EditCourseWrapper.vue'
import { useModals } from '@app/composables/core/modals'
import { useDeleteFile } from '@app/composables/study/files'
import { useDeleteQuiz } from '@app/composables/study/quizzes'
import { Coursable, CourseEntity, ExtendedCourseSectionItem } from '@modules/study'

export default defineComponent({
	name: 'StudyCoursesIdEdit',
	components: { EditCourseWrapper, EditCourseSections, EditCourseSectionItem, EditCourseSectionItemBody },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Edit Course',
		})

		const selectedItem = ref<ExtendedCourseSectionItem>()

		const openEditModal = (course: CourseEntity) => useModals().study.editCourse.open({ course })

		const { deleteFile } = useDeleteFile()
		const { deleteQuiz } = useDeleteQuiz()

		const deleteItem = async (item: ExtendedCourseSectionItem) => {
			// TODO: move item out of course
			if ('file' in item) await deleteFile(item.file)
			if ('quiz' in item) await deleteQuiz(item.quiz)
		}

		return {
			Coursable,
			selectedItem,
			openEditModal,
			deleteItem,
		}
	},
})
</script>
