<template>
	<Text v-bind="props" :as="as">
		<slot />
	</Text>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Text from './text.vue'

const props = withDefaults(
	defineProps<{
		size?: InstanceType<typeof Text>['$props']['size']
		content?: InstanceType<typeof Text>['$props']['content']
		as?: InstanceType<typeof Text>['$props']['as']
		bold?: InstanceType<typeof Text>['$props']['bold']
		clamp?: InstanceType<typeof Text>['$props']['clamp']
	}>(),
	{
		size: undefined,
		content: undefined,
		as: undefined,
		bold: true,
		clamp: true,
	},
)

const as = computed(() =>
	props.as
		? props.as
		: props.size === 'title3'
			? 'h1'
			: props.size === 'title2'
				? 'h2'
				: props.size === 'title'
					? 'h3'
					: props.size === 'mid'
						? 'h4'
						: undefined,
)
</script>
