<template>
	<slot v-if="fetched && test" :test="test" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useTest } from '@/composables/plays/tests'
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
	id: {
		type: String,
		required: true
	},
	skipQuestions: {
		type: Boolean,
		required: false,
		default: false
	},
	skipStatusNav: {
		type: Boolean,
		required: false,
		default: false
	}
})

const router = useRouter()
const {
	test, questions, fetched, answer,
	start, end, submitAnswer
} = useTest(props.id, { questions: props.skipQuestions, statusNav: props.skipStatusNav })
const { id } = useAuth()

const extras = computed(() => ({
	isMine: test.value && test.value.userId === id.value,
	authId: id.value,
	answers: answer.value?.data ?? null,
	start, end,
	submit: async (data?: { questionId: string, answer: any }) => {
		if (data) return await submitAnswer(data)
		await router.push(`/tests/${id}/results`)
		return true
	},
}))
</script>