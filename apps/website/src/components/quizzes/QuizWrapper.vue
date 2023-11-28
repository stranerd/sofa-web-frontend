<template>
	<slot v-if="quiz" :quiz="quiz" :questions="quizQuestions" :extras="extras" />
</template>

<script lang="ts" setup>
import { Logic, Question, Quiz } from 'sofa-logic'
import { PropType, computed, defineProps, onMounted, reactive, ref } from 'vue'

const props = defineProps({
	id: {
		type: String,
		required: true
	},
	questions: {
		type: Array as PropType<Question[]>,
		required: false,
	}
})

const quiz = ref<Quiz | null>(null)
const quizQuestions = ref(props.questions?.map(Logic.Study.transformQuestion) ?? [])
const index = ref(0)
const answers = reactive<Record<string, any>>({})
const currentQuestion = computed(() => quizQuestions.value.at(index.value))
const answer = computed({
	get: () => currentQuestion.value ? answers[currentQuestion.value.id] ?? currentQuestion.value.defaultAnswer : [],
	set: (val) => {
		answers[currentQuestion.value?.id] = val
	}
})

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
	currentQuestion: currentQuestion.value
}))

onMounted(async () => {
	quiz.value = await Logic.Study.GetQuiz(props.id).catch(() => null) as any
	if (!props.questions) {
		const questions = await Logic.Study.GetQuestions(props.id, { all: true }).catch(() => null)
		quizQuestions.value = questions?.results.map(Logic.Study.transformQuestion) ?? []
	}
})
</script>