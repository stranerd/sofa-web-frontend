<template>
	<div v-if="data" class="flex flex-col gap-3 h-full w-full px-4">
		<sofa-image-loader
			:custom-class="'w-full rounded-custom h-[200px]'"
			:photo-url="data.photo ? data.photo.link : '/images/default.png'" />

		<sofa-normal-text :custom-class="'text-left font-bold'">
			{{ data.title }}
		</sofa-normal-text>

		<div class="w-full flex items-center gap-2 flex-row">
			<sofa-normal-text :color="'text-primaryPurplePink'">
				{{ data.sections.length }} section{{ data.sections.length > 1 ? 's' : '' }}
			</sofa-normal-text>
			<span class="w-[4px] h-[4px] rounded-full bg-primaryPurplePink"></span>
			<sofa-normal-text :color="'text-primaryPurplePink'">
				{{ data.coursables.length }} material{{ data.coursables.length > 1 ? 's' : '' }}
			</sofa-normal-text>
		</div>

		<sofa-normal-text :custom-class="'text-left'">
			{{ data.description }}
		</sofa-normal-text>

		<div class="w-full flex flex-col gap-3">
			<div class="flex flex-row gap-1 items-center">
				<sofa-ratings :count="4" :size="'h-[14px] mdlg:!h-[15px]'" />
				<sofa-normal-text> {{ 4 }}.0 </sofa-normal-text>
				<sofa-normal-text :color="'text-grayColor pl-2'"> ({{ '24 ratings' }}) </sofa-normal-text>
			</div>

			<div class="w-full flex flex-row items-center">
				<div class="gap-2 flex flex-row items-center">
					<sofa-avatar :size="'20'" :photo-url="data.user.bio.photo?.link" />
					<sofa-normal-text>
						{{ data.user.bio.name.full }}
					</sofa-normal-text>
				</div>
			</div>

			<div class="w-full flex flex-row items-center gap-2">
				<sofa-icon :custom-class="'h-[16px]'" :name="'calendar-black'" />
				<sofa-normal-text> Last updated {{ formatTime(data.updatedAt) }} </sofa-normal-text>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { CourseEntity } from '@modules/study'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import SofaRatings from '../SofaRatings'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaCourseSummary',
	components: {
		SofaIcon,
		SofaNormalText,
		SofaImageLoader,
		SofaRatings,
		SofaAvatar,
	},
	props: {
		customClass: {
			type: String,
			default: '',
		},
		data: {
			type: Object as () => CourseEntity,
			default: null,
		},
	},
	setup() {
		return {
			Logic,
			formatTime,
		}
	},
})
</script>
