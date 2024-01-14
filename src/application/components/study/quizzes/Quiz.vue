<template>
	<slot name="header">
		<div class="p-4 md:py-8 w-full flex justify-center shadow-custom" :class="{ 'md:bg-white': !isDark, 'text-white': isDark }">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-4 justify-between">
				<SofaIcon class="md:hidden" :custom-class="'h-[19px]'" :name="'circle-close'" @click="Logic.Common.goBack()" />
				<SofaHeaderText :size="'xl'" custom-class="!font-bold !text-sm truncate" color="text-inherit" :content="title" />
				<SofaNormalText class="md:hidden whitespace-nowrap" :content="`${index + 1}/${questions.length}`" color="text-inherit" />
				<SofaNormalText
					class="hidden md:inline"
					:custom-class="'!text-base cursor-pointer whitespace-nowrap'"
					color="text-inherit"
					content="Exit"
					@click="Logic.Common.goBack()" />
			</div>
		</div>
	</slot>

	<div class="w-full h-full flex-grow overflow-y-auto px-4 flex flex-col items-center" :class="{ 'text-white': isDark }">
		<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full h-full overflow-y-auto flex flex-col gap-8 items-center justify-center">
			<slot>
				<QuestionDisplay
					v-if="question"
					:key="question.id"
					v-model="answer"
					:question="question"
					:is-dark="isDark"
					:title="title"
					:option-state="optionState" />
				<slot name="postBody" />
			</slot>
		</div>
	</div>

	<slot name="footer">
		<div
			v-if="leftButton || rightButton"
			class="px-4 py-2 md:py-4 w-full flex justify-center shadow-customInverted"
			:class="{ 'md:bg-white': !isDark, 'text-white': isDark }">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-4 justify-center">
				<SofaButton
					v-if="leftButton"
					class="w-full md:w-auto mr-auto"
					custom-class="md:font-semibold"
					padding="py-3 md:px-6"
					:disabled="leftButton.disabled"
					:bg-color="leftButton.bgColor"
					:text-color="leftButton.textColor"
					@click="leftButton.click">
					{{ leftButton.label }}
				</SofaButton>

				<span v-if="showCounter" class="px-4 py-2 rounded-lg font-semibold hidden md:inline mx-auto">
					{{ index + 1 }}/{{ questions.length }}
				</span>

				<SofaButton
					v-if="rightButton"
					class="w-full md:w-auto ml-auto"
					custom-class="md:font-semibold"
					padding="py-3 md:px-6"
					:disabled="rightButton.disabled"
					:bg-color="rightButton.bgColor"
					:text-color="rightButton.textColor"
					@click="rightButton.click">
					{{ rightButton.label }}
				</SofaButton>
			</div>
		</div>
	</slot>
</template>

<script lang="ts" setup>
import QuestionDisplay from '@app/components/study/quizzes/QuestionDisplay.vue'
import { QuestionEntity } from '@modules/study'
import { Logic } from 'sofa-logic'
import { PropType, computed, defineEmits, defineProps } from 'vue'

type ButtonConfig = {
	label: string
	bgColor: string
	textColor: string
	disabled?: boolean
	click: () => void
}

const props = defineProps({
	index: {
		type: Number,
		required: true,
	},
	questions: {
		type: Array as PropType<QuestionEntity[]>,
		required: true,
	},
	answer: {
		type: [Array, String, Boolean] as PropType<any>,
		required: true,
		validator: () => true,
	},
	isDark: {
		type: Boolean,
		required: false,
		default: false,
	},
	title: {
		type: String,
		required: true,
	},
	rightButton: {
		type: Object as PropType<ButtonConfig>,
		required: false,
		default: null,
	},
	leftButton: {
		type: Object as PropType<ButtonConfig>,
		required: false,
		default: null,
	},
	optionState: {
		type: Function as PropType<InstanceType<typeof QuestionDisplay>['$props']['optionState']>,
		required: true,
	},
	showCounter: {
		type: Boolean,
		required: false,
		default: true,
	},
})

const emits = defineEmits(['update:answer'])

const answer = computed({
	get: () => props.answer,
	set: (v) => {
		emits('update:answer', v)
	},
})

const question = computed(() => props.questions.at(props.index))
</script>
