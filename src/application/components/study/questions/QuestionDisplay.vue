<template>
	<div class="flex flex-col justify-center items-start w-full gap-4 text-left">
		<SofaHeaderText
			class="!font-bold border-b-2 pb-2"
			:class="isDark ? 'border-white' : 'border-darkLightGray'"
			color="text-inherit"
			:content="title" />

		<SofaHeaderText
			v-if="question.data.type !== QuestionTypes.fillInBlanks && question.data.type !== QuestionTypes.dragAnswers"
			class="!font-bold md:!text-2xl text-base w-full justify-start"
			color="text-inherit"
			:content="question.question" />

		<SofaImageLoader v-if="question.questionMedia" class="w-full h-[250px]" :photoUrl="question.questionMedia.link" />

		<SofaNormalText color="text-inherit" class="pb-2" :content="question.instruction" />

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
				<div class="flex-grow flex gap-3 items-center">
					<SofaIcon :name="Logic.Study.getShape(index)" :class="buildIconClass(option, index)" />
					<SofaHeaderText
						:content="option"
						color="text-inherit"
						class="md:!text-lg mdlg:!text-xl text-xs w-full justify-start flex" />
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
				<div class="flex-grow flex gap-3 items-center">
					<SofaIcon :name="Logic.Study.getShape(index)" :class="buildIconClass(option, index)" />
					<SofaHeaderText
						:content="option.toString()"
						color="text-inherit"
						class="capitalize md:!text-lg mdlg:!text-xl text-xs w-full justify-start flex" />
				</div>
			</a>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.writeAnswer">
			<div class="w-full rounded-xl gap-3 border-2" :class="buildClass(answer.value)">
				<SofaTextarea
					v-model="answer.value"
					placeholder="Write your answer here"
					textAreaStyle="focus:outline-none !bg-transparent !text-inherit p-3 placeholder:!text-inherit w-full text-base placeholder:text-base" />
			</div>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.fillInBlanks">
			<div class="w-full flex md:gap-3 gap-2 items-center flex-wrap">
				<template v-for="(content, index) in question.splitQuestions" :key="index">
					<div
						v-if="index !== 0"
						class="min-w-[160px] rounded-xl p-3 flex items-center justify-center border-2"
						:class="buildClass(answer.value[index - 1], index - 1)">
						<input
							v-model="answer.value[index - 1]"
							placeholder="answer here"
							class="w-full focus:outline-none placeholder:md:text-2xl text-inherit bg-transparent placeholder:text-base placeholder:text-inherit md:text-2xl text-base" />
					</div>
					<SofaHeaderText class="!font-semibold md:!text-2xl text-base" color="text-inherit" :content="content" />
				</template>
			</div>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.dragAnswers">
			<div class="w-full flex md:gap-3 gap-2 items-center flex-wrap">
				<template v-for="(content, index) in question.splitQuestions" :key="index">
					<Draggable
						v-if="index !== 0"
						:id="`drag-answer-${index - 1}`"
						:list="answer.drag[index - 1]"
						itemKey=""
						group="dragAnswers"
						:move="move"
						class="md:min-w-[160px] md:!h-[70px] min-w-[140px] h-[48px] rounded-xl md:p-4 px-2 flex items-center justify-center border-2"
						:class="buildClass(answer.drag[index - 1][0], index - 1)">
						<template #item="{ element }">
							<div
								class="md:p-4 p-2 flex items-center cursor-move justify-center touch-none rounded-xl border-2"
								:class="isDark ? 'bg-primaryBlue' : 'bg-lightBlue'">
								<SofaHeaderText class="!font-bold md:!text-2xl text-base" color="text-inherit" :content="element" />
							</div>
						</template>
					</Draggable>
					<SofaHeaderText class="!font-semibold md:!text-2xl text-base" color="text-inherit" :content="content" />
				</template>

				<Draggable
					id="drag-options"
					:list="answer.dragOptions"
					itemKey=""
					group="dragAnswers"
					:move="move"
					class="w-full flex items-center gap-3 pt-6 md:!h-[90px] h-[40px]">
					<template #item="{ element }">
						<div
							class="md:p-4 p-2 flex items-center cursor-move justify-center touch-none rounded-xl border-2"
							:class="isDark ? 'bg-primaryBlue' : 'bg-lightBlue'">
							<SofaHeaderText class="!font-bold md:!text-2xl text-base" color="text-inherit" :content="element" />
						</div>
					</template>
				</Draggable>
			</div>
		</template>

		<template v-if="question.strippedData.type === QuestionTypes.sequence">
			<Draggable v-model="answer.value" group="sequence" class="flex flex-col gap-4 w-full" itemKey="">
				<template #item="{ element, index }">
					<div class="w-full flex items-center gap-3 cursor-move">
						<div class="p-3 rounded-xl border-2" :class="buildClass(element, index)">
							<SofaHeaderText
								:content="(index + 1).toString()"
								color="text-inherit"
								class="md:!text-lg mdlg:!text-xl text-xs w-full justify-start flex" />
						</div>
						<div class="p-3 rounded-xl border-2 flex-grow" :class="buildClass(element, index)">
							<SofaHeaderText
								:content="element"
								color="text-inherit"
								class="'md:!text-lg mdlg:!text-xl text-xs w-full justify-start flex !line-clamp-1" />
						</div>
					</div>
				</template>
			</Draggable>
		</template>

		<div v-if="question.type === QuestionTypes.match" class="w-full grid grid-cols-2 gap-4">
			<Draggable
				:list="question.matchQuestions"
				group="match-questions"
				class="col-span-1 flex flex-col gap-2"
				itemKey=""
				:disabled="true">
				<template #item="{ element, index }">
					<div
						class="w-full flex items-center justify-between rounded-xl flex-grow p-3 border-2 gap-3"
						:class="buildClass(answer.value[index], index)">
						<SofaIcon :name="Logic.Study.getShape(index)" :class="buildIconClass(answer.value[index], index)" />
						<SofaHeaderText
							color="text-inherit"
							class="md:!text-lg mdlg:!text-xl text-xs w-full justify-start flex line-clamp-1"
							:content="element" />
					</div>
				</template>
			</Draggable>

			<Draggable v-model="answer.value" group="match-answers" class="col-span-1 flex flex-col gap-2" itemKey="">
				<template #item="{ element, index }">
					<div
						class="w-full flex items-center justify-between rounded-xl flex-grow p-3 border-2 gap-3 cursor-move"
						:class="buildClass(element, index)">
						<SofaIcon :name="Logic.Study.getShape(index)" :class="buildIconClass(element, index)" />
						<SofaHeaderText
							color="text-inherit"
							class="md:!text-lg mdlg:!text-xl text-xs w-full justify-start flex line-clamp-1"
							:content="element" />
					</div>
				</template>
			</Draggable>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import Draggable from 'vuedraggable'
import { QuestionEntity, QuestionTypes } from '@modules/study'
import { Logic } from 'sofa-logic'

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
	[Logic.Study.getShapeSize(Logic.Study.getShape(args[1] ?? 0))]: true,
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
