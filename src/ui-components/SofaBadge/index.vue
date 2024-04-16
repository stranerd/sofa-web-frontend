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
<script lang="ts" setup>
withDefaults(
	defineProps<{
		color?: 'purple' | 'green' | 'blue' | 'orange' | 'gray' | 'pink'
		customClass?: string
		isInverted?: boolean
		as?: string
	}>(),
	{
		color: 'purple',
		customClass: '',
		isInverted: false,
		as: 'span',
	},
)
</script>
