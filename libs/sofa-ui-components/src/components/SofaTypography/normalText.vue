<template>
	<span v-if="content" :class="cls" v-html="content" />
	<span v-else :class="cls">
		<slot />
	</span>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
export default defineComponent({
	props: {
		size: {
			type: String,
			default: "base",
		},
		color: {
			type: String,
			default: "text-bodyBlack",
		},
		customClass: {
			type: String,
			default: "",
		},
		isHtml: {
			type: Boolean,
			default: false,
		},
		content: {
			type: String,
			default: "",
		},
	},
	name: "RoofNormalText",
	setup (props) {
		const cls = computed(() => [
			props.content ? 'body' : '', props.customClass, props.color,
			props.size == 'base' ? 'lg:text-sm mdlg:text-[12px] text-xs' : '',
			props.size == 'small' ? ' text-xs' : ''
		].join(' '))
		return { cls }
	}
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