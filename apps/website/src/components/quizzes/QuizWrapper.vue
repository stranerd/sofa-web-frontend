<template>
	<slot v-if="quiz" :quiz="quiz" :questions="quizQuestions" :extras="extras" />
</template>

<script lang="ts" setup>
import { Logic, Question, Quiz } from 'sofa-logic'
import { PropType, defineProps, onMounted, reactive, ref } from 'vue'

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
const quizQuestions = ref(props.questions ?? [])
const extras = reactive({ index: 0 })

onMounted(async () => {
	quiz.value = await Logic.Study.GetQuiz(props.id).catch(() => null) as any
	if (!props.questions) {
		const questions = await Logic.Study.GetQuestions(props.id, { all: true }).catch(() => null)
		quizQuestions.value = questions?.results ?? []
	}
})
</script>