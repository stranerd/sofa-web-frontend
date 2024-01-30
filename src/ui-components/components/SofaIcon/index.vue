<template>
	<InlineSvg :src="`/images/icons/${name}.svg`" class="cursor-pointer shrink-0" :class="customClass" />
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg'

withDefaults(
	defineProps<{
		name: IconName
		customClass?: string
	}>(),
	{
		customClass: '',
	},
)
</script>

<style>
svg {
	width: auto;
	height: auto;
}
</style>
