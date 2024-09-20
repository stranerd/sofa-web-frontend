<template>
	<component
		:is="as"
		class="px-3 py-1.5 font-size-sub rounded-lg"
		:class="{
			'bg-primaryPurple text-white': color === 'purple' && !inverted,
			'text-primaryPurple bg-opacity-25': color === 'purple' && inverted,
			'bg-primaryRed text-white': color === 'red' && !inverted,
			'text-primaryRed bg-opacity-25': color === 'red' && inverted,
			'bg-primaryGreen text-white': color === 'green' && !inverted,
			'text-primaryGreen bg-opacity-25': color === 'green' && inverted,
			'bg-primaryBlue text-white': color === 'blue' && !inverted,
			'text-primaryBlue bg-opacity-25': color === 'blue' && inverted,
			'bg-primaryOrange text-white': color === 'orange' && !inverted,
			'text-primaryOrange bg-opacity-25': color === 'orange' && inverted,
			'bg-lightGray text-grayColor': color === 'gray' && !inverted,
			'text-grayColor bg-opacity-75 border border-darkLightGray': color === 'gray' && inverted,
			'bg-primaryPink text-white': color === 'pink' && !inverted,
			'text-primaryPink bg-opacity-25': color === 'pink' && inverted,
		}">
		<slot />
	</component>
</template>
<script lang="ts" setup>
withDefaults(
	defineProps<{
		color?: 'purple' | 'green' | 'blue' | 'orange' | 'gray' | 'pink' | 'red'
		inverted?: boolean
		as?: string
	}>(),
	{
		color: 'purple',
		inverted: false,
		as: 'span',
	},
)
</script>
