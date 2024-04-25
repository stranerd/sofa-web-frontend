<template>
	<button
		:disabled="loading || disabled"
		class="focus:outline-none disabled:opacity-75 relative rounded-custom flex gap-2 font-bold items-center text-[12px] mdlg:text-[14px] justify-center whitespace-nowrap"
		:class="{
			'shadow-button': shadow,
			[padding]: true,
			[bgColor]: true,
			[textColor]: true,
			[customClass]: true,
		}">
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SofaButton',
	props: {
		bgColor: {
			type: String,
			default: 'bg-primaryBlue',
		},
		textColor: {
			type: String,
			default: 'text-white',
		},
		customClass: {
			type: String,
			default: '',
		},
		padding: {
			type: String,
			default: 'py-1 px-3',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		shadow: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
})
</script>

<style scoped>
.shadow-button {
	box-shadow: 0 1px #999;
}

.shadow-button:active {
	transform: translateY(1px);
	box-shadow: none;
}
</style>
