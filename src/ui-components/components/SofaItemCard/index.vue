<template>
	<component :is="as" :class="`col-span-1 flex flex-col gap-2 px-3 py-3 cursor-pointer rounded-custom ${customClass}`">
		<SofaImageLoader customClass="w-full mdlg:!h-[155px] h-[120px] rounded-custom relative" :photoUrl="content.image">
			<div
				v-if="content.price && content.price?.amount > 0"
				class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
				<SofaBadge customClass="!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom">
					{{ Logic.Common.formatPrice(content.price.amount, content.price.currency) }}
				</SofaBadge>
			</div>
		</SofaImageLoader>
		<SofaNormalText customClass="!font-bold w-full flex pt-1 justify-start text-left !line-clamp-1">
			{{ content.title }}
		</SofaNormalText>
		<div class="flex flex-row gap-2 items-center">
			<SofaNormalText :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
				{{ content.labels.main }}
			</SofaNormalText>
			<span :class="`h-[5px] w-[5px] rounded-full ${content.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'}`" />
			<SofaNormalText :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">{{
				content.labels.sub
			}}</SofaNormalText>
		</div>

		<div class="w-full flex flex-row gap-2 items-center">
			<SofaIcon name="star-full" customClass="h-[16px]" />

			<div class="flex flex-row gap-1 items-center">
				<SofaNormalText> {{ content.ratings.avg }} </SofaNormalText>
				<SofaNormalText color="text-grayColor">
					({{ content.ratings.count }} rating{{ content.ratings.count > 1 ? 's' : '' }})
				</SofaNormalText>
			</div>
		</div>

		<div v-if="content.user" class="flex gap-2 items-center justify-between pt-1">
			<router-link class="gap-2 flex items-center" :to="`/profile/${content.user.id}`">
				<SofaAvatar size="20" :photoUrl="content.user.bio.photo?.link" :userId="content.user.id" />
				<SofaNormalText customClass="!whitespace-nowrap !line-clamp-1">
					{{ content.authUserId === content.user.id ? 'You' : content.user.bio.publicName }}
				</SofaNormalText>
				<SofaIcon v-if="content.user.roles.isVerified" name="verify" customClass="h-[13px]" />
				<SofaIcon v-if="content.user.type?.type === 'teacher'" name="tutor-bagde" customClass="h-[13px]" />
			</router-link>

			<SofaIcon name="bookmark" customClass="h-[18px] " @click.stop.prevent="bookmarkAction ? bookmarkAction() : null" />
		</div>
	</component>
</template>
<script lang="ts" setup>
import { Logic, ResourceType } from 'sofa-logic'
import SofaAvatar from '../SofaAvatar'
import SofaBadge from '../SofaBadge'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import { SofaNormalText } from '../SofaTypography'

withDefaults(
	defineProps<{
		customClass?: string
		content: ResourceType
		bookmarkAction?: () => void
		as?: string
	}>(),
	{
		customClass: 'border-2 rounded-[16px] border-darkLightGray',
		as: 'div',
		bookmarkAction: undefined,
	},
)
</script>
