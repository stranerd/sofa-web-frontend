<template>
	<div :class="`col-span-1 flex gap-3 p-3 rounded-custom bg-white ${customClass}`">
		<div class="w-[110px] flex flex-col">
			<SofaImageLoader custom-class="w-[110px] h-[78px] mdlg:h-[80px] rounded-custom relative" :photo-url="content.image">
			</SofaImageLoader>
		</div>
		<div class="flex flex-col w-full gap-2">
			<div class="w-full flex items-center justify-between">
				<SofaNormalText :custom-class="'!font-bold !line-clamp-1'">
					{{ content.title }}
				</SofaNormalText>
			</div>
			<div class="w-full flex flex-row items-center gap-3">
				<SofaNormalText :color="'text-grayColor'" custom-class="capitalize">
					{{ content.type }}
				</SofaNormalText>
			</div>

			<div class="w-full flex items-center justify-between">
				<SofaNormalText :color="content.label_color" :custom-class="'font-semibold'">
					{{ content.label }}
				</SofaNormalText>
				<div v-if="content.type == 'game'" class="flex flex-row items-center gap-2">
					<SofaNormalText :color="'text-grayColor'">
						{{ content.participants }}
					</SofaNormalText>
					<SofaIcon :name="'participant'" :custom-class="'h-[15px]'" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import { SofaNormalText } from '../SofaTypography'

withDefaults(
	defineProps<{
		customClass?: string
		content: {
			image: string
			title: string
			type: string
			label: string
			label_color: string
			participants: number
		}
	}>(),
	{
		customClass: '',
	},
)
</script>
