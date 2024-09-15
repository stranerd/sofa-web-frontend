<template>
	<component :is="as" v-if="content" :class="cls" v-html="content" />
	<component :is="as" v-else :class="cls">
		<slot />
	</component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		size?: 'title' | 'title2' | 'mid' | 'base' | 'sub'
		content?: string
		as?: string
		bold?: boolean
		clamp?: boolean
	}>(),
	{
		size: 'base',
		content: '',
		as: 'span',
		bold: false,
		clamp: false,
	},
)

const cls = computed(() =>
	[
		props.content ? 'body flex flex-col items-start' : '',
		`text-${props.size}`,
		props.bold ? 'font-bold' : '',
		props.clamp ? 'truncate' : '',
	]
		.filter(Boolean)
		.join(' '),
)
</script>

<style lang="scss" scoped>
.body {
	font-family: inherit;
	word-wrap: break-word;
	word-break: break-word;
	overflow-wrap: break-word;

	p {
		margin-bottom: 0.25rem;
	}

	& > p:last-child {
		margin-bottom: 0;
	}

	* {
		word-wrap: break-word;
		word-break: break-word;
		overflow-wrap: break-word;
		background-color: unset !important;
		color: unset !important;
	}
}
</style>
