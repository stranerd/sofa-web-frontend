<template>
	<Text v-bind="props">
		<slot />
	</Text>
</template>

<script lang="ts" setup>
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
		as: 'h2',
		bold: true,
		clamp: true,
	},
)
</script>
