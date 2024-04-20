<template>
	<div class="flex flex-col">
		<div class="w-full flex flex-col gap-3 p-3 mdlg:p-4">
			<div class="w-full flex mdlg:flex mdlg:flex-row flex-col relative h-auto items-start justify-start gap-4">
				<SofaImageLoader class="w-full mdlg:w-[25%] shrink-0 rounded-custom" :photoUrl="material.picture">
					<div v-if="price && price.amount > 0" class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
						<SofaBadge class="!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom">
							{{ $utils.formatPrice(price.amount, price.currency) }}
						</SofaBadge>
					</div>
				</SofaImageLoader>
				<div class="flex flex-col gap-2 grow">
					<div class="w-full flex items-center justify-between">
						<SofaHeaderText :content="material.title" />

						<div class="mdlg:flex items-center justify-end gap-4 hidden">
							<SofaIcon name="flag" class="h-[16px]" @click="reportMaterial(material)" />
							<SofaIcon name="share" class="h-[16px]" @click="shareMaterialLink(material)" />
							<SofaIcon name="save" class="h-[16px]" @click="saveToFolder(material)" />
						</div>
					</div>
					<SofaNormalText :content="material.description" />
					<div class="flex gap-2 items-center" :class="[color]">
						<SofaNormalText color="text-current" :content="label" />
						<span class="size-[5px] rounded-full bg-current" />
						<SofaNormalText color="text-current" :content="sub" />
					</div>

					<div class="flex gap-2 items-center">
						<SofaRatings v-model="material.ratings.avg" size="h-[15px]" />
						<SofaNormalText color="text-grayColor">
							({{ material.ratings.count }} {{ $utils.pluralize(material.ratings.count, 'rating', 'ratings') }})
						</SofaNormalText>
					</div>

					<div class="w-full flex items-center gap-2 justify-between">
						<div class="flex items-center gap-2">
							<SofaAvatar :size="20" :photoUrl="material.user.bio.photo?.link" :userId="material.user.id" />
							<SofaNormalText class="!whitespace-nowrap !line-clamp-1">
								{{ material.user.id === id ? 'You' : material.user.bio.publicName }}
							</SofaNormalText>

							<span class="size-[5px] rounded-full bg-bodyBlack" />

							<SofaNormalText :content="$utils.formatTime(material.updatedAt)" />
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
				<SofaNormalText
					v-for="tag in tags"
					:key="tag.hash"
					color="text-grayColor"
					class="!whitespace-nowrap px-4 py-1 border rounded-custom border-grayColor"
					:content="tag.title" />
			</div>
		</div>

		<div class="w-full flex gap-4 items-center border-b border-lightGray px-4 pt-2">
			<SofaNormalText
				v-for="(tab, index) in tabs"
				:key="index"
				:color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'"
				class="!font-semibold pb-2 border-b-2 border-transparent"
				:class="{ '!border-bodyBlack': selectedTab === tab.key }"
				as="a"
				:content="tab.name"
				@click="selectedTab = tab.key" />
		</div>

		<div class="w-full flex flex-col gap-2 p-4 grow overflow-y-auto">
			<template v-if="selectedTab == 'content' && material.isCourse()">
				<div class="flex items-center gap-3">
					<SofaNormalText>
						{{ material.sections.length }} {{ $utils.pluralize(material.sections.length, 'section', 'sections') }}
					</SofaNormalText>
					<span class="size-[5px] rounded-full bg-bodyBlack" />
					<SofaNormalText
					>{{ material.totalItems }} {{ $utils.pluralize(material.totalItems, 'material', 'materials') }}</SofaNormalText
					>
				</div>

				<div v-for="(section, index) in sections" :key="index" class="w-full flex flex-col gap-3">
					<a class="bg-lightGray rounded-custom p-4 gap-4 flex items-center" @click="toggleSection(index)">
						<SofaNormalText class="!font-bold !line-clamp-1" :content="section.label" />
						<span class="grow" />
						<SofaNormalText
						>{{ section.items.length }} {{ $utils.pluralize(section.items.length, 'material', 'materials') }}
						</SofaNormalText>
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
									<SofaNormalText class="!font-bold !line-clamp-1" :content="item.title" />
									<SofaNormalText color="text-grayColor" class="!line-clamp-1 capitalize" :content="item.info" />
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
									<SofaNormalText color="text-grayColor" :content="question.label" />
									<span class="size-[5px] rounded-full bg-grayColor" />
									<SofaNormalText color="text-grayColor" :content="$utils.prettifyTime(question.timeLimit)" />
								</div>
								<SofaNormalText class="!font-bold" :content="question.content" />
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
					:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
			</template>

			<template v-if="selectedTab === 'ratings'">
				<div class="bg-lightGray rounded-custom p-4 flex gap-3 items-center">
					<div class="p-4 min-w-[150px] shrink-0 flex flex-col gap-2 items-center justify-center border-r-2 border-darkLightGray">
						<div class="flex items-center">
							<SofaNormalText class="mdlg:!text-xl !text-lg" :content="`${material.ratings.avg}`" />
							<SofaNormalText class="mdlg:!text-xl !text-lg" color="text-grayColor"> /5 </SofaNormalText>
						</div>
						<SofaRatings v-model="material.ratings.avg" size="h-[15px] mdlg:h-[17px]" />
						<SofaNormalText
							color="text-grayColor"
							:content="`${material.ratings.total} ${$utils.pluralize(material.ratings.total, 'rating', 'ratings')}`" />
					</div>

					<div class="grow flex flex-col gap-2">
						<div
							v-for="(rating, key) in stats"
							:key="key"
							class="w-full flex items-center justify-between gap-3"
							:class="rating.count === 0 ? 'text-grayColor' : 'text-bodyBlack'">
							<SofaNormalText class="!text-xs mdlg:!text-xs" color="text-current">
								{{ key }} {{ $utils.pluralize(Number(key), 'star', 'stars') }}
							</SofaNormalText>
							<div class="grow h-2 rounded-full bg-darkLightGray">
								<div class="h-full bg-primaryYellow rounded-full" :style="`width: ${rating.percentage * 100}%;`" />
							</div>

							<SofaNormalText class="!text-xs" color="text-current"> ({{ rating.count }}) </SofaNormalText>
						</div>
					</div>
				</div>

				<div v-for="review in reviews" :key="review.hash" class="bg-lightGray rounded-custom mdlg:p-4 p-3 flex gap-3 items-start">
					<SofaAvatar :photoUrl="review.user.bio.photo?.link" :size="44" :userId="review.user.id" />

					<div class="flex flex-col gap-1">
						<SofaNormalText class="!font-semibold" :content="review.user.bio.publicName" />
						<SofaRatings v-model="review.rating" size="h-[14px] mdlg:h-[16px]" />
						<SofaNormalText :content="review.message" />
					</div>
				</div>
			</template>

			<template v-if="selectedTab === 'similar'">
				<div v-if="similarMaterials.length" class="flex mdlg:flex-col mdlg:gap-4 gap-3 flex-nowrap overflow-x-auto scrollbar-hide">
					<StudyMaterialCard v-for="m in similarMaterials" :key="m.hash" type="activity" :material="m" />
				</div>
				<SofaEmptyState
					v-else
					title="No similar course found"
					subTitle="Discover thousands of materials to buy, created by verified experts"
					actionLabel="Marketplace"
					:action="() => $router.push('/marketplace')" />
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
const { sections } = useCourseSections(computed(() => (props.material.isCourse() ? props.material.sections : [])))
const { tags } = useTagsInList(computed(() => props.material.tagIds))
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
	if (hasAccess.value) return openMaterial(props.material)
	router.push(props.material.noAccessPage)
}

const openCourse = () => {
	const material = props.material
	if (!material.isCourse()) return
	if (hasAccess.value) return openMaterial(material)
	useModals().payment.selectPaymentMethod.open({
		price: material.price,
		autoSelect: true,
		onSelect: (method) => createPurchase(method).then(() => openMaterial(material)),
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
			},
			{
				name: 'Ratings',
				key: 'ratings',
			},
			{
				name: props.material.isQuiz() ? 'Similar Quizzes' : 'Similar Courses',
				key: 'similar',
			},
		] as const,
)
const selectedTab = ref<(typeof tabs)['value'][number]['key']>('content')
</script>
