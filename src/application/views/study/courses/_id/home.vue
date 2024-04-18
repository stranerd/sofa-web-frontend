<template>
	<ExpandedLayout v-if="course" width="mdlg:w-[90%] lg:w-[77%]" layoutStyle="mdlg:py-5" :hide="{ bottom: true }">
		<div class="w-full h-full flex flex-col items-start overflow-y-auto mdlg:grid grid-cols-12 gap-4">
			<div class="col-span-3 p-4 gap-4 flex flex-col mdlg:shadow-custom bg-white mdlg:rounded-2xl max-h-full overflow-y-auto">
				<SofaIcon class="h-[15px] mdlg:hidden self-start" name="back-arrow" @click="$utils.goBack()" />
				<div class="w-full flex items-center justify-between">
					<SofaHeaderText class="!font-bold !line-clamp-1" :content="course.title" />

					<SofaButton v-if="id !== course.user.id && $screen.desktop" padding="px-4 py-1" @click="showRateCourse">
						Rate
					</SofaButton>
				</div>
				<SofaNormalText :content="course.description" />
				<CourseSections :course="course" :item="selectedItem" @selectItem="selectItem" />
			</div>
			<div v-if="$screen.desktop" class="col-span-9 p-4 shadow-custom bg-white rounded-2xl max-h-full overflow-y-auto">
				selected item
				<CourseSections :course="course" list :item="selectedItem" @selectItem="selectItem" />
			</div>
		</div>

		<Teleport v-if="id !== course.user.id && !$screen.desktop" to="body">
			<a
				class="size-[60px] absolute bottom-[3%] right-[2%] z-[100] flex flex-col justify-center items-center rounded-full shadow-custom bg-primaryBlue"
				@click="showRateCourse">
				<SofaIcon name="star" class="h-[15px] fill-white" />
				<SofaNormalText color="text-white" content="Rate" />
			</a>
		</Teleport>
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import CourseSections from '@app/components/study/courses/CourseSections.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useCreateView } from '@app/composables/interactions/views'
import { useCreatePurchase } from '@app/composables/payment/purchases'
import { useHasAccess } from '@app/composables/study'
import { useCourse } from '@app/composables/study/courses'
import { InteractionEntities } from '@modules/interactions'
import { Purchasables } from '@modules/payment'
import { ExtendedCourseSectionItem } from '@modules/study'

export default defineComponent({
	name: 'StudyCoursesIdIndexPage',
	components: { CourseSections },
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({ title: 'Course Details' })

		const route = useRoute()
		const { id } = useAuth()
		const { course } = useCourse(route.params.id as string)
		const selectedSection = ref<{ sectionIndex: number; itemIndex: number }>()
		const selectedItem = ref<ExtendedCourseSectionItem>()
		const { hasAccess } = useHasAccess()
		const { createView } = useCreateView()
		const { createPurchase } = useCreatePurchase(route.params.id as string, Purchasables.courses)

		const selectItem = async (item: ExtendedCourseSectionItem) => {
			selectedItem.value = item
		}

		const showRateCourse = () => {
			if (!course.value) return
			useModals().interactions.createReview.open({
				id: course.value.id,
				type: InteractionEntities.courses,
			})
		}

		const buyCourse = async () => {
			if (!course.value) return
			useModals().payment.selectPaymentMethod.open({
				price: course.value.price,
				autoSelect: true,
				onSelect: createPurchase,
			})
		}

		watch(course, () => {
			if (course.value?.isPublished) createView({ id: course.value.id, type: InteractionEntities.courses })
		})

		return {
			id,
			course,
			selectedSection,
			selectedItem,
			hasAccess,
			selectItem,
			buyCourse,
			showRateCourse,
		}
	},
})
</script>
