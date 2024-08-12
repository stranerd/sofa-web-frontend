<template>
	<ExpandedLayout v-if="course" width="mdlg:w-[90%] lg:w-[77%]" layoutStyle="mdlg:p-5" :hide="{ bottom: true }">
		<StudyCourse
			:title="course.title"
			:description="course.description"
			:hasAccess="hasAccess(course)"
			:rate="showRateCourse"
			:sections="sections"
			:embeddedProps="{ course }"
			class="w-full h-full overflow-y-auto">
			<template #noAccess>
				<SofaEmptyState
					title="You have no access"
					subTitle="Get this course to start learning with it"
					class="h-[380px]"
					:actionLabel="`${course.price.amount ? 'Buy' : 'Get'} ${course.price.amount ? $utils.formatPrice(course.price.amount, course.price.currency) : 'for free'}`"
					:action="buyCourse"
					:icon="{ name: 'lock', size: 'h-[28px] fill-white' }"
					titleStyle="mdlg:!text-xl" />
			</template>
		</StudyCourse>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import StudyCourse from '@app/components/study/courses/StudyCourse.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useCreateView } from '@app/composables/interactions/views'
import { useCreatePurchase } from '@app/composables/payment/purchases'
import { useHasAccess } from '@app/composables/study'
import { useCourse, useCourseSections } from '@app/composables/study/courses'
import { InteractionEntities } from '@modules/interactions'
import { Purchasables } from '@modules/payment'
import { ExtendedCourseSectionItem } from '@modules/study'

export default defineComponent({
	name: 'StudyCoursesIdIndexPage',
	components: { StudyCourse },
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useHead({ title: 'Course Details' })

		const route = useRoute()
		const { id } = useAuth()
		const { course } = useCourse(route.params.id as string)
		const selectedItem = ref<ExtendedCourseSectionItem | null>(null)
		const { hasAccess } = useHasAccess()
		const { createView } = useCreateView()
		const { createPurchase } = useCreatePurchase(route.params.id as string, Purchasables.courses)
		const { sections } = useCourseSections(computed(() => course.value?.sections ?? []))

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
			sections,
			selectedItem,
			hasAccess,
			buyCourse,
			showRateCourse,
		}
	},
})
</script>
