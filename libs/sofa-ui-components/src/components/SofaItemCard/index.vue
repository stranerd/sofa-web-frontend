<template>
	<component :is="as" :class="`col-span-1 flex flex-col gap-2 px-3 py-3 cursor-pointer rounded-custom ${customClass}`">
		<sofa-image-loader custom-class="w-full mdlg:!h-[155px] h-[120px] rounded-custom relative" :photo-url="content.image">
			<div class="flex flex-row gap-2 items-center justify-end absolute bottom-0 left-0 w-full px-2 py-2"
				v-if="content.price > 0">
				<sofa-badge :customClass="'!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom'">
					{{
						content.price > 0
							? `${Logic.Common.convertToMoney(content.price, false, "ngn")}`
							: "Start"
					}}
				</sofa-badge>
			</div>
		</sofa-image-loader>
		<sofa-normal-text :customClass="'!font-bold w-full flex pt-1 justify-start text-left !line-clamp-1'">
			{{ content.title }}
		</sofa-normal-text>
		<div class="flex flex-row gap-2 items-center">
			<sofa-normal-text :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
				{{ content.labels.main }}
			</sofa-normal-text>
			<span
				:class="`h-[5px] w-[5px] rounded-full ${content.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'}`" />
			<sofa-normal-text :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">{{
				content.labels.sub }}</sofa-normal-text>
		</div>

		<div class="w-full flex flex-row gap-2 items-center">
			<sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

			<div class="flex flex-row gap-1 items-center">
				<sofa-normal-text> {{ content.ratings.avg }} </sofa-normal-text>
				<sofa-normal-text :color="'text-grayColor'">
					({{ content.ratings.count }} rating{{ content.ratings.count > 1 ? 's' : '' }})
				</sofa-normal-text>
			</div>
		</div>

		<div class="flex gap-2 items-center justify-between pt-1" v-if="content.user">
			<a @click.stop.prevent="Logic.Common.GoToRoute(`/profile/${content.user.id}`)" class="gap-2 flex items-center">
				<sofa-avatar :size="'20'" :photoUrl="content.user.bio.photo?.link" :user-id="content.user.id" />
				<sofa-normal-text :customClass="'!whitespace-nowrap !line-clamp-1'">
					{{ content.authUserId === content.user.id ? 'You' : content.user.bio.name.full }}
				</sofa-normal-text>
				<sofa-icon v-if="content.user.roles.isVerified" :name="'verify'" :custom-class="'h-[13px]'" />
				<sofa-icon v-if="content.user.type?.type === 'teacher'" :name="'tutor-bagde'" :custom-class="'h-[13px]'" />
			</a>

			<sofa-icon @click.stop="bookmarkAction ? bookmarkAction() : null" :name="'bookmark'" :customClass="'h-[18px] '" />
		</div>
	</component>
</template>
<script lang="ts">
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaBadge from '../SofaBadge'
import SofaButton from '../SofaButton'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	components: {
		SofaIcon,
		SofaImageLoader,
		SofaNormalText,
		SofaBadge,
		SofaButton,
		SofaAvatar,
	},
	props: {
		customClass: {
			type: String,
			default: 'border-2 rounded-[16px] border-darkLightGray',
		},
		content: {
			type: Object as () => any,
		},
		bookmarkAction: {
			type: Function,
		},
		as: {
			type: String,
			default: 'div'
		}
	},
	name: 'SofaItemCard',
	setup () {
		return {
			Logic,
		}
	},
})
</script>
