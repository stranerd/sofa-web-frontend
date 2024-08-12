<template>
	<EditCourseWrapper :id="$route.params.id as string" v-model:course="courseModel">
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
							handler: () => openEditModal({ course }),
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
						<CourseSections v-model:selectedItem="selectedItem" :factory="factory" :sections="sections" />
					</div>
				</template>

				<template #middle-session>
					<div class="w-full shadow-custom bg-white rounded-2xl p-4 gap-4 flex flex-col h-full overflow-y-auto">
						<div class="w-full flex mdlg:hidden justify-between items-center">
							<SofaIcon class="h-[19px]" name="circle-close" @click="$utils.goBack()" />
							<SofaNormalText class="!font-bold !text-sm" content="Content" />
							<SofaIcon class="h-[18px]" name="cog" @click="openEditModal({ course })" />
						</div>

						<EditCourseSectionItemBody v-if="$screen.desktop" :course="course" :item="selectedItem" />
						<CourseSections v-else v-model:selectedItem="selectedItem" :factory="factory" :sections="sections" />
					</div>
				</template>

				<template #right-session>
					<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 h-full overflow-y-auto">
						<EditCourseSectionItem :course="course" :item="selectedItem" />
					</div>
				</template>
			</FullLayout>

			<SofaModal v-if="showBody && !$screen.desktop" :close="() => (showBody = false)">
				<div class="flex flex-col gap-4 p-4 justify-between">
					<div class="mdlg:hidden flex gap-2 items-center border-b border-lightGray">
						<SofaNormalText class="!text-sm !font-bold" content="Details" />
						<SofaIcon class="h-[6px] ml-auto" name="more-options-horizontal" @click="showMoreOptions = true" />
						<SofaIcon class="h-[19px]" name="circle-close" @click="showBody = false" />
					</div>

					<EditCourseSectionItemBody :course="course" :item="selectedItem" />
				</div>
			</SofaModal>

			<SofaModal v-if="showMoreOptions" :close="() => (showMoreOptions = false)">
				<div class="flex flex-col gap-4 p-4 justify-between">
					<div class="mdlg:hidden flex gap-2 justify-between items-center border-b border-lightGray">
						<SofaNormalText class="!text-sm !font-bold" content="Summary" />
						<SofaIcon class="h-[19px]" name="circle-close" @click="showMoreOptions = false" />
					</div>

					<EditCourseSectionItem :course="course" :item="selectedItem" />
				</div>
			</SofaModal>
		</template>
	</EditCourseWrapper>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent, ref, watch } from 'vue'
import CourseSections from '@app/components/study/courses/CourseSections.vue'
import EditCourseSectionItem from '@app/components/study/courses/EditCourseSectionItem.vue'
import EditCourseSectionItemBody from '@app/components/study/courses/EditCourseSectionItemBody.vue'
import EditCourseWrapper from '@app/components/study/courses/EditCourseWrapper.vue'
import { useModals } from '@app/composables/core/modals'
import { useUpdateSections } from '@app/composables/study/courses'
import { CourseEntity, ExtendedCourseSectionItem } from '@modules/study'

export default defineComponent({
	name: 'StudyCoursesIdEditPage',
	components: { EditCourseWrapper, CourseSections, EditCourseSectionItem, EditCourseSectionItemBody },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
			title: 'Edit Course',
		})

		const showBody = ref(false)
		const showMoreOptions = ref(false)
		const courseModel = ref<CourseEntity | null>(null)
		const selectedItem = ref<ExtendedCourseSectionItem | null>(null)

		const openEditModal = useModals().study.editCourse.open

		const { factory, sections, updateSections } = useUpdateSections(courseModel)

		watch(selectedItem, () => {
			showBody.value = true
		})

		watch(
			() => factory.factories,
			async () => {
				if (factory.valid && factory.hasChanges) $utils.debounce('updateSections', updateSections, 500)
			},
			{ deep: true, immediate: true },
		)

		return {
			courseModel,
			factory,
			sections,
			showBody,
			showMoreOptions,
			selectedItem,
			openEditModal,
		}
	},
})
</script>
