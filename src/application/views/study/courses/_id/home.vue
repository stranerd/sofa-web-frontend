<template>
	<ExpandedLayout v-if="course" width="mdlg:w-[90%] lg:w-[77%]" layoutStyle="mdlg:py-5" :hide="{ bottom: true }">
		<div class="w-full h-full flex flex-col overflow-y-auto mdlg:grid grid-cols-12 gap-4">
			<div
				v-if="$screen.desktop || !selectedItem"
				class="col-span-3 w-full p-4 gap-4 flex flex-col mdlg:shadow-custom bg-white mdlg:rounded-2xl overflow-y-auto"
				:class="$screen.desktop ? 'h-fit max-h-full' : 'h-full'">
				<SofaIcon class="h-[15px] mdlg:hidden self-start" name="back-arrow" @click="$utils.goBack()" />
				<div class="w-full flex items-center justify-between">
					<SofaHeaderText class="!font-bold !line-clamp-1" :content="course.title" />

					<SofaButton v-if="course.user.id !== id && $screen.desktop" padding="px-4 py-1" @click="showRateCourse">
						Rate
					</SofaButton>
				</div>
				<SofaNormalText :content="course.description" />
				<CourseSections :course="course" :item="selectedItem" @selectItem="selectItem" />
			</div>
			<div
				v-if="$screen.desktop || selectedItem"
				class="col-span-9 w-full px-4 pt-4 pb-2 gap-2 flex flex-col mdlg:shadow-custom bg-white mdlg:rounded-2xl overflow-y-auto"
				:class="$screen.desktop ? 'h-fit max-h-full' : 'h-full'">
				<SofaIcon class="h-[15px] mdlg:hidden self-start mb-2" name="back-arrow" @click="selectedItem = undefined" />
				<div class="grow overflow-y-auto">
					<template v-if="hasAccess(course)">
						<p>Selected item</p>
						<p>{{ selectedItem }}</p>
					</template>
					<SofaEmptyState
						v-else
						title="You have no access"
						subTitle="Get this course to start learning with it"
						class="h-[380px]"
						:actionLabel="`${course.price.amount ? 'Buy' : 'Get'} ${course.price.amount ? $utils.formatPrice(course.price.amount, course.price.currency) : 'for free'}`"
						:action="buyCourse"
						:icon="{ name: 'lock-white', size: 'h-[28px]' }"
						titleStyle="mdlg:!text-xl" />
				</div>
				<CourseSections
					v-if="!$screen.desktop"
					class="shrink-0"
					:course="course"
					list
					:item="selectedItem"
					@selectItem="selectItem" />
			</div>
		</div>

		<Teleport v-if="course.user.id !== id && !$screen.desktop" to="body">
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
			selectedItem,
			hasAccess,
			selectItem,
			buyCourse,
			showRateCourse,
		}
	},
})
</script>
