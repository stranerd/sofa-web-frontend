<template>
	<slot v-if="fetched && test" :test="test" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { useTest } from '@app/composables/plays/tests'
import { computed, defineProps } from 'vue'

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	skipQuestions: {
		type: Boolean,
		required: false,
		default: false,
	},
	skipStatusNav: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const { test, questions, fetched, answer, start, end, submitAnswer } = useTest(props.id, {
	questions: props.skipQuestions,
	statusNav: props.skipStatusNav,
})
const { id: authId, user } = useAuth()

const extras = computed(() => ({
	isMine: test.value && test.value.userId === authId.value,
	canEnd: test.value && test.value.userId === authId.value && test.value.status === 'started',
	authId: authId.value,
	answers: answer.value?.data ?? null,
	start,
	end,
	submit: async (data?: { questionId: string; answer: any }) => {
		if (data) return await submitAnswer(data)
		return await end()
	},
	get scores() {
		return Object.entries(test.value.scores ?? {})
			.sort((a, b) => b[1] - a[1])
			.map((res, i, orgArr) => ({
				score: res[1],
				percent: (res[1] / test.value.questions.length) * 10,
				position: orgArr[i - 1]?.[1] === res[1] ? '' : (i + 1).toString(),
				user: user.value,
				isWinner: orgArr[0]?.[1] === res[1],
				get label() {
					if (this.percent === 100) return 'Perfect!'
					if (this.percent >= 90) return 'Outstanding!'
					if (this.percent >= 80) return 'Excellent Work!'
					if (this.percent >= 70) return 'Good job!'
					if (this.percent >= 60) return 'Nice effort!'
					return 'Study harder!'
				},
				get color() {
					if (this.percent >= 80) return 'text-[#4BAF7D]'
					if (this.percent >= 70) return 'text-[#ADAF4B]'
					if (this.percent >= 60) return 'text-[#FA9632]'
					return 'text-[#F55F5F]'
				},
				get bgColor() {
					return this.color.split('[')[1].split(']')[0]
				},
			}))
	},
}))
</script>
