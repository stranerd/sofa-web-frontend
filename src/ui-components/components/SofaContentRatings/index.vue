<template>
	<div :class="`w-full flex flex-col ${hasWhiteBox ? 'gap-4' : 'gap-3'}  pb-4`">
		<div
			:class="`w-full  ${
				hasWhiteBox ? 'bg-white shadow-custom' : 'bg-lightGray'
			} rounded-custom mdlg:!px-4 mdlg:!py-4 px-3 py-3 flex flex-row gap-3 items-center`">
			<div class="flex flex-col py-4 px-2 mdlg:!w-[200px] w-[200px]">
				<div class="mdlg:!px-7 px-3 py-4 flex flex-col gap-2 items-center justify-center border-r-2 border-darkLightGray">
					<div class="flex flex-row">
						<SofaNormalText customClass="mdlg:!text-xl !text-lg">
							{{ data.avg }}
						</SofaNormalText>
						<SofaNormalText customClass="mdlg:!text-xl  !text-lg" color="text-grayColor"> /5 </SofaNormalText>
					</div>
					<SofaRatings v-model="data.avg" size="h-[15px] mdlg:!h-[17px]" />

					<SofaNormalText color="text-grayColor">
						{{ data.label }}
					</SofaNormalText>
				</div>
			</div>

			<div class="w-full flex flex-col gap-2">
				<div v-for="(rating, index) in data.stats" :key="index" class="w-full flex flex-row items-center justify-between gap-3">
					<SofaNormalText
						customClass="!text-xs mdlg:!text-xs"
						:color="`${data.stats[index] == 0 ? 'text-grayColor' : 'text-bodyBlack'}`">
						{{ index }} stars
					</SofaNormalText>
					<div class="grow h-[8px] rounded-[8px] bg-darkLightGray relative">
						<div
							class="h-full absolute top-0 left-0 bg-primaryYellow rounded-[8px]"
							:style="`width: ${(data.stats[index] / data.count) * 100}%;`"></div>
					</div>

					<SofaNormalText
						customClass="!text-xs mdlg:!text-xs"
						:color="`${data.stats[index] == 0 ? 'text-grayColor' : 'text-bodyBlack'}`">
						({{ data.stats[index] }})
					</SofaNormalText>
				</div>
			</div>
		</div>

		<div
			v-for="(review, index) in data.reviews"
			:key="index"
			:class="`w-full  ${
				hasWhiteBox ? 'bg-white shadow-custom' : 'bg-lightGray'
			}  rounded-custom mdlg:!px-4 mdlg:!py-4 px-3 py-3 flex flex-row gap-3 items-start`">
			<div>
				<SofaAvatar :photoUrl="review.user.photoUrl" :size="44" :userId="review.user.id" />
			</div>

			<div class="flex flex-col gap-1">
				<SofaNormalText customClass="!font-semibold">{{ review.user.name }}</SofaNormalText>
				<SofaRatings v-model="review.rating" size="h-[14px] mdlg:!h-[16px]" />
				<SofaNormalText customClass="text-left">
					{{ review.review }}
				</SofaNormalText>
			</div>
		</div>

		<!-- <div class="w-full !h-[100px]"></div> -->
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaRatings from '../SofaRatings'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaContentRatings',
	components: {
		SofaNormalText,
		SofaRatings,
		SofaAvatar,
	},
	props: {
		customClass: {
			type: String,
			default: 'bg-lightGray',
		},
		data: {
			type: Object,
			required: true,
		},
		hasWhiteBox: {
			type: Boolean,
			default: false,
		},
	},
})
</script>
