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
					],
					badges: [{ text: course.status, color: course.isPublished ? 'green' : 'gray' }],
				}">
				<template #left-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<EditCourseSections v-model="selectedItem" :course="course" />
					</div>
				</template>

				<template #middle-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<div>Mid</div>
						<p>{{ selectedItem }}</p>
					</div>
				</template>

				<template #right-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<div>Right</div>
					</div>
				</template>
			</FullLayout>
		</template>
	</EditCourseWrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import EditCourseSections from '@app/components/study/courses/EditCourseSections.vue'
import EditCourseWrapper from '@app/components/study/courses/EditCourseWrapper.vue'
import { useModals } from '@app/composables/core/modals'
import { CourseEntity, ExtendedCourseSectionItem } from '@modules/study'

export default defineComponent({
	name: 'StudyCoursesIdEdit',
	components: { EditCourseWrapper, EditCourseSections },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Edit Course',
		})

		const selectedItem = ref<ExtendedCourseSectionItem>()

		const openEditModal = (course: CourseEntity) => useModals().study.editCourse.open({ course })

		return {
			selectedItem,
			openEditModal,
		}
	},
})
</script>
