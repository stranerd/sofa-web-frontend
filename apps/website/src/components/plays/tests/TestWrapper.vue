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
const { id, user } = useAuth()

const extras = computed(() => ({
	isMine: test.value && test.value.userId === id.value,
	authId: id.value,
	answers: answer.value?.data ?? null,
	start, end,
	submit: async (data?: { questionId: string, answer: any }) => {
		if (data) return await submitAnswer(data)
		await router.push(`/tests/${props.id}/results`)
		return true
	},
	get scores () {
		return Object.entries(test.value.scores ?? {})
			.sort((a, b) => b[1] - a[1])
			.map((res, i, orgArr) => ({
				score: res[1],
				position: orgArr[i - 1]?.[1] === res[1] ? '' : (i + 1).toString(),
				user: user.value,
				isWinner: orgArr[0]?.[1] === res[1],
			}))
	},
}))
</script>