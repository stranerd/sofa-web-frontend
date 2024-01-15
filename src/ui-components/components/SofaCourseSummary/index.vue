<template>
	<div v-if="data" class="flex flex-col gap-3 h-full w-full px-4">
		<SofaImageLoader
			:customClass="'w-full rounded-custom h-[200px]'"
			:photoUrl="data.photo ? data.photo.link : '/images/default.png'" />

		<SofaNormalText :customClass="'text-left font-bold'">
			{{ data.title }}
		</SofaNormalText>

		<div class="w-full flex items-center gap-2 flex-row">
			<SofaNormalText :color="'text-primaryPurplePink'">
				{{ data.sections.length }} section{{ data.sections.length > 1 ? 's' : '' }}
			</SofaNormalText>
			<span class="w-[4px] h-[4px] rounded-full bg-primaryPurplePink"></span>
			<SofaNormalText :color="'text-primaryPurplePink'">
				{{ data.coursables.length }} material{{ data.coursables.length > 1 ? 's' : '' }}
			</SofaNormalText>
		</div>

		<SofaNormalText :customClass="'text-left'">
			{{ data.description }}
		</SofaNormalText>

		<div class="w-full flex flex-col gap-3">
			<div class="flex flex-row gap-1 items-center">
				<SofaRatings v-model="data.ratings.avg" :size="'h-[14px] mdlg:!h-[15px]'" />
				<SofaNormalText>{{ data.ratings.avg }}</SofaNormalText>
				<SofaNormalText :color="'text-grayColor pl-2'"> ({{ data.ratings.count }} ratings) </SofaNormalText>
			</div>

			<div class="w-full flex flex-row items-center">
				<div class="gap-2 flex flex-row items-center">
					<SofaAvatar :size="'20'" :photoUrl="data.user.bio.photo?.link" />
					<SofaNormalText>
						{{ data.user.bio.name.full }}
					</SofaNormalText>
				</div>
			</div>

			<div class="w-full flex flex-row items-center gap-2">
				<SofaIcon :customClass="'h-[16px]'" :name="'calendar-black'" />
				<SofaNormalText> Last updated {{ formatTime(data.updatedAt) }} </SofaNormalText>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
