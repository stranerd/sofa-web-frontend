<template>
	<ExpandedLayout width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:py-4" :hide="{ bottom: true }">
		<div class="mdlg:flex hidden justify-between items-center w-full">
			<SofaNormalText color="text-grayColor" class="w-full flex justify-start gap-1">
				<router-link to="/marketplace">Marketplace</router-link>
				<span> / {{ contentDetails.title }}</span>
			</SofaNormalText>
		</div>
		<div class="w-full flex mdlg:hidden items-center z-[10] gap-3 justify-between bg-lightGray p-4 sticky top-0">
			<SofaIcon class="h-[15px]" name="back-arrow" @click="$utils.goBack()" />
			<SofaNormalText class="!font-bold !text-base">
				{{ contentDetails.type == 'course' ? 'Course details' : 'Quiz details' }}
			</SofaNormalText>
			<span class="w-4" />
		</div>
		<ContentDetails
			v-if="contentDetails.original"
			:material="contentDetails.original"
			class="w-full bg-white mdlg:rounded-2xl grow overflow-y-auto" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'
import ContentDetails from '@app/components/study/ContentDetails.vue'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'MarketplaceIdPage',
	components: { ContentDetails },
	routeConfig: {
		fetchRules: [
			{
				domain: 'Study',
				property: 'SingleCourse',
				method: 'GetCourse',
				params: [],
				useRouteId: true,
				ignoreProperty: true,
				condition: {
					routeSearchItem: 'fullPath',
					searchQuery: 'course',
				},
			},
			{
				domain: 'Study',
				property: 'SingleQuiz',
				method: 'GetQuiz',
				params: [],
				useRouteId: true,
				ignoreProperty: true,
				condition: {
					routeSearchItem: 'fullPath',
					searchQuery: 'quiz',
				},
			},
		],
	},
	setup() {
		useMeta({
			title: 'Course Info',
		})

		const SingleCourse = ref(Logic.Study.SingleCourse)
		const SingleQuiz = ref(Logic.Study.SingleQuiz)

		const contentDetails = reactive(Logic.Study.contentDetails)

		const setCourseData = () => {
			if (SingleCourse.value) {
				contentDetails.original = SingleCourse.value
			}
		}

		const setQuizData = () => {
			if (SingleQuiz.value) {
				contentDetails.original = SingleQuiz.value
			}
		}

		watch(
			SingleCourse,
			() => {
				if (SingleCourse.value) {
					setCourseData()
				}
			},
			{ immediate: true },
		)

		watch(
			SingleQuiz,
			() => {
				if (SingleQuiz.value) {
					setQuizData()
				}
			},
			{ immediate: true },
		)

		onMounted(() => {
			// const type = Logic.Common.route.query?.type?.toString()
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
			Logic.Study.watchProperty('SingleQuiz', SingleQuiz)
		})

		return {
			contentDetails,
		}
	},
})
</script>
