<template>
	<component
		:is="as"
		class="px-3 py-1 lg:text-sm mdlg:text-[12px] text-xs rounded-custom"
		:class="{
			[customClass]: true,
			'bg-primaryPurple text-white': color === 'purple',
			'text-primaryPurple bg-opacity-25': color === 'purple' && isInverted,
			'bg-primaryGreen text-white': color === 'green',
			'text-primaryGreen bg-opacity-25': color === 'green' && isInverted,
			'bg-primaryBlue text-white': color === 'blue',
			'text-primaryBlue bg-opacity-25': color === 'blue' && isInverted,
			'bg-primaryOrange text-white': color === 'orange',
			'text-primaryOrange bg-opacity-25': color === 'orange' && isInverted,
			'bg-lightGray text-grayColor': color === 'gray',
			'text-bodyBlack bg-opacity-75': color === 'gray' && isInverted,
			'bg-primaryPink text-white': color === 'pink',
			'text-primaryPink bg-opacity-25': color === 'pink' && isInverted,
		}">
		<slot />
	</component>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	props: {
		color: {
			type: String,
			default: 'purple',
		},
		customClass: {
			type: String,
			default: '',
		},
		isInverted: {
			type: Boolean,
			default: false,
		},
		as: {
			type: String,
			required: false,
			default: 'span',
		},
	},
	name: 'SofaBadge',
})
</script>
