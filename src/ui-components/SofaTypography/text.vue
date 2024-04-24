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
		size?: 'title' | 'base' | 'sub'
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
		props.size === 'title' ? 'text-[18px] mdlg:text-[20px]' : '',
		props.size === 'base' ? 'text-[14px] mdlg:text-[16px]' : '',
		props.size === 'sub' ? 'text-[12px] mdlg:text-[14px]' : '',
		props.bold ? 'font-semibold' : '',
		props.clamp ? 'line-clamp-1' : '',
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
	}
}
</style>
