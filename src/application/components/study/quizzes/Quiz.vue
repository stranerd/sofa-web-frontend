<template>
	<slot name="header">
		<div
			v-if="!isLesson"
			class="p-4 md:py-8 w-full flex justify-center shadow-custom"
			:class="{ 'md:bg-white': !isDark, 'text-white': isDark }">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-4 justify-between">
				<SofaIcon class="md:hidden" customClass="h-[19px]" name="circle-close" @click="Logic.Common.goBack()" />
				<SofaHeaderText size="xl" customClass="!font-bold !text-sm truncate" color="text-inherit" :content="title" />
				<SofaNormalText class="md:hidden whitespace-nowrap" :content="`${index + 1}/${questions.length}`" color="text-inherit" />
				<SofaNormalText
					class="hidden md:inline"
					customClass="!text-base cursor-pointer whitespace-nowrap"
					color="text-inherit"
					content="Exit"
					@click="Logic.Common.goBack()" />
			</div>
		</div>
	</slot>

	<div class="w-full h-full flex-grow overflow-y-auto px-4 flex flex-col items-center" :class="{ 'text-white': isDark }">
		<div
			class="w-full h-full overflow-y-auto flex flex-col gap-8 items-center"
			:class="{ 'lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] justify-center': !isLesson, 'pt-4': isLesson }">
			<slot>
				<QuestionDisplay
					v-if="question"
					:key="question.id"
					v-model="answer"
					:question="question"
					:isDark="isDark"
					:title="title"
					:optionState="optionState" />
				<slot name="postBody" />
			</slot>
		</div>
	</div>

	<slot name="footer">
		<div
			v-if="leftButton || rightButton"
			class="px-4 py-2 md:py-4 w-full flex justify-center shadow-customInverted"
			:class="{ 'md:bg-white': !isDark && !isLesson, 'text-white': isDark, 'bg-lightGray': isLesson }">
			<div class="w-full flex items-center gap-4 justify-center" :class="{ 'lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%]': !isLesson }">
				<SofaButton
					v-if="leftButton"
					class="w-full md:w-auto mr-auto"
					customClass="md:font-semibold"
					padding="py-3 md:px-6"
					:disabled="leftButton.disabled"
					:bgColor="leftButton.bgColor"
					:textColor="leftButton.textColor"
					@click="leftButton.click">
					{{ leftButton.label }}
				</SofaButton>

				<span v-if="showCounter" class="px-4 py-2 rounded-lg font-semibold hidden md:inline mx-auto">
					{{ index + 1 }}/{{ questions.length }}
				</span>

				<SofaButton
					v-if="rightButton"
					class="w-full md:w-auto ml-auto"
					customClass="md:font-semibold"
					padding="py-3 md:px-6"
					:disabled="rightButton.disabled"
					:bgColor="rightButton.bgColor"
					:textColor="rightButton.textColor"
					@click="rightButton.click">
					{{ rightButton.label }}
				</SofaButton>
			</div>
		</div>
	</slot>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import QuestionDisplay from '@app/components/study/questions/QuestionDisplay.vue'
import { QuestionEntity } from '@modules/study'
import { Logic } from 'sofa-logic'

type ButtonConfig = {
	label: string
	bgColor: string
	textColor: string
	disabled?: boolean
	click: () => void
}

const props = withDefaults(
	defineProps<{
		index: number
		questions: QuestionEntity[]
		isDark?: boolean
		title: string
		rightButton?: ButtonConfig | null
		leftButton?: ButtonConfig | null
		optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState']
		showCounter?: boolean
		isLesson?: boolean
	}>(),
	{
		isDark: false,
		rightButton: null,
		leftButton: null,
		showCounter: true,
		isLesson: false,
	},
)

const answer = defineModel<any>('answer')

const question = computed(() => props.questions.at(props.index))
</script>
