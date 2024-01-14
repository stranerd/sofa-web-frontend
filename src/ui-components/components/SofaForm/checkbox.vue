<template>
	<div :class="`flex w-full flex-col gap-2 ${customClass}`">
		<div class="flex w-full flex-row gap-2 items-center cursor-pointer" @click="selected ? (selected = false) : (selected = true)">
			<span :class="`${iconWidth}`">
				<sofa-icon :name="`${selected ? 'checkbox-active' : 'checkbox'}`" :custom-class="`md:!h-[18px] h-[20px]`" />
			</span>
			<div class="flex gap-2 items-center lg:text-sm mdlg:text-[12px] text-xs">
				<slot />
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from 'vue'
import SofaIcon from '../SofaIcon/index.vue'

export default defineComponent({
	name: 'SofaCheckbox',
	components: { SofaIcon },
	props: {
		extraData: {
			type: Object as () => any,
			default: () => ({}),
		},
		defaultValue: {
			type: Boolean,
			default: false,
		},
		customClass: {
			type: String,
			default: '',
		},
		iconWidth: {
			type: String,
			default: 'w-[25px]',
		},
	},
	emits: ['update:modelValue', 'onSelected'],
	setup(prop, context) {
		const selected = ref(false)

		watch(selected, () => {
			context.emit('update:modelValue', selected.value)
			context.emit('onSelected', prop.extraData)
		})

		const defaultValueRef = toRef(prop, 'defaultValue')

		watch(defaultValueRef, () => {
			selected.value = defaultValueRef.value
		})

		onMounted(() => {
			selected.value = prop.defaultValue
		})

		return {
			selected,
		}
	},
})
</script>
