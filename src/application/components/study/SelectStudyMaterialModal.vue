<template>
	<div />
</template>

<script lang="ts" setup>
import { FileEntity, QuizEntity, QuizModes } from '@modules/study'

const props = defineProps<{
	close: () => void
	onSelected: (selected: { file: FileEntity } | { quiz: QuizEntity; mode: QuizModes }) => void
}>()

const select = (selected: { file: FileEntity } | { quiz: QuizEntity; mode: QuizModes }) => {
	props.onSelected(selected)
	props.close()
}

select
</script>
