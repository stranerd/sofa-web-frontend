<template>
	<component
		:is="as"
		:class="`mdlg:!w-full ${isWrapped ? 'w-full' : 'w-[220px]'}  shadow-custom mdlg:!shadow-none flex ${
			isWrapped ? 'w-full' : 'flex-row'
		}  items-start gap-3 px-3 py-3 justify-between rounded-custom mdlg:bg-lightGray bg-white  ${customClass}`">
		<div :class="`flex mdlg:!flex-row  ${isWrapped ? ' flex-row' : ' flex-col'} gap-2 mdlg:gap-3 items-start w-full`">
			<SofaImageLoader
				:photoUrl="activity.image"
				:customClass="`mdlg:!h-[115px]  ${
					isWrapped ? ' h-[100px] w-[150px]' : '  h-[120px] w-full'
				} mdlg:!w-[200px] rounded-custom relative`">
				<div
					v-if="activity.progress > 0"
					:class="`absolute bottom-0 left-0 w-full px-2 rounded-b-[12px] bg-black bg-opacity-50  ${
						activity.progress < 100 ? 'py-2' : 'py-1'
					}`">
					<div v-if="activity.progress < 100" class="w-full h-[6px] rounded-[8px] bg-grayColor relative">
						<div class="h-full bg-white rounded-[8px]" :style="`width: ${activity.progress}%;`"></div>
					</div>
					<SofaNormalText
						v-else
						:customClass="'!text-xs !py-0 font-semibold w-full flex flex-row items-center justify-center'"
						:color="'text-white'"
						content="Completed" />
				</div>
			</SofaImageLoader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<div class="w-full flex flex-row items-center justify-between">
					<SofaNormalText :customClass="'!font-bold w-full text-left !line-clamp-1'">{{ activity.title }}</SofaNormalText>
					<div v-if="hasEdit" class="flex flex-row justify-end" @click.stop="editAction ? editAction() : null">
						<SofaIcon :customClass="'h-[16px]'" :name="'edit-gray'" />
					</div>
					<a
						v-if="hasBookmark && Logic.Common.isLarge"
						class="flex flex-row justify-end"
						@click.stop.prevent="bookmarkAction?.()">
						<SofaIcon :customClass="'h-[16px]'" :name="'bookmark'" />
					</a>

					<template v-if="hasExtra">
						<slot name="extra" />
					</template>
				</div>
				<div class="flex flex-row gap-2 items-center">
					<SofaNormalText :color="activity.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
						{{ activity.labels.main }}
					</SofaNormalText>
					<span
						:class="`h-[5px] w-[5px] rounded-full ${
							activity.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'
						}`">
					</span>
					<SofaNormalText :color="activity.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
						{{ activity.labels.sub }}
					</SofaNormalText>
				</div>

				<div class="w-full flex flex-row gap-2 items-center">
					<SofaIcon :name="'star-full'" :customClass="'h-[16px]'" />

					<div class="flex flex-row gap-1 items-center">
						<SofaNormalText> {{ activity.ratings.avg }} </SofaNormalText>
						<SofaNormalText :color="'text-grayColor'">
							({{ activity.ratings.count }} rating{{ activity.ratings.count > 1 ? 's' : '' }})
						</SofaNormalText>
					</div>
				</div>

				<div class="flex items-center gap-2 flex-grow justify-between w-full">
					<a class="gap-2 flex items-center" @click.stop.prevent="Logic.Common.GoToRoute(`/profile/${activity.user.id}`)">
						<SofaAvatar :size="'20'" :photoUrl="activity.user.bio.photo?.link" :userId="activity.user.id" />
						<SofaNormalText :customClass="'!whitespace-nowrap !line-clamp-1'">
							{{ activity.authUserId === activity.user.id ? 'You' : activity.user.bio.name.full }}
						</SofaNormalText>
						<SofaIcon v-if="activity.user.roles.isVerified" :name="'verify'" :customClass="'h-[13px]'" />
						<SofaIcon v-if="activity.user.type?.type === 'teacher'" :name="'tutor-bagde'" :customClass="'h-[13px]'" />
					</a>

					<SofaIcon
						v-if="!isWrapped"
						:name="'bookmark'"
						:customClass="'h-[17px] mdlg:!hidden '"
						@click.stop.prevent="bookmarkAction?.()" />
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
	name: 'SofaActivityCard',
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
			default: 'div',
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
			default: null,
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
			default: null,
		},
		hasExtra: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		return {
			Logic,
		}
	},
})
</script>
