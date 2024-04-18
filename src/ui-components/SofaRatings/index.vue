<template>
	<a class="flex items-center gap-1">
		<SofaIcon
			v-for="i in 5"
			:key="i"
			name="star"
			:class="{ [size]: true, 'fill-primaryYellow': model >= i, 'fill-grayColor': model < i }"
			@click="!readonly && (model = i)" />
	</a>
</template>

<script lang="ts" setup>
import SofaIcon from '../SofaIcon'

withDefaults(
	defineProps<{
		count?: number
		readonly?: boolean
		size?: string
	}>(),
	{
		count: 5,
		readonly: true,
		size: 'h-[13px] mdlg:!h-[17px]',
	},
)

const model = defineModel<number>({ default: 1 })
</script>
