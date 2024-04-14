<template>
	<EditCourseWrapper :id="$route.params.id as string">
		<template #default="{ course, extras }">
			<FullLayout
				v-if="course"
				:hide="{ bottom: true, top: true }"
				bgColor="mdlg:bg-lightGray bg-white"
				:topbarOptions="{
					type: 'subpage',
					title: course.title,
					actions: [
						{
							isIcon: true,
							data: [
								{
									name: 'Settings',
									icon: 'cog',
									handler: () => openEditModal(course),
									size: 'h-[20px]',
									hide: !extras.isMine,
								},
							],
						},
						{
							IsOutlined: true,
							name: 'Exit',
							handler: () => $router.push('/library/courses'),
						},
					],
					badges: [{ text: course.status, color: course.isPublished ? 'green' : 'gray' }],
				}">
				<template #left-session>
					<EditCourseSections :course="course" />
				</template>

				<template #middle-session>
					<div>Mid</div>
				</template>

				<template #right-session>
					<div>Right</div>
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
import { Logic } from 'sofa-logic'

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
			Logic,
		}
	},
})
</script>
