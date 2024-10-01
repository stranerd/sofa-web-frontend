<template>
	<FullLayout :hide="{ top: true }" :hideTopBar="true">
		<!-- topBar -->
		<template #top-bar>
			<div
				class="flex gap-2 py-2 items-center w-full lg:text-sm mdlg:text-[12px] text-xs z-[100] px-6 sticky top-0 mdlg:bg-white bg-lightGray justify-between mdlg:shadow-custom">
				<SofaHeading content="Create a quiz" />
				<div class="flex gap-4 items-center">
					<template v-for="(tab, index) in topBarTabs" :key="tab.name">
						<router-link
							class="py-4 flex items-center justify-center gap-2 whitespace-nowrap"
							:class="[
								{ 'px-2 font-bold h-[40px] text-grayColor border-2 border-lightGray rounded-custom': index === 3 },
								{ 'px-2 font-bold h-[40px] text-white bg-primaryBlue rounded-custom': index === 4 },
							]"
							:to="tab.path">
							<SofaIcon v-if="tab.icon" :name="tab.icon" class="h-[18px] fill-current" />
							<SofaText :content="tab.name" />
						</router-link>
						<!-- vertical line before the third item -->
						<div v-if="index === 2" class="h-[24px] w-[3px] bg-lightGray rounded"></div>
					</template>
				</div>
			</div>
		</template>
		<template #left-session>
			<div
				class="w-full shadow-custom px-4 pb-4 bg-white relative rounded-2xl gap-1 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:scrollbar-thin flex flex-col"></div>
		</template>

		<template #middle-session>
			<slot />
		</template>

		<template #right-session>
			<div class="w-full min-h-fit shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col justify-between">
				<div>
					<div v-for="tab in questionsTypes" :key="tab.name">
						<div class="w-full flex justify-between items-center cursor-pointer">
							<div class="flex items-center gap-3">
								<SofaIcon :name="tab.icon" class="h-[12px] fill-deepGray" />
								<SofaText :content="tab.name" :bold="true" />
							</div>
							<div class="flex items-center">
								<SofaIcon class="transition duration-75 h-[6px]" name="angle-small-down" />
							</div>
						</div>
						<div class="mt-3">
							<!--  dropdown content here -->
							<div v-if="Array.isArray(tab.content)" class="grid grid-cols-2 gap-3">
								<div
									v-for="content in tab.content"
									:key="content.type"
									class="flex flex-col justify-center items-center gap-1 p-3 bg-lightGray rounded-custom w-[100px] h-[118px]">
									<SofaIcon :name="content.icon" class="w-[55px]" />
									<SofaText :content="content.type" class="text-center" size="sub" />
								</div>
							</div>
						</div>
					</div>
					<!-- other options -->
					<div v-for="(option, index) in tabOptions" :key="index" class="flex items-center">
						<SofaIcon :name="option.icon" class="h-[12px] fill-deepGray" />
						<SofaSelect :placeholder="option.name" class="bg-transparent px-0" :options="[]" />
					</div>
				</div>
				<div class="space-y-6">
					<div class="flex items-center gap-3">
						<SofaIcon name="file-image" class="h-[12px] fill-deepGray" />
						<SofaText content="Duplicate question" :bold="true" />
					</div>
					<div class="flex items-center gap-3">
						<SofaIcon name="trash" class="h-[12px] fill-primaryRed" />
						<SofaText content="Delete question" :bold="true" class="text-primaryRed" />
					</div>
				</div>
			</div>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabOptions = ref([
	{ name: 'Time limit', icon: 'time-limit' as IconName },
	{ name: 'Total options', icon: 'total-options' as IconName },
	{ name: 'Correct answer(s)', icon: 'check-square' as IconName },
])
const questionsTypes = ref([
	{
		name: 'Question type',
		content: [
			{
				type: 'Multiple Choice',
				icon: 'question-multiple-choice' as IconName,
			},
			{
				type: 'True or False',
				icon: 'question-true-false' as IconName,
			},
			{
				type: 'Write answer',
				icon: 'question-write-answer' as IconName,
			},
			{
				type: 'Fill in the blank(s)',
				icon: 'question-fill-in-blanks' as IconName,
			},
			{
				type: 'Drag Answer',
				icon: 'question-drag-answers' as IconName,
			},
			{
				type: 'Match',
				icon: 'question-match' as IconName,
			},
			{
				type: 'Sequence',
				icon: 'question-sequence' as IconName,
			},
		],
		icon: 'question-type' as IconName,
	},
])

const topBarTabs = ref([
	{ name: 'Share', icon: 'share' as IconName, path: '' },
	{ name: 'Preview', icon: 'preview' as IconName, path: '' },
	{ name: 'Settings', icon: 'settings' as IconName, path: '' },
	{ name: 'Exit', path: '' },
	{ name: 'Create', path: '' },
])
</script>
