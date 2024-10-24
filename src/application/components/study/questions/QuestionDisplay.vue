<template>
	<div class="flex flex-col justify-center items-start w-full gap-4 text-left">
		<SofaHeading class="border-b-2 pb-2" :class="isDark ? 'border-white' : 'border-darkLightGray'" :content="title" />

		<SofaHeading
			v-if="question.data.type !== QuestionTypes.fillInBlanks && question.data.type !== QuestionTypes.dragAnswers"
			size="title"
			:content="question.question" />

		<SofaImageLoader v-if="question.questionMedia" class="w-full" :photoUrl="question.questionMedia.link" />

		<SofaText :content="question.instruction" />

		<template v-if="question.strippedData.type === QuestionTypes.multipleChoice">
			<a
				v-for="(option, index) in question.strippedData.options"
				:key="index"
				class="w-full flex items-center border-2 justify-between rounded-xl p-3 group gap-3"
				:class="{
					...buildClass(option, index),
					'hover:bg-primaryBlue hover:border-primaryBlue': isDark,
					'hover:bg-lightBlue hover:border-lightBlue': !isDark,
				}"
				@click="selectMultipleChoiceAnswer(index)">
				<div class="grow flex gap-3 items-center">
					<SofaIcon :name="QuestionEntity.getShape(index)" :class="buildIconClass(option, index)" />
					<SofaText :content="option" />
				</div>
			</a>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.trueOrFalse">
			<a
				v-for="(option, index) in [true, false]"
				:key="index"
				class="w-full flex items-center border-2 justify-between rounded-[12px] p-3 group gap-3"
				:class="{
					...buildClass(option, index),
					'hover:bg-primaryBlue hover:border-primaryBlue': isDark,
					'hover:bg-lightBlue hover:border-lightBlue': !isDark,
				}"
				@click="answer.value = option">
				<div class="grow flex gap-3 items-center">
					<SofaIcon :name="QuestionEntity.getShape(index)" :class="buildIconClass(option, index)" />
					<SofaText :content="option.toString()" class="capitalize" />
				</div>
			</a>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.writeAnswer">
			<div class="w-full rounded-xl gap-3 border-2" :class="buildClass(answer.value)">
				<SofaTextarea v-model="answer.value" placeholder="Write your answer here" class="!bg-transparent w-full" />
			</div>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.fillInBlanks">
			<div class="w-full flex md:gap-3 gap-2 items-center flex-wrap">
				<template v-for="(content, index) in question.splitQuestions" :key="index">
					<div
						v-if="index !== 0"
						class="min-w-[160px] rounded-xl p-3 flex items-center justify-center border-2 font-size-mid"
						:class="buildClass(answer.value[index - 1], index - 1)">
						<input
							v-model="answer.value[index - 1]"
							placeholder="answer here"
							class="w-full focus:outline-none text-inherit placeholder:text-inherit" />
					</div>
					<SofaText :content="content" />
				</template>
			</div>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.dragAnswers">
			<div class="w-full flex md:gap-3 gap-2 items-center flex-wrap">
				<template v-for="(content, index) in question.splitQuestions" :key="index">
					<VueDraggable
						v-if="index !== 0"
						:id="`drag-answer-${index - 1}`"
						v-model="answer.drag[index - 1]"
						group="dragAnswers"
						:move="move"
						class="md:min-w-[160px] md:!h-[70px] min-w-[140px] h-[48px] rounded-xl md:p-4 px-2 flex items-center justify-center border-2"
						:class="buildClass(answer.drag[index - 1][0], index - 1)">
						<div
							v-for="(element, i) in answer.drag[index - 1]"
							:key="i"
							class="md:p-4 p-2 flex items-center cursor-move justify-center touch-none rounded-xl border-2"
							:class="isDark ? 'bg-primaryBlue' : 'bg-lightBlue'">
							<SofaText :content="element" />
						</div>
					</VueDraggable>
					<SofaText :content="content" />
				</template>

				<VueDraggable
					id="drag-options"
					v-model="answer.dragOptions"
					group="dragAnswers"
					:move="move"
					class="w-full flex items-center gap-3 pt-6 md:!h-[90px] h-[40px]">
					<div
						v-for="(element, i) in answer.dragOptions"
						:key="i"
						class="md:p-4 p-2 flex items-center cursor-move justify-center touch-none rounded-xl border-2"
						:class="isDark ? 'bg-primaryBlue' : 'bg-lightBlue'">
						<SofaText :content="element" />
					</div>
				</VueDraggable>
			</div>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.sequence">
			<VueDraggable v-model="answer.value" group="sequence" class="flex flex-col gap-4 w-full">
				<div v-for="(element, index) in answer.value" :key="index" class="w-full flex items-center gap-3 cursor-move">
					<div class="p-3 rounded-xl border-2" :class="buildClass(element, index)">
						<SofaText :content="(index + 1).toString()" />
					</div>
					<div class="p-3 rounded-xl border-2 grow" :class="buildClass(element, index)">
						<SofaText :content="element" clamp />
					</div>
				</div>
			</VueDraggable>
		</template>

		<div v-if="question.type === QuestionTypes.match" class="w-full grid grid-cols-2 gap-4">
			<VueDraggable v-model="question.matchQuestions" group="match-questions" class="col-span-1 flex flex-col gap-2" :disabled="true">
				<div
					v-for="(element, index) in question.matchQuestions"
					:key="index"
					class="w-full flex items-center rounded-xl grow p-3 border-2 gap-3"
					:class="buildClass(answer.value[index], index)">
					<SofaIcon :name="QuestionEntity.getShape(index)" :class="buildIconClass(answer.value[index], index)" />
					<SofaText clamp :content="element" />
				</div>
			</VueDraggable>

			<VueDraggable v-model="answer.value" group="match-answers" class="col-span-1 flex flex-col gap-2">
				<div
					v-for="(element, index) in answer.value"
					:key="index"
					class="w-full flex items-center rounded-xl grow p-3 border-2 gap-3 cursor-move"
					:class="buildClass(element, index)">
					<SofaIcon :name="QuestionEntity.getShape(index)" :class="buildIconClass(element, index)" />
					<SofaText clamp :content="element" />
				</div>
			</VueDraggable>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { QuestionEntity, QuestionTypes } from '@modules/study'

const props = defineProps<{
	question: QuestionEntity
	title: string
	optionState: (val: boolean | string, index?: number) => 'selected' | 'right' | 'wrong' | null
	isDark: boolean
}>()

const model = defineModel<any>()

const answer = reactive({
	value: model.value,
	dragOptions: props.question.dragAnswers.filter((x) => !model.value.includes(x)),
	drag: Array.from({ length: props.question.dragAnswers.length }, (_, idx) => (model.value[idx] ? [model.value[idx]] : [])),
})

watch(
	answer,
	() => {
		if (props.question.type === QuestionTypes.dragAnswers) model.value = answer.drag.flat(1)
		else model.value = answer.value
	},
	{ immediate: true },
)

const move = (e: { from: HTMLElement; to: HTMLElement; draggedContext: { element: string } }) => {
	const optionsId = 'drag-options'
	const answersId = 'drag-answer-'
	if (e.to.id === optionsId) return true
	const toId = Number(e.to.id.split(answersId)[1])
	if (answer.drag[toId].length) return false
}

const selectMultipleChoiceAnswer = (index: number) => {
	if (props.question.strippedData.type !== QuestionTypes.multipleChoice) return
	if (answer.value.includes(index)) return answer.value.splice(answer.value.indexOf(index), 1)
	if (answer.value.length < props.question.strippedData.noOfAnswers) return answer.value.push(index)
	return answer.value.splice(answer.value.length - 1, 1, index)
}

const buildClass = (...args: Parameters<(typeof props)['optionState']>) => ({
	'bg-white border-darkLightGray': !props.isDark,
	'bg-deepGray border-white': props.isDark,
	'!bg-[#E1F5EB] !border-primaryGreen': props.optionState(...args) === 'right',
	'!bg-[#FAEBEB] !border-primaryRed': props.optionState(...args) === 'wrong',
	'!bg-lightBlue !border-lightBlue shake': props.optionState(...args) === 'selected' && !props.isDark,
	'!bg-primaryBlue !border-primaryBlue shake': props.optionState(...args) === 'selected' && props.isDark,
})

const buildIconClass = (...args: Parameters<(typeof props)['optionState']>) => ({
	'group-hover:stroke-lightBlue': !props.isDark,
	'stroke-white': props.isDark,
	'!stroke-primaryGreen': props.optionState(...args) === 'right',
	'!stroke-primaryRed': props.optionState(...args) === 'wrong',
	'!stroke-lightBlue': props.optionState(...args) === 'selected' && !props.isDark,
	'!stroke-white': props.optionState(...args) === 'selected' && props.isDark,
	'h-[20px] md:h-[23px]': true,
})
</script>

<style scoped>
@keyframes shake {
	0% {
		transform: translateX(0);
	}

	25%,
	75% {
		transform: translateX(-5px);
	}

	50%,
	100% {
		transform: translateX(5px);
	}
}

.shake {
	animation: shake 0.5s 1;
}
</style>
