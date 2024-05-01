<template>
	<span class="flex items-center gap-1">
		<img src="/images/logo.svg" class="h-full" />
		<img v-if="!withoutText" src="/images/logo-text.svg" class="h-1/2" />
	</span>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		withoutText?: boolean
	}>(),
	{
		withoutText: false,
	},
)
</script>
