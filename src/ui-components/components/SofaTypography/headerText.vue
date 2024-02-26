<template>
	<component :is="as" v-if="content" :class="cls" v-html="content" />
	<component :is="as" v-else :class="cls">
		<slot />
	</component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'RoofHeaderText',
	props: {
		size: {
			type: String,
			default: 'lg',
		},
		color: {
			type: String,
			default: 'text-darkBody',
		},
		customClass: {
			type: String,
			default: '',
		},
		content: {
			type: String,
			default: '',
		},
		as: {
			type: String,
			default: 'h3',
		},
	},
	setup(props) {
		const cls = computed(() =>
			[
				'font-semibold flex flex-col',
				props.content ? 'body' : '',
				props.size == 'xl' ? 'lg:text-3xl mdlg:text-xl text-lg' : '',
				props.size == 'lg' ? 'lg:text-xl mdlg:text-lg text-base' : '',
				props.size == 'base' ? 'lg:text-base mdlg:text-[13px] text-sm' : '',
				props.size == 'xs' ? 'mdlg:!text-[12px] text-xs' : '',
				props.customClass,
				props.color,
			].join(' '),
		)
		return { cls }
	},
})
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
