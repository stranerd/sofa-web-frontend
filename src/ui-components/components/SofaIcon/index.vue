<template>
	<InlineSvg :src="`/images/icons/${name}.svg`" class="cursor-pointer shrink-0" :class="customClass" />
</template>

<script lang="ts">
import InlineSvg from 'vue-inline-svg'
export default {
	name: 'RoofIcon',
	components: { InlineSvg },
	props: {
		name: {
			type: String,
			required: true,
		},
		customClass: {
			type: String,
			required: false,
			default: '',
		},
	},
}
</script>

<style>
svg {
	width: auto;
	height: auto;
}
</style>
