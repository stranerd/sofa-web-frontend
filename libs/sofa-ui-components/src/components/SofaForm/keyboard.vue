<template>
	<div class="flex w-full flex-col gap-2 px-3">
		<div class="w-full grid grid-cols-12 gap-6">
			<div class="col-span-4 flex flex-row items-center justify-center"
				v-for="(key, index) in Array.from(Array(9).keys())" :key="index">
				<span @click="content += `${key + 1}`"
					class="w-[43px] h-[43px] rounded-full border border-transparent hover:bg-gray-50 flex flex-row items-center justify-center">
					<sofa-normal-text customClass="!text-lg">
						{{ key + 1 }}
					</sofa-normal-text>
				</span>
			</div>
			<div class="col-span-4 flex flex-row items-center justify-center">
				<span
					class="w-[43px] h-[43px] rounded-full border border-transparent hover:bg-gray-50 flex flex-row items-center justify-center">
					<sofa-icon :name="'fingerprint'" :customClass="'h-[30px]'" v-if="hasFingerPrint" />
				</span>
			</div>
			<div class="col-span-4 flex flex-row items-center justify-center">
				<span @click="content += `0`"
					class="w-[43px] h-[43px] rounded-full border border-transparent hover:bg-gray-50 flex flex-row items-center justify-center">
					<sofa-normal-text customClass="!text-lg"> 0 </sofa-normal-text>
				</span>
			</div>
			<div class="col-span-4 flex flex-row items-center justify-center">
				<span @click="content = `${content.slice(0, -1)}`"
					class="w-[43px] h-[43px] rounded-full border border-transparent hover:bg-gray-50 flex flex-row items-center justify-center">
					<sofa-icon :name="'chevron-left-gray'" :customClass="'h-[15px]'" />
				</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { ref, watch } from 'vue'
import SofaIcon from '../SofaIcon'
import SofaNormalText from '../SofaTypography/normalText.vue'

export default {
	components: {
		SofaNormalText,
		SofaIcon,
	},
	props: {
		padding: {
			type: String,
			default: 'py-3 px-3',
		},
		placeholder: {
			type: String,
			default: '',
		},
		customClass: {
			type: String,
			default: '',
		},
		hasTitle: {
			type: Boolean,
			default: false,
		},
		hasFingerPrint: {
			type: Boolean,
			default: true,
		},
		modelValue: {
			required: false,
		},
	},
	name: 'SofaKeyboard',
	emits: ['update:modelValue'],
	setup (props: any, context: any) {
		const content = ref('')

		watch(content, () => {
			context.emit('update:modelValue', content.value)
		})

		watch(props, () => {
			if (props.modelValue == '') {
				content.value = ''
			}
		})

		const isFocused = ref(false)

		const tabIndex = Math.random()

		return {
			content,
			tabIndex,
			isFocused,
		}
	},
}
</script>
