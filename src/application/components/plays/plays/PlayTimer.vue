<template>
	<div v-for="i in Array.from({ length }, (_, i) => i)" :key="i" class="w-full flex">
		<div
			class="h-2 bg-primaryGreen"
			:class="{
				'w-full rounded-full': i < current || (i === current && fractionTimeLeft === 1),
				'w-0': i > current,
				'rounded-l-full': i === current,
			}"
			:style="i === current ? `width: ${fractionTimeLeft * 100}%;` : ''" />
		<div
			class="h-2 bg-darkLightGray"
			:class="{
				'w-full rounded-full': i > current || (i === current && fractionTimeLeft === 0),
				'w-0': i < current,
				'rounded-r-full': i === current,
			}"
			:style="i === current ? `width: ${(1 - fractionTimeLeft) * 100}%;` : ''" />
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	length: number
	current: number
	fractionTimeLeft: number
}>()
</script>
