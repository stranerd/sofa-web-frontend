<template>
	<slot v-if="quiz && !started" name="prestart" :quiz="quiz" :extras="extras" :questions="quizQuestions" />
	<slot v-else-if="fetched && quiz" :quiz="quiz" :questions="quizQuestions" :extras="extras" />
</template>

<script lang="ts" setup>
import { useQuiz } from '@/composables/study/quizzes'
import { Logic, Question } from 'sofa-logic'
import { PropType, computed, defineProps, reactive, ref, watch } from 'vue'
import QuestionDisplay from './QuestionDisplay.vue'

const props = defineProps({
	id: {
		type: String,
		required: true
	},
	questions: {
		type: Array as PropType<Question[]>,
		required: false,
	},
	showAnswer: {
		type: Boolean,
		required: false,
		default: false
	},
	isAnswerRight: {
		type: Boolean,
		required: false,
		default: false
	},
	useTimer: {
		type: Boolean,
		required: false,
		default: false
	},
})

const { quiz, questions, fetched } = useQuiz(props.id, !!props.questions)
const reorderedQuestions = ref<Question[] | null>(null)
const quizQuestions = computed(() => (reorderedQuestions.value ?? props.questions ?? questions.value ?? []).map(Logic.Study.transformQuestion))

const started = ref(!props.useTimer)
const startCountdown = ref(3)
const index = ref(0)
const answers = reactive<Record<string, any>>({})
const currentQuestion = computed(() => quizQuestions.value.at(index.value))
const answer = computed({
	get: () => currentQuestion.value ? answers[currentQuestion.value.id] ?? currentQuestion.value.defaultAnswer : [],
	set: (val) => {
		answers[currentQuestion.value?.id] = val
	}
})

const optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState'] = (val, index) => {
	const question = currentQuestion.value
	if (!question) return null
	if (props.showAnswer && question.data) {
		if (question.strippedData.type === 'multipleChoice') {
			if (question.data.answers.includes(index)) return 'right'
			if (answer.value.includes(index)) return 'wrong'
		}
		if (question.strippedData.type === 'trueOrFalse') {
			if (question.data.answer === val) return 'right'
			if (answer.value === val) return 'wrong'
		}
		if (question.data.type === 'writeAnswer') return props.isAnswerRight ? 'right' : 'wrong'
		if (['fillInBlanks', 'dragAnswers', 'sequence'].includes(question.data.type)) {
			if (props.isAnswerRight) return 'right'
			return question.data.answers[index] === val ? 'right' : 'wrong'
		}
		if (question.data.type === 'match') {
			if (props.isAnswerRight) return 'right'
			return question.data.set[index]?.a === val ? 'right' : 'wrong'
		}
	}
	if (question.strippedData.type === 'trueOrFalse' && answer.value === val) return 'selected'
	if (question.strippedData.type === 'multipleChoice' && answer.value.includes(index)) return 'selected'
	return null
}

const moveCurrrentQuestionToEnd = () => {
	if (!reorderedQuestions.value) reorderedQuestions.value = [...quizQuestions.value]
	reorderedQuestions.value = reorderedQuestions.value.concat(reorderedQuestions.value.splice(index.value, 1))
}

const extras = computed(() => ({
	get index () {
		return index.value
	},
	set index (v) {
		index.value = v
	},
	get answer () {
		return answer.value
	},
	set answer (v) {
		answer.value = v
	},
	started: started.value,
	startCountdown: startCountdown.value,
	question: currentQuestion.value,
	optionState,
	moveCurrrentQuestionToEnd,
	next: () => {
		if (extras.value.canNext) index.value++
	},
	previous: () => {
		if (extras.value.canPrev) index.value--
	},
	canPrev: index.value > 0,
	canNext: index.value < quizQuestions.value.length - 1,
	reset: () => {
		reorderedQuestions.value = null
	}
}))

watch(quiz, async () => {
	if (!started.value) {
		const timer = setInterval(() => {
			const newValue = startCountdown.value - 1
			if (newValue === 0) {
				started.value = true
				clearInterval(timer)
			}
			startCountdown.value = newValue
		}, 1000)
	}
})
</script>