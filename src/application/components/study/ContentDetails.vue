<template>
	<div :class="`w-full flex flex-col gap-2 flex-1 relative bg-white mdlg:!rounded-[16px] overflow-y-auto rounded-custom ${customClass}`">
		<div :class="`w-full flex flex-col gap-2 ${padding} relative`">
			<div
				class="w-full flex mdlg:!flex md:!flex-row mdlg:!flex-none flex-col relative mdlg:!items-start h-auto items-start justify-start gap-3 mdlg:space-x-3">
				<div :class="`${hasPadding ? 'mdlg:!w-[25%]' : 'mdlg:!w-[33%]'} w-full h-full mdlg:!absolute top-0 left-0`">
					<SofaImageLoader class="w-full rounded-custom" :photoUrl="content.image">
						<div v-if="content.price > 0" class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full px-2 py-2">
							<SofaBadge customClass="!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom">
								{{ $utils.formatPrice(content.price, content.currency) }}
							</SofaBadge>
						</div>
					</SofaImageLoader>
				</div>
				<div :class="`flex flex-col gap-2 grow   ${hasPadding ? 'mdlg:!w-[75%] mdlg:!pl-[25%]' : 'mdlg:!w-[67%] mdlg:!pl-[33%]'}`">
					<div class="w-full flex flex-row items-center justify-between">
						<SofaHeaderText :content="content.title" />

						<div class="mdlg:!flex flex-row items-center justify-end gap-4 hidden">
							<SofaIcon name="flag" customClass="h-[16px] cursor-pointer " @click="actions.report()" />
							<SofaIcon name="share" customClass="h-[16px] cursor-pointer" @click="actions.share()" />
							<SofaIcon name="save" customClass="h-[16px] cursor-pointer" @click="actions.save()" />
						</div>
					</div>
					<SofaNormalText customClass="text-left">
						{{ content.info }}
					</SofaNormalText>
					<div class="flex flex-row gap-2 items-center">
						<SofaNormalText :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
							{{ content.labels.main }}
						</SofaNormalText>
						<span
							:class="`h-[5px] w-[5px] rounded-full ${
								content.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'
							}`">
						</span>
						<SofaNormalText :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">{{
							content.labels.sub
						}}</SofaNormalText>
					</div>

					<div v-if="!isMinimal" class="w-full flex flex-row gap-2 items-center">
						<div class="flex flex-row gap-1 items-center">
							<SofaRatings v-model="content.ratings.avg" size="h-[14px] mdlg:!h-[15px]" />
							<SofaNormalText>
								{{ content.ratings.avg }}
							</SofaNormalText>
							<SofaNormalText color="text-grayColor pl-2"> ({{ content.ratings.count }} ratings) </SofaNormalText>
						</div>
					</div>

					<div class="w-full flex flex-row items-center gap-2 justify-between">
						<div class="flex flex-row items-center gap-2">
							<div v-if="!isMinimal" class="gap-2 flex flex-row items-center">
								<SofaAvatar :size="20" :photoUrl="content.user.photoUrl" />
								<SofaNormalText>
									{{ content.user.name }}
								</SofaNormalText>
							</div>

							<span v-if="!isMinimal" class="h-[5px] w-[5px] rounded-full bg-bodyBlack"> </span>

							<SofaNormalText>
								{{ content.lastUpdated }}
							</SofaNormalText>
						</div>

						<div v-if="showBuyButton && type == 'course'" class="md:!flex hidden flex-col">
							<SofaButton
								v-if="!hasAccess"
								padding="px-6 py-1"
								:customClass="`${content.status == 'published' ? '' : 'bg-opacity-50'}`"
								@click="buyAction && content.status == 'published' ? buyAction() : null">
								{{
									content.price > 0 ? `Buy ${$utils.formatPrice(content.price, content.currency)}` : 'Get course for free'
								}}
							</SofaButton>
							<SofaButton
								v-else
								padding="px-6 py-1"
								customClass="w-auto"
								@click="$router.push(`/study/courses/${content.id}`)">
								Go to course
							</SofaButton>
						</div>
						<div v-if="type == 'quiz'" class="md:!flex hidden flex-col">
							<SofaButton padding="px-6 py-1" @click="hasAccess ? openQuiz() : $router.push(content.route)">
								{{ hasAccess ? 'Start' : 'Go to course' }}
							</SofaButton>
						</div>
					</div>
				</div>
			</div>

			<div class="w-full flex flex-row gap-3 items-center py-2 flex-nowrap overflow-x-auto scrollbar-hide">
				<div v-for="(tag, index) in content.tags" :key="index" class="px-4 py-1 border rounded-custom border-grayColor">
					<SofaNormalText color="text-grayColor" customClass="!whitespace-nowrap">{{ tag }}</SofaNormalText>
				</div>
			</div>
		</div>

		<div
			:class="`w-full flex flex-row gap-4 items-center border-b border-lightGray mdlg:!relative sticky mdlg:!pr-5 pr-4 top-0 left-0 z-50 bg-white pt-3 mdlg:!pt-0  ${
				hasPadding ? 'px-4' : ''
			}`">
			<SofaNormalText
				v-for="(tab, index) in tabs"
				:key="index"
				:color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'"
				:customClass="`!font-semibold cursor-pointer pb-2  ${
					selectedTab == tab.key && !isMinimal ? 'border-b-2 border-bodyBlack' : ''
				}`"
				@click="selectedTab = tab.key">
				{{ tab.name }}
			</SofaNormalText>
		</div>

		<div v-if="selectedTab == 'content'" :class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} py-2 relative`">
			<div class="w-full flex flex-col gap-3 pb-4">
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-row items-center gap-3">
						<SofaNormalText> {{ content.content.sections.length }} sections </SofaNormalText>
						<span class="h-[5px] w-[5px] rounded-full bg-bodyBlack"> </span>
						<SofaNormalText>{{ content.content.materialsCount }} materials</SofaNormalText>
					</div>
				</div>

				<div v-for="(section, index) in content.content.sections" :key="index" class="w-full flex flex-col gap-3">
					<div
						class="w-full bg-lightGray cursor-pointer rounded-custom px-4 py-4 flex flex-row items-center justify-between"
						@click.stop="section.opened ? (section.opened = false) : (section.opened = true)">
						<SofaNormalText customClass="!font-bold text-left !line-clamp-1">
							{{ section.title }}
						</SofaNormalText>

						<div class="flex flex-row items-center gap-2">
							<SofaNormalText>{{ section.data.length }} materials </SofaNormalText>
							<SofaIcon customClass="h-[7px]" :name="section.opened ? 'chevron-up' : 'chevron-down'" />
						</div>
					</div>

					<template v-if="section.opened">
						<div
							v-for="(eachData, i) in section.data"
							:key="i"
							class="w-full bg-lightGray rounded-custom px-4 py-4 flex flex-row items-center justify-between">
							<div :class="`flex flex-row items-center gap-3 ${!hasAccess ? 'opacity-50' : ''}`">
								<SofaIcon customClass="h-[42px]" :name="`${eachData.type.toLowerCase()}-content` as any" />
								<div class="flex flex-col gap-1">
									<SofaNormalText customClass="!font-bold text-left  !line-clamp-1">{{ eachData.title }}</SofaNormalText>
									<div class="flex flex-row items-center gap-2">
										<SofaNormalText v-if="!$screen.mobile" color="text-grayColor" customClass="text-left !line-clamp-1">
											{{ eachData.type }}
										</SofaNormalText>
										<span
											v-if="!$screen.mobile"
											class="h-[5px] w-[5px] rounded-full bg-grayColor hidden md:!inline-block">
										</span>
										<SofaNormalText color="text-grayColor" customClass="text-left !line-clamp-1">
											{{ eachData.sub }}
										</SofaNormalText>
									</div>
								</div>
							</div>

							<SofaIcon v-if="!hasAccess" customClass="h-[40px]" name="locked-content" />
						</div>
					</template>
				</div>
			</div>
		</div>

		<div
			v-if="selectedTab == 'questions'"
			:class="`w-full flex flex-col flex-1 rounded-b-[16px] ${hasPadding ? 'px-4' : ''} py-2 relative`">
			<div v-if="hasAccess" class="w-full flex flex-col gap-3">
				<div
					v-for="(question, index) in content.questions"
					:key="index"
					class="w-full bg-lightGray px-4 py-4 flex flex-col gap-2 rounded-custom">
					<div class="flex flex-row items-center gap-2">
						<SofaNormalText color="text-grayColor" :content="question.type" />

						<span class="w-[5px] h-[5px] rounded-full bg-grayColor" />

						<SofaNormalText color="text-grayColor" :content="question.duration" />
					</div>

					<SofaNormalText customClass="text-left !font-bold" :content="question.content" />
				</div>
			</div>

			<div v-if="!hasAccess" class="w-full flex flex-col gap-3 pb-4">
				<SofaEmptyState
					title="You have no access"
					subTitle="Get the course it is in to use"
					actionLabel="Go to course"
					:action="() => $router.push(`/marketplace/${content.courseId}?type=course`)"
					:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
			</div>

			<div v-if="type == 'quiz'" class="sticky bottom-0 w-full flex items-center justify-center mdlg:pt-3 mdlg:pb-0 mdlg:hidden py-4">
				<div class="md:!w-auto w-full flex flex-col">
					<SofaButton
						padding="md:!py-1 py-3 px-4"
						customClass="md:!w-auto w-full"
						@click="hasAccess ? openQuiz() : $router.push(`/marketplace/${content.courseId}?type=course`)">
						{{ hasAccess ? 'Start' : 'Go to course' }}
					</SofaButton>
				</div>
			</div>
		</div>

		<div v-if="selectedTab == 'ratings'" :class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} py-2 relative`">
			<div class="w-full flex flex-col gap-3 pb-4">
				<div class="w-full bg-lightGray rounded-custom mdlg:p-4 p-3 flex gap-3 items-center">
					<div class="flex flex-col py-4 px-2 mdlg:!w-[200px] w-[200px]">
						<div class="mdlg:!px-7 px-3 py-4 flex flex-col gap-2 items-center justify-center border-r-2 border-darkLightGray">
							<div class="flex flex-row">
								<SofaNormalText customClass="mdlg:!text-xl !text-lg">
									{{ content.ratings.avg }}
								</SofaNormalText>
								<SofaNormalText customClass="mdlg:!text-xl  !text-lg" color="text-grayColor"> /5 </SofaNormalText>
							</div>
							<SofaRatings v-model="content.ratings.avg" size="h-[15px] mdlg:!h-[17px]" />

							<SofaNormalText color="text-grayColor">
								{{ content.ratings.label }}
							</SofaNormalText>
						</div>
					</div>

					<div class="w-full flex flex-col gap-2">
						<div
							v-for="(rating, index) in content.ratings.stats"
							:key="index"
							class="w-full flex flex-row items-center justify-between gap-3">
							<SofaNormalText
								customClass="!text-xs mdlg:!text-xs"
								:color="`${content.ratings.stats[index] == 0 ? 'text-grayColor' : 'text-bodyBlack'}`">
								{{ index }} stars
							</SofaNormalText>
							<div class="grow h-[8px] rounded-[8px] bg-darkLightGray relative">
								<div
									class="h-full absolute top-0 left-0 bg-primaryYellow rounded-[8px]"
									:style="`width: ${(content.ratings.stats[index] / content.ratings.count) * 100}%;`"></div>
							</div>

							<SofaNormalText
								customClass="!text-xs mdlg:!text-xs"
								:color="`${content.ratings.stats[index] == 0 ? 'text-grayColor' : 'text-bodyBlack'}`">
								({{ content.ratings.stats[index] }})
							</SofaNormalText>
						</div>
					</div>
				</div>

				<div
					v-for="(review, index) in content.ratings.reviews"
					:key="index"
					class="w-full bg-lightGray rounded-custom mdlg:!px-4 mdlg:!py-4 px-3 py-3 flex flex-row gap-3 items-start">
					<div>
						<SofaAvatar :photoUrl="review.user.photoUrl" :size="44" :userId="review.user.id" />
					</div>

					<div class="flex flex-col gap-1">
						<SofaNormalText customClass="!font-semibold">{{ review.user.name }}</SofaNormalText>
						<SofaRatings v-model="review.rating" size="h-[14px] mdlg:!h-[16px]" />
						<SofaNormalText customClass="text-left">
							{{ review.review }}
						</SofaNormalText>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="selectedTab == 'creator'"
			:class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} py-2 relative pb-4`">
			<div class="w-full bg-lightGray rounded-custom px-4 py-4 flex flex-row gap-4 mdlg:!items-center items-start">
				<SofaAvatar :photoUrl="content.user.photoUrl" :size="$screen.desktop ? 150 : 100" />

				<div class="flex flex-col gap-1">
					<div class="flex flex-row gap-2 items-center">
						<SofaNormalText customClass="!font-bold">{{ content.user.name }}</SofaNormalText>
						<SofaIcon customClass="h-[16px]" name="verify" />
					</div>

					<SofaNormalText>
						{{ content.user.role }}
					</SofaNormalText>

					<div class="w-full flex flex-row items-center gap-4 pt-3">
						<div class="flex flex-row gap-2 items-center">
							<SofaIcon customClass="h-[40px] hidden mdlg:!inline-block" name="profile-quiz" />
							<div class="flex flex-col gap-1 items-start justify-start">
								<SofaNormalText> Quizzes </SofaNormalText>
								<SofaNormalText customClass="!font-bold mdlg:!text-base">
									{{ content.user.stats.quizzes }}
								</SofaNormalText>
							</div>
						</div>

						<div class="flex flex-row gap-2 items-center">
							<SofaIcon customClass="h-[40px] hidden mdlg:!inline-block" name="profile-course" />
							<div class="flex flex-col gap-1 items-start justify-start">
								<SofaNormalText> Courses </SofaNormalText>
								<SofaNormalText customClass="!font-bold mdlg:!text-base">
									{{ content.user.stats.courses }}
								</SofaNormalText>
							</div>
						</div>

						<div class="flex flex-row gap-2 items-center">
							<SofaIcon customClass="h-[40px] hidden mdlg:!inline-block" name="profile-followers" />
							<div class="flex flex-col gap-1 items-start justify-start">
								<SofaNormalText> Followers </SofaNormalText>
								<SofaNormalText customClass="!font-bold mdlg:!text-base">
									{{ content.user.stats.followers }}
								</SofaNormalText>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="selectedTab == 'similar_courses' && type == 'course'"
			:class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} py-2 relative pb-4`">
			<div
				v-if="similarContents?.length"
				class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 flex-nowrap overflow-x-auto scrollbar-hide">
				<div
					class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
					<StudyMaterialCard v-for="m in similarContents" :key="m.hash" type="activity" :material="m" />
				</div>
			</div>
			<template v-else>
				<div class="w-full flex flex-col gap-3">
					<SofaEmptyState
						title="No similar course found"
						subTitle="Discover thousands of materials to buy, created by verified experts"
						actionLabel="Marketplace"
						:action="() => $router.push('/marketplace')" />
				</div>
			</template>
		</div>
	</div>

	<div v-if="showBuyButton && type == 'course'" class="md:!hidden flex flex-col w-full bg-white p-4">
		<SofaButton
			v-if="!hasAccess"
			padding="px-6 py-3"
			:customClass="`${content.status == 'published' ? '' : 'bg-opacity-50'} w-full`"
			@click="buyAction && content.status == 'published' ? buyAction() : null">
			{{ content.price > 0 ? `Buy ${$utils.formatPrice(content.price, content.currency)}` : 'Get course for free' }}
		</SofaButton>
		<SofaButton v-else padding="px-6 py-3" customClass="w-full" @click="$router.push(`/study/courses/${content.id}`)">
			Go to course
		</SofaButton>
	</div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, toRef, watch } from 'vue'
import { ContentDetails } from 'sofa-logic'
import { CourseEntity, QuizEntity } from '@modules/study'

const props = withDefaults(
	defineProps<{
		customClass?: string
		content: ContentDetails
		padding?: string
		hasPadding?: boolean
		type?: string
		contentId?: string
		showBuyButton?: boolean
		buyAction?: () => void
		hasAccess?: boolean
		isMinimal?: boolean
		similarContents?: (QuizEntity | CourseEntity)[]
		actions: {
			report: () => void
			share: () => void
			save: () => void
		}
		openQuiz: () => void
	}>(),
	{
		customClass: '',
		padding: 'px-3 pt-3 mdlg:px-4 mdlg:pt-4',
		hasPadding: true,
		type: 'course',
		contentId: '',
		showBuyButton: false,
		buyAction: null,
		hasAccess: false,
		isMinimal: false,
		similarContents: () => [],
	},
)

const selectedTab = ref('content')

const tabs = ref([])

const typeRef = toRef(props, 'type')

const setContent = () => {
	tabs.value.length = 0

	if (props.type == 'quiz') {
		tabs.value.push({
			name: 'Questions',
			key: 'questions',
		})

		selectedTab.value = 'questions'
	} else {
		tabs.value.push({
			name: 'Content',
			key: 'content',
		})

		selectedTab.value = 'content'
	}

	if (!props.isMinimal) {
		tabs.value.push(
			{
				name: 'Ratings',
				key: 'ratings',
			},
			// {
			//   name: "Creator",
			//   key: "creator",
			// }
		)
	}

	if (props.type == 'course') {
		tabs.value.push({
			name: 'Similar courses',
			key: 'similar_courses',
		})
	}
}

watch(
	typeRef,
	() => {
		setContent()
	},
	{ immediate: true },
)
</script>
