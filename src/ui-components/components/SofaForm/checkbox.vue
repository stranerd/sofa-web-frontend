<template>
	<a v-if="type === 'switch'" class="flex items-center gap-2">
		<span @click="toggle">
			<slot />
		</span>
		<SofaIcon customClass="h-[1.5em]" :name="selected ? 'toggle-on' : 'toggle-off'" @click="toggle" />
	</a>
	<a v-else class="flex gap-2 items-center">
		<SofaIcon :name="`${selected ? 'checkbox-active' : 'checkbox'}`" customClass="md:!h-[18px] h-[20px] w-[25px]" @click="toggle" />
		<span class="flex gap-2 items-center lg:text-sm mdlg:text-[12px] text-xs" @click="toggle">
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

const toggle = () => {
	selected.value = !selected.value
}
</script>
