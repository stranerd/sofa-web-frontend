<template>
	<component :is="as" :class="`col-span-1 flex flex-col gap-2 px-3 py-3 cursor-pointer rounded-custom ${customClass}`">
		<sofa-image-loader custom-class="w-full mdlg:!h-[155px] h-[120px] rounded-custom relative" :photo-url="content.image">
			<div
				v-if="content.price && content.price?.amount > 0"
				class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
				<sofa-badge :custom-class="'!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom'">
					{{ Logic.Common.formatPrice(content.price.amount, content.price.currency) }}
				</sofa-badge>
			</div>
		</sofa-image-loader>
		<sofa-normal-text :custom-class="'!font-bold w-full flex pt-1 justify-start text-left !line-clamp-1'">
			{{ content.title }}
		</sofa-normal-text>
		<div class="flex flex-row gap-2 items-center">
			<sofa-normal-text :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
				{{ content.labels.main }}
			</sofa-normal-text>
			<span :class="`h-[5px] w-[5px] rounded-full ${content.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'}`" />
			<sofa-normal-text :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">{{
				content.labels.sub
			}}</sofa-normal-text>
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

		<div v-if="content.user" class="flex gap-2 items-center justify-between pt-1">
			<a class="gap-2 flex items-center" @click.stop.prevent="Logic.Common.GoToRoute(`/profile/${content.user.id}`)">
				<sofa-avatar :size="'20'" :photo-url="content.user.bio.photo?.link" :user-id="content.user.id" />
				<sofa-normal-text :custom-class="'!whitespace-nowrap !line-clamp-1'">
					{{ content.authUserId === content.user.id ? 'You' : content.user.bio.name.full }}
				</sofa-normal-text>
				<sofa-icon v-if="content.user.roles.isVerified" :name="'verify'" :custom-class="'h-[13px]'" />
				<sofa-icon v-if="content.user.type?.type === 'teacher'" :name="'tutor-bagde'" :custom-class="'h-[13px]'" />
			</a>

			<sofa-icon :name="'bookmark'" :custom-class="'h-[18px] '" @click.stop="bookmarkAction ? bookmarkAction() : null" />
		</div>
	</component>
</template>
<script lang="ts">
import { Logic, ResourceType } from 'sofa-logic'
import { defineComponent, PropType } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaBadge from '../SofaBadge'
import SofaButton from '../SofaButton'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaItemCard',
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
			type: Object as PropType<ResourceType>,
			required: true,
		},
		bookmarkAction: {
			type: Function,
			default: null,
		},
		as: {
			type: String,
			default: 'div',
		},
	},
	setup() {
		return {
			Logic,
		}
	},
})
</script>
