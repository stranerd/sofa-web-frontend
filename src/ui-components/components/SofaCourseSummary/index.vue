<template>
	<div v-if="data" class="flex flex-col gap-3 h-full w-full px-4">
		<SofaImageLoader class="w-full rounded-custom h-[200px]" :photoUrl="data.photo ? data.photo.link : '/images/default.svg'" />

		<SofaNormalText class="text-left font-bold">
			{{ data.title }}
		</SofaNormalText>

		<div class="w-full flex items-center gap-2 flex-row">
			<SofaNormalText color="text-primaryPurplePink">
				{{ data.sections.length }} section{{ data.sections.length > 1 ? 's' : '' }}
			</SofaNormalText>
			<span class="w-[4px] h-[4px] rounded-full bg-primaryPurplePink"></span>
			<SofaNormalText color="text-primaryPurplePink">
				{{ data.coursables.length }} material{{ data.coursables.length > 1 ? 's' : '' }}
			</SofaNormalText>
		</div>

		<SofaNormalText class="text-left">
			{{ data.description }}
		</SofaNormalText>

		<div class="w-full flex flex-col gap-3">
			<div class="flex flex-row gap-1 items-center">
				<SofaRatings v-model="data.ratings.avg" size="h-[14px] mdlg:!h-[15px]" />
				<SofaNormalText>{{ data.ratings.avg }}</SofaNormalText>
				<SofaNormalText color="text-grayColor pl-2"> ({{ data.ratings.count }} ratings) </SofaNormalText>
			</div>

			<div class="w-full flex flex-row items-center">
				<div class="gap-2 flex flex-row items-center">
					<SofaAvatar :size="20" :photoUrl="data.user.bio.photo?.link" />
					<SofaNormalText>
						{{ data.user.bio.publicName }}
					</SofaNormalText>
				</div>
			</div>

			<div class="w-full flex flex-row items-center gap-2">
				<SofaIcon customClass="h-[16px]" name="calendar-black" />
				<SofaNormalText> Last updated {{ $utils.formatTime(data.updatedAt) }} </SofaNormalText>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { defineComponent } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import SofaRatings from '../SofaRatings'
import { SofaNormalText } from '../SofaTypography'
import { CourseEntity } from '@modules/study'

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
})
</script>
