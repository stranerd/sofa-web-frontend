<template>
	<div :class="`w-full flex flex-col gap-2 h-full relative bg-white mdlg:!rounded-[16px] overflow-y-auto rounded-custom ${customClass}`">
		<div :class="`w-full flex flex-col gap-2 ${padding} relative`">
			<div
				class="w-full flex mdlg:!flex md:!flex-row mdlg:!flex-none flex-col relative mdlg:!items-start h-auto items-start justify-start gap-3 mdlg:space-x-3">
				<div :class="` ${hasPadding ? 'mdlg:!w-[25%]' : 'mdlg:!w-[33%]'} w-full h-full mdlg:!absolute top-0 left-0`">
					<sofa-image-loader
						:custom-class="'mdlg:!w-full w-full mdlg:!h-full h-[200px] rounded-custom relative'"
						:photo-url="content.image">
						<div
							v-if="content.price > 0 && !hasAccess"
							class="flex flex-row gap-2 items-center justify-end absolute bottom-0 left-0 w-full px-2 py-2">
							<sofa-badge :custom-class="'!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom'">
								{{ content.price > 0 ? Logic.Common.formatPrice(content.price, content.currency) : 'Start' }}
							</sofa-badge>
						</div>
					</sofa-image-loader>
				</div>
				<div
					:class="`flex flex-col gap-2 flex-grow   ${
						hasPadding ? 'mdlg:!w-[75%] mdlg:!pl-[25%]' : 'mdlg:!w-[67%] mdlg:!pl-[33%]'
					}`">
					<div class="w-full flex flex-row items-center justify-between">
						<sofa-header-text :content="content.title" />

						<div class="mdlg:!flex flex-row items-center justify-end gap-4 hidden">
							<sofa-icon :name="'flag'" :custom-class="'h-[16px] cursor-pointer '" @click="actions.report()" />
							<sofa-icon :name="'share'" :custom-class="'h-[16px] cursor-pointer'" @click="actions.share()" />
							<sofa-icon :name="'save'" :custom-class="'h-[16px] cursor-pointer'" @click="actions.save()" />
						</div>
					</div>
					<sofa-normal-text :custom-class="'text-left'">
						{{ content.info }}
					</sofa-normal-text>
					<div class="flex flex-row gap-2 items-center">
						<sofa-normal-text :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
							{{ content.labels.main }}
						</sofa-normal-text>
						<span
							:class="`h-[5px] w-[5px] rounded-full ${
								content.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'
							}`">
						</span>
						<sofa-normal-text :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">{{
							content.labels.sub
						}}</sofa-normal-text>
					</div>

					<div v-if="!isMinimal" class="w-full flex flex-row gap-2 items-center">
						<div class="flex flex-row gap-1 items-center">
							<sofa-ratings :count="content.ratings.avg" :size="'h-[14px] mdlg:!h-[15px]'" />
							<sofa-normal-text>
								{{ content.ratings.avg }}
							</sofa-normal-text>
							<sofa-normal-text :color="'text-grayColor pl-2'"> ({{ content.ratings.label }}) </sofa-normal-text>
						</div>
					</div>

					<div class="w-full flex flex-row items-center gap-2 justify-between">
						<div class="flex flex-row items-center gap-2">
							<div v-if="!isMinimal" class="gap-2 flex flex-row items-center">
								<sofa-avatar :size="'20'" :photo-url="content.user.photoUrl" />
								<sofa-normal-text>
									{{ content.user.name }}
								</sofa-normal-text>
							</div>

							<span v-if="!isMinimal" :class="`h-[5px] w-[5px] rounded-full bg-bodyBlack`"> </span>

							<sofa-normal-text>
								{{ content.lastUpdated }}
							</sofa-normal-text>
						</div>

						<div v-if="showBuyButton && type == 'course'" class="md:!flex hidden flex-col">
							<sofa-button
								v-if="!hasAccess"
								:padding="'px-6 py-1'"
								:custom-class="`${content.status == 'published' ? '' : 'bg-opacity-50'}`"
								@click="buyAction && content.status == 'published' ? buyAction() : null">
								{{
									content.price > 0
										? `Buy ${Logic.Common.formatPrice(content.price, content.currency)}`
										: 'Get course for free'
								}}
							</sofa-button>
							<sofa-button
								v-else
								:padding="'px-6 py-1'"
								:custom-class="'w-auto'"
								@click="Logic.Common.GoToRoute('/course/' + content.id)">
								Go to course
							</sofa-button>
						</div>
						<div v-if="type == 'quiz'" class="md:!flex hidden flex-col">
							<sofa-button :padding="'px-6 py-1'" @click="hasAccess ? openQuiz() : Logic.Common.GoToRoute(content.route)">
								{{ hasAccess ? 'Start' : 'Go to course' }}
							</sofa-button>
						</div>
					</div>
				</div>
			</div>

			<div class="w-full flex flex-row gap-3 items-center py-2 flex-nowrap overflow-x-auto scrollbar-hide">
				<div v-for="(tag, index) in content.tags" :key="index" class="px-4 py-1 border rounded-custom border-grayColor">
					<sofa-normal-text :color="'text-grayColor'" :custom-class="'!whitespace-nowrap'">{{ tag }}</sofa-normal-text>
				</div>
			</div>
		</div>

		<div
			:class="`w-full flex flex-row gap-4 items-center border-b border-lightGray mdlg:!relative sticky mdlg:!pr-5 pr-4 top-0 left-0 z-50 bg-white pt-3 mdlg:!pt-0  ${
				hasPadding ? 'px-4' : ''
			}`">
			<sofa-normal-text
				v-for="(tab, index) in tabs"
				:key="index"
				:color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'"
				:custom-class="`!font-semibold cursor-pointer pb-2  ${
					selectedTab == tab.key && !isMinimal ? 'border-b-2 border-bodyBlack' : ''
				}`"
				@click="selectedTab = tab.key">
				{{ tab.name }}
			</sofa-normal-text>
		</div>

		<div
			v-if="selectedTab == 'content'"
			:class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} overflow-y-auto py-2 relative`">
			<sofa-content :data="content.content" :has-access="hasAccess" />
		</div>

		<div
			v-if="selectedTab == 'questions'"
			:class="`w-full flex flex-col h-full  rounded-b-[16px] ${hasPadding ? 'px-4' : ''} overflow-y-auto py-2 relative`">
			<div v-if="hasAccess" class="w-full flex flex-col gap-3 h-full overflow-y-auto">
				<div
					v-for="(question, index) in content.questions"
					:key="index"
					class="w-full bg-lightGray px-4 py-4 flex flex-col gap-2 rounded-custom">
					<div class="flex flex-row items-center gap-2">
						<sofa-normal-text :color="'text-grayColor'" :content="question.type" />

						<span class="w-[5px] h-[5px] rounded-full bg-grayColor" />

						<sofa-normal-text :color="'text-grayColor'" :content="question.duration" />
					</div>

					<sofa-normal-text :custom-class="'text-left !font-bold'" :content="question.content" />

					<!-- <sofa-normal-text :customClass="'text-left'" :content="question.answer" /> -->
				</div>
			</div>

			<div v-if="!hasAccess" class="w-full flex flex-col gap-3 pb-4">
				<sofa-empty-state
					:title="'You have no access'"
					:sub-title="'Get the course it is in to use'"
					:action-label="'Go to course'"
					:action="() => Logic.Common.GoToRoute(`/marketplace/${content.courseId}?type=course`)"
					:icon="{ name: 'lock-white', size: 'h-[28px]' }" />
			</div>

			<div
				v-if="type == 'quiz'"
				class="w-full flex flex-row items-center justify-center mdlg:!pt-3 mdlg:!relative fixed bottom-0 mdlg:!pb-0 mdlg:hidden pt-4 pb-4 mdlg:!px-0 px-4 z-[50] bg-white left-0 mdlg:!bottom-auto mdlg:!left-auto">
				<div class="md:!w-auto w-full flex flex-col">
					<sofa-button
						:padding="'md:!py-1 py-3 px-4'"
						:custom-class="'md:!w-auto w-full'"
						@click="hasAccess ? openQuiz() : Logic.Common.GoToRoute(`/marketplace/${content.courseId}?type=course`)">
						{{ hasAccess ? 'Start' : 'Go to course' }}
					</sofa-button>
				</div>
			</div>
		</div>

		<div
			v-if="selectedTab == 'ratings'"
			:class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} overflow-y-auto py-2 relative`">
			<sofa-content-ratings :data="content.ratings" />
		</div>

		<div
			v-if="selectedTab == 'creator'"
			:class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} overflow-y-auto py-2 relative pb-4`">
			<div class="w-full bg-lightGray rounded-custom px-4 py-4 flex flex-row gap-4 mdlg:!items-center items-start">
				<div>
					<sofa-avatar :photo-url="content.user.photoUrl" :size="'150'" :custom-class="'hidden mdlg:!inline-block'" />

					<sofa-avatar :photo-url="content.user.photoUrl" :size="'100'" :custom-class="'mdlg:!hidden '" />
				</div>

				<div class="flex flex-col gap-1">
					<div class="flex flex-row gap-2 items-center">
						<sofa-normal-text :custom-class="'!font-bold'">{{ content.user.name }}</sofa-normal-text>
						<sofa-icon :custom-class="'h-[16px]'" :name="'verify'" />
					</div>

					<sofa-normal-text>
						{{ content.user.role }}
					</sofa-normal-text>

					<!-- <div class="w-full flex flex-row py-3 pb-4">
            <sofa-button :padding="'px-5 py-1'" :customClass="'!font-semibold'"
              >Follow</sofa-button
            >
          </div> -->

					<div class="w-full flex flex-row items-center gap-4 pt-3">
						<div class="flex flex-row gap-2 items-center">
							<sofa-icon :custom-class="'h-[40px] hidden mdlg:!inline-block'" :name="'profile-quiz'" />
							<div class="flex flex-col gap-1 items-start justify-start">
								<sofa-normal-text> Quizzes </sofa-normal-text>
								<sofa-normal-text :custom-class="'!font-bold mdlg:!text-base'">
									{{ content.user.stats.quizzes }}
								</sofa-normal-text>
							</div>
						</div>

						<div class="flex flex-row gap-2 items-center">
							<sofa-icon :custom-class="'h-[40px] hidden mdlg:!inline-block'" :name="'profile-course'" />
							<div class="flex flex-col gap-1 items-start justify-start">
								<sofa-normal-text> Courses </sofa-normal-text>
								<sofa-normal-text :custom-class="'!font-bold mdlg:!text-base'">
									{{ content.user.stats.courses }}
								</sofa-normal-text>
							</div>
						</div>

						<div class="flex flex-row gap-2 items-center">
							<sofa-icon :custom-class="'h-[40px] hidden mdlg:!inline-block'" :name="'profile-followers'" />
							<div class="flex flex-col gap-1 items-start justify-start">
								<sofa-normal-text> Followers </sofa-normal-text>
								<sofa-normal-text :custom-class="'!font-bold mdlg:!text-base'">
									{{ content.user.stats.followers }}
								</sofa-normal-text>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- <div class="w-full !h-[100px]"></div> -->
		</div>

		<div
			v-if="selectedTab == 'similar_courses' && type == 'course'"
			:class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''} overflow-y-auto py-2 relative pb-4`">
			<div
				v-if="similarContents?.length"
				class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 flex-nowrap overflow-x-auto scrollbar-hide">
				<div
					class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
					<sofa-activity-card
						v-for="(activity, index) in similarContents"
						:key="index"
						:activity="activity"
						:custom-class="'!bg-lightGray cursor-pointer'"
						@click="Logic.Common.GoToRoute(activity.route)" />
				</div>
			</div>
			<template v-else>
				<div class="w-full flex flex-col gap-3">
					<sofa-empty-state
						:title="'No similar course found'"
						:sub-title="'Discover thousands of materials to buy, created by verified experts'"
						:action-label="'Marketplace'"
						:action="
							() => {
								Logic.Common.GoToRoute('/marketplace')
							}
						" />
				</div>
			</template>
		</div>
	</div>

	<!-- Smaller screen purchase buttons -->
	<div v-if="showBuyButton && type == 'course'" class="md:!hidden flex flex-col w-full bg-white p-4">
		<sofa-button
			v-if="!hasAccess"
			:padding="'px-6 py-3'"
			:custom-class="`${content.status == 'published' ? '' : 'bg-opacity-50'} w-full`"
			@click="buyAction && content.status == 'published' ? buyAction() : null">
			{{ content.price > 0 ? `Buy ${Logic.Common.formatPrice(content.price, content.currency)}` : 'Get course for free' }}
		</sofa-button>
		<sofa-button v-else :padding="'px-6 py-3'" :custom-class="'w-full'" @click="Logic.Common.GoToRoute('/course/' + content.id)">
			Go to course
		</sofa-button>
	</div>
</template>
<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ContentDetails, Logic, ResourceType } from 'sofa-logic'
import { ref, toRef, watch } from 'vue'
import SofaActivityCard from '../SofaActivityCard'
import SofaAvatar from '../SofaAvatar'
import SofaBadge from '../SofaBadge'
import SofaButton from '../SofaButton'
import SofaContent from '../SofaContent'
import SofaContentRatings from '../SofaContentRatings'
import SofaEmptyState from '../SofaEmptyState'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import SofaRatings from '../SofaRatings'
import { SofaHeaderText, SofaNormalText } from '../SofaTypography'

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
		similarContents?: ResourceType[]
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
