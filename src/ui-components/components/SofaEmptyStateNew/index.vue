<template>
	<div class="flex flex-col items-center justify-center text-center gap-6">
		<SofaImageLoader :photoUrl="imageUrl" customClass="!w-[227px] min-h-[184px]" />
		<div class="flex flex-col gap-2">
			<SofaHeaderText>{{ title }}</SofaHeaderText>
			<ul :class="contents.length > 1 ? 'list-disc' : 'list-none'" class="flex flex-col items-center justify-center gap-1">
				<li v-for="(content, index) in contents" :key="index">
					<SofaNormalText color="text-grayColor">{{ content }}</SofaNormalText>
				</li>
			</ul>
		</div>
		<div class="flex items-center gap-[10px]">
			<SofaButton v-if="firstButton.label" customClass="!rounded-lg h-[50px] px-6" @click="firstButton.action">{{
				firstButton.label
			}}</SofaButton>
			<SofaButton
				v-if="secondButton.label"
				customClass="!rounded-lg h-[50px] bg-white border border-primaryBlue !text-primaryBlue px-6"
				@click="secondButton.action">
				{{ secondButton.label }}
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SofaButton from '../SofaButton'
import { SofaHeaderText, SofaNormalText } from '../SofaTypography'
import SofaImageLoader from '../SofaImageLoader'
export default defineComponent({
	name: 'SofaEmptyStateNew',
	components: {
		SofaButton,
		SofaHeaderText,
		SofaNormalText,
		SofaImageLoader,
	},
	props: {
		customClass: {
			type: String,
			default: '',
		},
		imageUrl: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		contents: {
			type: Array,
			default: () => [],
		},
		firstButton: {
			type: Object as () => {
				label: string
				action: () => void
			},
			default: () => ({
				label: '',
				action: () => {},
			}),
		},
		secondButton: {
			type: Object as () => {
				label: string
				action: () => void
			},
			default: () => ({
				label: '',
				action: () => {},
			}),
		},
	},
})
</script>
