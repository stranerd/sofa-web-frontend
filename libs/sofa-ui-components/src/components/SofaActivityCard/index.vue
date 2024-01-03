<template>
	<component :is="as"
		:class="`mdlg:!w-full ${isWrapped ? 'w-full' : 'w-[220px]'}  shadow-custom mdlg:!shadow-none flex ${isWrapped ? 'w-full' : 'flex-row'}  items-start gap-3 px-3 py-3 justify-between rounded-custom mdlg:bg-lightGray bg-white  ${customClass}`">
		<div :class="`flex mdlg:!flex-row  ${isWrapped ? ' flex-row' : ' flex-col'} gap-2 mdlg:gap-3 items-start w-full`">
			<sofa-image-loader :photoUrl="activity.image"
				:customClass="`mdlg:!h-[115px]  ${isWrapped ? ' h-[100px] w-[150px]' : '  h-[120px] w-full'} mdlg:!w-[200px]  rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] relative`">
				<div v-if="activity.progress > 0"
					:class="`absolute bottom-0 left-0 w-full px-2 rounded-b-[12px] bg-black bg-opacity-50  ${activity.progress < 100 ? 'py-2' : 'py-1'}`">
					<div class="w-full h-[6px] rounded-[8px] bg-grayColor relative" v-if="activity.progress < 100">
						<div class="h-full bg-white rounded-[8px]" :style="`width: ${activity.progress}%;`"></div>
					</div>
					<sofa-normal-text v-else
						:customClass="'!text-xs !py-0 font-semibold w-full flex flex-row items-center justify-center'"
						:color="'text-white'">Completed</sofa-normal-text>
				</div>
			</sofa-image-loader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<div class="w-full flex flex-row items-center justify-between">
					<sofa-normal-text :customClass="'!font-bold w-full text-left !line-clamp-1'">{{ activity.title
					}}</sofa-normal-text>
					<div class="flex flex-row justify-end" v-if="hasEdit" @click.stop="editAction ? editAction() : null">
						<sofa-icon :customClass="'h-[16px]'" :name="'edit-gray'" />
					</div>
					<a class="flex flex-row justify-end" v-if="hasBookmark && Logic.Common.isLarge"
						@click.stop.prevent="bookmarkAction?.()">
						<sofa-icon :customClass="'h-[16px]'" :name="'bookmark'" />
					</a>

					<template v-if="hasExtra">
						<slot name="extra" />
					</template>
				</div>
				<div class="flex flex-row gap-2 items-center">
					<sofa-normal-text :color="activity.labels.color == 'pink'
						? 'text-primaryPurplePink'
						: 'text-primaryPurple'">
						{{ activity.labels.main }}
					</sofa-normal-text>
					<span :class="`h-[5px] w-[5px] rounded-full ${activity.labels.color == 'pink'
						? 'bg-primaryPurplePink'
						: 'bg-primaryPurple'}`">
					</span>
					<sofa-normal-text :color="activity.labels.color == 'pink'
						? 'text-primaryPurplePink'
						: 'text-primaryPurple'">{{ activity.labels.sub }}</sofa-normal-text>
				</div>

				<div class="w-full flex flex-row gap-2 items-center">
					<sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

					<div class="flex flex-row gap-1 items-center">
						<sofa-normal-text> {{ activity.ratings.avg }} </sofa-normal-text>
						<sofa-normal-text :color="'text-grayColor'">
							({{ activity.ratings.count }} rating{{ activity.ratings.count > 1 ? 's' : '' }})
						</sofa-normal-text>
					</div>
				</div>

				<div class="flex items-center gap-2 flex-grow justify-between w-full">
					<a @click.stop.prevent="Logic.Common.GoToRoute(`/profile/${activity.user.id}`)"
						class="gap-2 flex items-center">
						<sofa-avatar :size="'20'" :photoUrl="activity.user.bio.photo?.link" :user-id="activity.user.id" />
						<sofa-normal-text :customClass="'!whitespace-nowrap !line-clamp-1'">
							{{
								activity.authUserId === activity.user.id ? "You" : activity.user.bio.name.full
							}}
						</sofa-normal-text>
						<sofa-icon v-if="activity.user.roles.isVerified" :name="'verify'" :custom-class="'h-[13px]'" />
						<sofa-icon v-if="activity.user.type?.type === 'teacher'" :name="'tutor-bagde'"
							:custom-class="'h-[13px]'" />
					</a>

					<sofa-icon v-if="!isWrapped" @click.stop.prevent="bookmarkAction?.()" :name="'bookmark'"
						:customClass="'h-[17px] mdlg:!hidden '" />
				</div>
			</div>
		</div>
		<slot />
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
		SofaBadge,
		SofaImageLoader,
		SofaNormalText,
		SofaButton,
		SofaAvatar,
	},
	props: {
		customClass: {
			type: String,
			default: 'bg-lightGray',
		},
		as: {
			type: String,
			default: 'div'
		},
		activity: {
			type: Object as () => any,
			required: true,
		},
		isWrapped: {
			type: Boolean,
			default: false,
		},
		hasEdit: {
			type: Boolean,
			default: false,
		},
		editAction: {
			type: Function,
		},
		centralizeExtras: {
			type: Boolean,
			default: false,
		},
		hasBookmark: {
			type: Boolean,
			default: false,
		},
		bookmarkAction: {
			type: Function,
		},
		hasExtra: {
			type: Boolean,
			default: false,
		},
	},
	name: 'SofaActivityCard',
	setup () {
		return {
			Logic,
		}
	},
})
</script>
