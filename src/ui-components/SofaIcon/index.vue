<template>
	<InlineSvg :src="`/images/icons/${name}.svg`" class="cursor-pointer shrink-0" />
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg'

defineProps<{
	name: IconName
}>()
</script>

<style>
svg {
	width: auto;
	height: auto;
}
</style>
