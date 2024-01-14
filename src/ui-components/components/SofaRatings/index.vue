<template>
	<a class="flex items-center gap-1">
		<SofaIcon v-for="i in 5" :key="i" :name="model >= i ? 'star-full' : 'star'" :class="size" @click="!readonly && (model = i)" />
	</a>
</template>

<script lang="ts" setup>
import SofaIcon from '../SofaIcon'

withDefaults(
	defineProps<{
		count?: number
		customClass?: string
		readonly?: boolean
		size?: string
	}>(),
	{
		count: 5,
		customClass: '',
		readonly: true,
		size: 'h-[13px] mdlg:!h-[17px]',
	},
)

const model = defineModel<number>({ default: 1 })
</script>
