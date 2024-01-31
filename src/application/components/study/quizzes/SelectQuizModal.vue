<template>
	<div></div>
</template>

<script lang="ts" setup>
import { QuizEntity } from '@modules/study'

const props = defineProps<{
	close: () => void
	onSelected: (quiz: QuizEntity) => void
}>()

const select = (quiz: QuizEntity) => {
	props.onSelected(quiz)
	props.close()
}

select
</script>
