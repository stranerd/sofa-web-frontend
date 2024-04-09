<template>
	<component :is="as" class="shrink-0 relative" :class="[customClass]" :style="styles">
		<img :src="photoUrl ?? undefined" class="w-full opacity-0" />
		<span class="w-full h-full flex flex-col items-center justify-center absolute top-0 left-0">
			<slot />
		</span>
	</component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		photoUrl?: string | null
		customClass?: string
		as?: string
	}>(),
	{
		photoUrl: null,
		customClass: '',
		as: 'div',
	},
)

const styles = computed(() =>
	[
		'object-fit: contain',
		'background-size: cover',
		'background-repeat: no-repeat',
		'background-position: center',
		'max-width: 100%',
		props.photoUrl ? `background-image: url('${props.photoUrl}')` : '',
	]
		.filter(Boolean)
		.join(';'),
)
</script>
