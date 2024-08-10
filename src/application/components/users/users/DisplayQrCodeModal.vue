<template>
	<div class="flex w-full h-full items-center justify-center p-8">
		<Qrcode :value="value" :size="size" />
	</div>
</template>

<script lang="ts" setup>
import Qrcode from 'qrcode.vue'

withDefaults(
	defineProps<{
		close: () => void
		value: string
		size?: number
	}>(),
	{
		size: 150,
	},
)
</script>
