<template>
	<div :class="`w-full flex flex-col gap-3 justify-center items-center py-9 px-6 rounded-custom bg-primaryPurple ${customClass}`">
		<SofaIcon :customClass="icon ? icon.size : 'h-[28px]'" :name="icon ? icon.name : 'attention-white'" />
		<div class="w-full flex flex-col gap-2 justify-center items-center py-2">
			<SofaHeaderText color="text-white" :content="title" :customClass="`!font-semibold ${titleStyle}`" />
			<SofaNormalText
				color="text-white"
				:content="subTitle"
				customClass="w-full flex !font-lighter flex-row items-center text-center justify-center " />
		</div>
		<SofaButton
			v-if="action"
			customClass="!whitespace-nowrap"
			bgColor="bg-white"
			padding="py-1 px-4"
			textColor="text-deepGray !font-semibold"
			@click="action ? action() : null">
			{{ actionLabel }}
		</SofaButton>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SofaButton from '../SofaButton'
import SofaIcon from '../SofaIcon'
import { SofaHeaderText, SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaEmptyState',
	components: {
		SofaIcon,
		SofaButton,
		SofaNormalText,
		SofaHeaderText,
	},
	props: {
		customClass: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		titleStyle: {
			type: String,
			default: '',
		},
		subTitle: {
			type: String,
			default: '',
		},
		action: {
			type: Function,
			default: null,
		},
		actionLabel: {
			type: String,
			default: '',
		},
		icon: {
			type: Object as () => {
				name: IconName
				size: string
			},
			default: null,
		},
	},
})
</script>
