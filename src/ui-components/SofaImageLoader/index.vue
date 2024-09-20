<template>
	<component :is="as" class="shrink-0 relative" :style="styles">
		<img v-if="photoUrl" :src="photoUrl" class="w-full invisible" :style="aspect ? `aspect-ratio: ${aspect}` : undefined" />
		<span class="w-full h-full flex flex-col items-center justify-center" :class="{ 'absolute top-0 left-0': photoUrl }">
			<slot />
		</span>
	</component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		photoUrl?: string | null
		aspect?: string
		as?: string
	}>(),
	{
		photoUrl: null,
		aspect: undefined,
		as: 'div',
	},
)

const styles = computed(() =>
	[
		'object-fit: contain',
		'background-size: cover',
		'background-repeat: no-repeat',
		'background-position: center',
		props.photoUrl ? `background-image: url('${props.photoUrl}')` : '',
	]
		.filter(Boolean)
		.join(';'),
)
</script>
