<template>
	<component :is="as" :class="[customClass]" :style="styles">
		<slot />
	</component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		photoUrl?: string
		customClass?: string
		as?: string
	}>(),
	{
		photoUrl: undefined,
		customClass: '',
		as: 'div',
	},
)

const styles = computed(() =>
	[
		'background-size: cover',
		'background-repeat: no-repeat',
		'background-position: center',
		props.photoUrl ? `background-image: url('${props.photoUrl}')` : '',
	]
		.filter(Boolean)
		.join(';'),
)
</script>
