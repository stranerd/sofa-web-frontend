<template>
	<div class="flex flex-col">
		<div class="w-full flex flex-col gap-3 p-3 mdlg:p-4">
			<div class="w-full flex mdlg:flex mdlg:flex-row flex-col relative h-auto items-start justify-start gap-4">
				<SofaImageLoader class="w-full mdlg:w-[25%] shrink-0 rounded-custom" :photoUrl="material.picture">
					<div v-if="price && price.amount > 0" class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
						<SofaBadge color="body" class="bg-opacity-50 !px-4 !py-2 rounded-custom">
							{{ $utils.formatPrice(price.amount, price.currency) }}
						</SofaBadge>
					</div>
				</SofaImageLoader>
				<div class="flex flex-col gap-2 grow">
					<div class="w-full flex items-center justify-between">
						<SofaHeading size="title" :content="material.title" />

						<div class="mdlg:flex items-center justify-end gap-4 hidden">
							<SofaIcon name="flag" class="h-[16px]" @click="reportMaterial(material)" />
							<SofaIcon name="share" class="h-[16px]" @click="shareMaterialLink(material)" />
							<SofaIcon name="save" class="h-[16px]" @click="saveToFolder(material)" />
						</div>
					</div>
					<SofaText :content="material.description" />
					<div class="flex gap-2 items-center" :class="[color]">
						<SofaText :content="label" />
						<span class="size-[5px] rounded-full bg-current" />
						<SofaText :content="sub" />
					</div>

					<div class="flex gap-2 items-center">
						<SofaRatings v-model="material.ratings.avg" size="h-[15px]" />
						<SofaText class="text-grayColor">
							({{ material.ratings.count }} {{ $utils.pluralize(material.ratings.count, 'rating', 'ratings') }})
						</SofaText>
					</div>

					<div class="w-full flex items-center gap-2 justify-between">
						<div class="flex items-center gap-2">
							<SofaAvatar :size="20" :photoUrl="material.user.bio.photo?.link" :userId="material.user.id" />
							<SofaText clamp class="!whitespace-nowrap">
								{{ material.user.id === id ? 'You' : material.user.bio.publicName }}
							</SofaText>

							<span class="size-[5px] rounded-full bg-bodyBlack" />

							<SofaText :content="$utils.formatTime(material.updatedAt)" />
						</div>

						<div class="mdlg:flex hidden flex-col">
							<SofaButton v-if="material.isQuiz()" padding="px-6 py-1" @click="openQuiz">
								{{ hasAccess ? 'Start' : 'Go to course' }}
							</SofaButton>
							<SofaButton v-else padding="px-6 py-1" @click="openCourse">
								{{
									hasAccess
										? 'Go to course'
										: price && price.amount > 0
											? `Buy ${$utils.formatPrice(price.amount, price.currency)}`
											: 'Get course for free'
								}}
							</SofaButton>
						</div>
					</div>
				</div>
			</div>

			<div class="w-full flex gap-3 items-center flex-nowrap overflow-x-auto scrollbar-hide">
				<SofaText
					v-for="tag in tags"
					:key="tag.hash"
					class="!whitespace-nowrap text-grayColor px-4 py-1 border rounded-custom border-grayColor"
					:content="tag.title" />
			</div>
		</div>

		<div class="w-full flex gap-4 items-center border-b border-lightGray px-4 pt-2">
			<SofaText
				v-for="(tab, index) in tabs.filter((tab) => !tab.hide)"
				:key="index"
				bold
				:class="[selectedTab == tab.key ? 'text-bodyBlack border-current' : 'text-grayColor border-transparent']"
				body
				class="pb-2 border-b-2"
				as="a"
				:content="tab.name"
				@click="selectedTab = tab.key" />
		</div>

		<div class="w-full flex flex-col gap-2 p-4 grow overflow-y-auto">
			<template v-if="selectedTab == 'content' && material.isCourse()">
				<div class="flex items-center gap-3">
					<SofaText>
						{{ material.sections.length }} {{ $utils.pluralize(material.sections.length, 'section', 'sections') }}
					</SofaText>
					<span class="size-[5px] rounded-full bg-bodyBlack" />
					<SofaText> {{ material.totalItems }} {{ $utils.pluralize(material.totalItems, 'material', 'materials') }} </SofaText>
				</div>

				<div v-for="(section, index) in sections" :key="index" class="w-full flex flex-col gap-3">
					<a class="bg-lightGray rounded-custom p-4 gap-4 flex items-center" @click="toggleSection(index)">
						<SofaHeading clamp :content="section.label" />
						<span class="grow" />
						<SofaText>
							{{ section.items.length }} {{ $utils.pluralize(section.items.length, 'material', 'materials') }}
						</SofaText>
						<SofaIcon class="h-[8px]" name="chevron-down" :class="{ 'rotate-180': expandedSections.has(index) }" />
					</a>

					<template v-if="expandedSections.has(index)">
						<div
							v-for="item in section.items"
							:key="item.id"
							class="w-full bg-lightGray rounded-custom p-4 flex items-center justify-between">
							<div class="flex items-center gap-3" :class="{ 'opacity-50': !hasAccess }">
								<SofaIcon class="h-[42px] fill-deepGray" :name="item.icon" />
								<div class="flex flex-col gap-1">
									<SofaHeading clamp :content="item.title" />
									<SofaText clamp class="capitalize" :content="item.info" />
								</div>
							</div>

							<SofaIcon v-if="!hasAccess" class="h-[40px]" name="locked-content" />
						</div>
					</template>
				</div>

				<SofaButton padding="py-3 px-4" class="sticky bottom-0 mdlg:hidden mt-auto" @click="openCourse()">
					{{
						hasAccess
							? 'Go to course'
							: price && price.amount > 0
								? `Buy ${$utils.formatPrice(price.amount, price.currency)}`
								: 'Get course for free'
					}}
				</SofaButton>
			</template>

			<template v-if="selectedTab == 'content' && material.isQuiz()">
				<QuizWrapper v-if="hasAccess" :quiz="material">
					<template #default="{ questions }">
						<div class="flex flex-col gap-3">
							<div
								v-for="question in questions"
								:key="question.hash"
								class="w-full bg-lightGray p-4 flex flex-col gap-2 rounded-custom">
								<div class="flex items-center gap-2">
									<SofaText class="text-grayColor" :content="question.label" />
									<span class="size-[5px] rounded-full bg-grayColor" />
									<SofaText class="text-grayColor" :content="$utils.getDigitalTime(question.timeLimit)" />
								</div>
								<SofaHeading :content="question.content" />
							</div>
							<SofaButton padding="py-3 px-4" class="sticky bottom-0 mdlg:hidden mt-auto" @click="openQuiz()">
								{{ hasAccess ? 'Start' : 'Go to course' }}
							</SofaButton>
						</div>
					</template>
				</QuizWrapper>

				<SofaEmptyState
					v-if="!hasAccess"
					title="You have no access"
					subTitle="Get the course it is in to use"
					actionLabel="Go to course"
					:action="openQuiz"
					:icon="{ name: 'lock', size: 'h-[28px] fill-white' }" />
			</template>

			<template v-if="selectedTab === 'ratings'">
				<div class="bg-lightGray rounded-custom p-4 flex gap-3 items-center">
					<div class="p-4 min-w-[150px] shrink-0 flex flex-col gap-2 items-center justify-center border-r-2 border-darkLightGray">
						<div class="flex items-center">
							<SofaText size="title" :content="`${material.ratings.avg}`" />
							<SofaText size="title" class="text-grayColor"> /5 </SofaText>
						</div>
						<SofaRatings v-model="material.ratings.avg" size="h-[15px] mdlg:h-[17px]" />
						<SofaText
							class="text-grayColor"
							:content="`${material.ratings.total} ${$utils.pluralize(material.ratings.total, 'rating', 'ratings')}`" />
					</div>

					<div class="grow flex flex-col gap-2">
						<div
							v-for="(rating, key) in stats"
							:key="key"
							class="w-full flex items-center justify-between gap-3"
							:class="rating.count === 0 ? 'text-grayColor' : 'text-bodyBlack'">
							<SofaText size="sub"> {{ key }} {{ $utils.pluralize(Number(key), 'star', 'stars') }} </SofaText>
							<div class="grow h-2 rounded-full bg-darkLightGray">
								<div class="h-full bg-primaryYellow rounded-full" :style="`width: ${rating.percentage * 100}%;`" />
							</div>

							<SofaText size="sub"> ({{ rating.count }}) </SofaText>
						</div>
					</div>
				</div>

				<div v-for="review in reviews" :key="review.hash" class="bg-lightGray rounded-custom mdlg:p-4 p-3 flex gap-3 items-start">
					<SofaAvatar :photoUrl="review.user.bio.photo?.link" :size="44" :userId="review.user.id" />

					<div class="flex flex-col gap-1">
						<SofaHeading :content="review.user.bio.publicName" />
						<SofaRatings v-model="review.rating" size="h-[14px] mdlg:h-[16px]" />
						<SofaText :content="review.message" />
					</div>
				</div>
			</template>

			<template v-if="selectedTab === 'similar'">
				<div class="flex items-start mdlg:flex-col mdlg:gap-4 gap-3 flex-nowrap overflow-x-auto scrollbar-hide">
					<StudyMaterialCard
						v-for="m in similarMaterials"
						:key="m.hash"
						class="!bg-lightGray"
						:material="m"
						:wrapped="!$screen.desktop" />
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useReviews } from '@app/composables/interactions/reviews'
import { useTagsInList } from '@app/composables/interactions/tags'
import { useCreatePurchase } from '@app/composables/payment/purchases'
import { useHasAccess, useSimilar } from '@app/composables/study'
import { useCourseSections } from '@app/composables/study/courses'
import { saveToFolder } from '@app/composables/study/folders'
import { openMaterial, reportMaterial, shareMaterialLink } from '@app/composables/study/library'
import { InteractionEntities } from '@modules/interactions'
import { Purchasables } from '@modules/payment'
import { StudyMaterial } from '@modules/study'

const props = defineProps<{
	material: StudyMaterial
}>()

const { id } = useAuth()
const router = useRouter()
const expandedSections = ref(new Set<number>([0]))
const courseSections = computed(() => (props.material.isCourse() ? props.material.sections : []))
const { sections } = useCourseSections(courseSections)
const tagIds = computed(() => props.material.tagIds)
const { tags } = useTagsInList(tagIds)
const { hasAccess: userHasAccess } = useHasAccess()
const { createPurchase } = useCreatePurchase(props.material.id, Purchasables.courses)
const { materials: similarMaterials } = useSimilar(props.material)
const { reviews, stats } = useReviews({
	id: props.material.id,
	type: props.material.isCourse() ? InteractionEntities.courses : InteractionEntities.quizzes,
})

const hasAccess = computed(() => userHasAccess.value(props.material))
const price = computed(() => (props.material.isCourse() ? props.material.price : null))
const color = computed(() => (props.material.isQuiz() ? 'text-primaryPurplePink' : 'text-primaryPurple'))
const label = computed(() => (props.material.isQuiz() ? 'Quiz - Learn' : 'Course'))
const sub = computed(() =>
	props.material.isQuiz()
		? `${props.material.questions.length} ${$utils.pluralize(props.material.questions.length, 'question', 'questions')}`
		: `${props.material.sections.length} ${$utils.pluralize(props.material.sections.length, 'topic', 'topics')}`,
)

const openQuiz = () => {
	if (!props.material.isQuiz()) return
	if (hasAccess.value) return openMaterial(props.material, true)
	router.push(props.material.noAccessPage)
}

const openCourse = () => {
	const material = props.material
	if (!material.isCourse()) return
	if (hasAccess.value) return openMaterial(material, true)
	useModals().payment.selectPaymentMethod.open({
		price: material.price,
		autoSelect: true,
		onSelect: (method) => createPurchase(method).then(() => openMaterial(material, true)),
	})
}

const toggleSection = (index: number) => {
	if (expandedSections.value.has(index)) expandedSections.value.delete(index)
	else expandedSections.value.add(index)
}

const tabs = computed(
	() =>
		[
			{
				name: props.material.isQuiz() ? 'Questions' : 'Content',
				key: 'content',
				hide: false,
			},
			{
				name: 'Ratings',
				key: 'ratings',
				hide: false,
			},
			{
				name: props.material.isQuiz() ? 'Similar Quizzes' : 'Similar Courses',
				key: 'similar',
				hide: !similarMaterials.value.length,
			},
		] as const,
)
const selectedTab = ref<(typeof tabs)['value'][number]['key']>('content')
</script>
