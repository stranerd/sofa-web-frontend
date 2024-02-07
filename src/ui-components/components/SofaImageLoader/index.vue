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
		customStyle?: string
		as?: string
	}>(),
	{
		photoUrl: undefined,
		customClass: '',
		customStyle: '',
		as: 'div',
	},
)

const styles = computed(() =>
	[
		'background-size: cover',
		'background-repeat: no-repeat',
		'background-position: center',
		props.photoUrl ? `background-image: url('${props.photoUrl}')` : '',
		props.customStyle,
	]
		.filter(Boolean)
		.join(';'),
)
</script>
