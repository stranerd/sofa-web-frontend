<template>
	<InlineSvg :src="`/images/icons/${name}.svg`" class="cursor-pointer" :class="customClass" :fill="fill" />
</template>

<script lang="ts">
import InlineSvg from 'vue-inline-svg'
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
		customClass: {
			type: String,
			required: false,
		},
		fill: {
			type: String,
			default: '',
			required: false,
		},
	},
	components: { InlineSvg },
	name: 'RoofIcon',
}
</script>

<style>
svg {
	width: auto;
	height: auto;
}
</style>
