<template>
	<a v-if="type === 'switch'" class="rounded-custom p-4 bg-lightGray flex items-center" @click="selected = !selected">
		<span>
			<slot />
		</span>
		<SofaIcon customClass="h-[1.5em]" :name="selected ? 'toggle-on' : 'toggle-off'" />
	</a>
	<a v-else class="flex gap-2 items-center" @click="selected = !selected">
		<SofaIcon :name="`${selected ? 'checkbox-active' : 'checkbox'}`" customClass="md:!h-[18px] h-[20px] w-[25px]" />
		<span class="flex gap-2 items-center lg:text-sm mdlg:text-[12px] text-xs">
			<slot />
		</span>
	</a>
</template>
<script lang="ts" setup>
import SofaIcon from '../SofaIcon/index.vue'

withDefaults(
	defineProps<{
		type?: 'checkbox' | 'switch'
	}>(),
	{
		type: 'checkbox',
	},
)

const selected = defineModel<boolean>({ default: false })
</script>
