<template>
	<InlineSvg :src="`/images/icons/${name}.svg`" class="cursor-pointer" :class="customClass" />
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
