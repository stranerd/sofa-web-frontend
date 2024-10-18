<template>
	<a v-if="type === 'switch'" class="flex items-center gap-2" :class="{ 'flex-row-reverse justify-between': rotate }">
		<span class="font-size-sub" @click="toggle">
			<slot />
		</span>
		<SofaIcon class="h-[1.5em]" :name="isSelected ? 'toggle-on' : 'toggle-off'" @click="toggle" />
	</a>
	<a v-else class="flex items-center gap-2" :class="{ 'flex-row-reverse justify-between': rotate }">
		<SofaIcon
			:name="isSelected ? 'checkbox-active' : 'checkbox'"
			class="md:!h-[18px] h-[20px] w-[25px]"
			:class="{ [activeColor]: isSelected }"
			@click="toggle" />
		<span class="flex gap-2 items-center font-size-sub" @click="toggle">
			<slot />
		</span>
	</a>
</template>
<script lang="ts" setup generic="T = boolean">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		type?: 'checkbox' | 'switch'
		value?: T
		rotate?: boolean
		activeColor?: string
	}>(),
	{
		type: 'checkbox',
		value: undefined,
		rotate: false,
		activeColor: 'fill-primaryGreen',
	},
)

const selected = defineModel<T[] | boolean>()

const isSelected = computed(() => {
	if ('value' in props && Array.isArray(selected.value)) return selected.value.includes(props.value!)
	return selected.value
})

const toggle = () => {
	if ('value' in props && Array.isArray(selected.value)) {
		const index = selected.value.indexOf(props.value!)
		if (index === -1) selected.value = selected.value.concat(props.value!)
		else selected.value = selected.value.filter((v) => v !== props.value)
	} else selected.value = !selected.value
}
</script>
