<template>
	<slot name="header">
		<div class="p-4 md:py-8 w-full flex justify-center shadow-custom"
			:class="{ 'md:bg-white': !isDark, 'text-white': isDark }">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-4 justify-between">
				<SofaIcon class="md:hidden" :customClass="'h-[19px]'" :name="'circle-close'"
					@click="Logic.Common.goBack()" />
				<SofaHeaderText :size="'xl'" customClass="!font-bold !text-sm truncate" color="text-inherit"
					:content="title" />
				<SofaNormalText class="md:hidden whitespace-nowrap" :content="`${index + 1}/${questions.length}`"
					color="text-inherit" />
				<SofaNormalText class="hidden md:inline" :customClass="'!text-base cursor-pointer whitespace-nowrap'"
					color="text-inherit" content="Exit" @click="Logic.Common.goBack()" />
			</div>
		</div>
	</slot>

	<div class="w-full h-full flex-grow overflow-y-auto px-4 flex flex-col items-center" :class="{ 'text-white': isDark }">
		<div
			class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full h-full overflow-y-auto flex flex-col gap-8 items-center justify-center">
			<slot>
				<QuestionDisplay v-if="question" :key="question.id" v-model="answer" :question="question" :isDark="isDark"
					:title="title" :optionState="optionState"  />
				<slot name="postBody" />
			</slot>
		</div>
	</div>

	<slot name="footer">
		<div v-if="leftButton || rightButton" class="px-4 py-2 md:py-4 w-full flex justify-center shadow-customInverted"
			:class="{ 'md:bg-white': !isDark, 'text-white': isDark }">
			<div class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex items-center gap-4 justify-center">
				<SofaButton class="!w-full md:!w-auto mr-auto" customClass="w-full md:font-semibold whitespace-nowrap"
					padding="py-3 md:px-6" v-if="leftButton" :disabled="leftButton.disabled" :bgColor="leftButton.bgColor"
					:textColor="leftButton.textColor" @click="leftButton.click">
					{{ leftButton.label }}
				</SofaButton>

				<span v-if="showCounter" class="px-4 py-2 rounded-lg font-semibold hidden md:inline mx-auto">
					{{ index + 1 }}/{{ questions.length }}
				</span>

				<SofaButton class="!w-full md:!w-auto ml-auto" customClass="w-full md:font-semibold whitespace-nowrap"
					padding="py-3 md:px-6" v-if="rightButton" :disabled="rightButton.disabled"
					:bgColor="rightButton.bgColor" :textColor="rightButton.textColor" @click="rightButton.click">
					{{ rightButton.label }}
				</SofaButton>
			</div>
		</div>
	</slot>
</template>

<script lang="ts" setup>
import QuestionDisplay from '@/components/quizzes/QuestionDisplay.vue'
import { Logic, TransformedQuestion } from 'sofa-logic'
import { SofaButton, SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { PropType, computed, defineEmits, defineProps } from 'vue'

type ButtonConfig = {
	label: string,
	bgColor: string,
	textColor: string,
	disabled?: boolean,
	click: () => void
}

const props = defineProps({
	index: {
		type: Number,
		required: true
	},
	questions: {
		type: Array as PropType<TransformedQuestion[]>,
		required: true
	},
	answer: {
		type: [Array, String, Boolean] as PropType<any>,
		required: true,
		validator: () => true
	},
	isDark: {
		type: Boolean,
		required: false,
		default: false
	},
	title: {
		type: String,
		required: true
	},
	rightButton: {
		type: Object as PropType<ButtonConfig>,
		required: false,
	},
	leftButton: {
		type: Object as PropType<ButtonConfig>,
		required: false,
	},
	optionState: {
		type: Function as PropType<InstanceType<typeof QuestionDisplay>['$props']['optionState']>,
		required: true
	},
	showCounter: {
		type: Boolean,
		required: false,
		default: true
	}
})

const emits = defineEmits(['update:answer'])

const answer = computed({
	get: () => props.answer,
	set: (v) => {
		emits('update:answer', v)
	}
})

const question = computed(() => props.questions.at(props.index))
</script>