<template>
	<Text v-bind="props">
		<slot />
	</Text>
</template>

<script lang="ts" setup>
import Text from './text.vue'

const props = withDefaults(
	defineProps<{
		size?: 'title' | 'base' | 'sub'
		content?: string
		as?: string
		bold?: boolean
		clamp?: boolean
	}>(),
	{
		size: undefined,
		content: undefined,
		as: 'h2',
		bold: true,
		clamp: true,
	},
)
</script>
