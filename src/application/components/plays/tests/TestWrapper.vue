<template>
	<slot v-if="fetched && test" :test="test" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { usePlay } from '@app/composables/plays/plays'

const props = withDefaults(
	defineProps<{
		id: string
		skipQuestions?: boolean
		skipStatusNav?: boolean
	}>(),
	{
		skipQuestions: false,
		skipStatusNav: false,
	},
)

const {
	play: test,
	questions,
	fetched,
	answer,
	start,
	end,
	submitAnswer,
} = usePlay(props.id, {
	questions: props.skipQuestions,
	statusNav: props.skipStatusNav,
	participants: true,
})
const { id: authId, user } = useAuth()
const extras = computed(() => ({
	isMine: test.value && test.value.user.id === authId.value,
	canEnd: test.value && test.value.user.id === authId.value && test.value.status === 'started',
	authId: authId.value,
	answers: answer.value?.data ?? null,
	start,
	end,
	submit: async (data?: { questionId: string; answer: any }) => {
		if (data) return await submitAnswer(data)
		return await end()
	},
	get scores() {
		const t = test.value
		if (!t) return []
		return t.scores.map((res, i, scores) => ({
			score: res.value,
			percent: test.value?.getPercentage(res.userId) ?? 0,
			position: scores[i - 1]?.value === res.value ? '' : (i + 1).toString(),
			user: user.value,
			isWinner: scores[0]?.value === res.value,
			get label() {
				return test.value?.getResultLabel(authId.value) ?? ''
			},
			get color() {
				return test.value?.getLabelColor(authId.value) ?? ''
			},
			get bgColor() {
				return this.color.split(']')[0].split('[')[1]
			},
		}))
	},
}))
</script>
