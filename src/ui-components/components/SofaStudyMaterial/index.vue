<template>
	<router-link v-if="type === 'item'" :to="content.route" class="shrink-0 bg-white flex flex-col gap-2 p-3 rounded-2xl shadow-itemBox">
		<SofaImageLoader class="w-full mdlg:!h-[155px] h-[120px] rounded-custom relative" :photoUrl="content.image">
			<div
				v-if="content.price && content.price?.amount > 0"
				class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
				<SofaBadge class="!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom">
					{{ Logic.Common.formatPrice(content.price.amount, content.price.currency) }}
				</SofaBadge>
			</div>
		</SofaImageLoader>
		<SofaNormalText class="!font-bold w-full flex pt-1 justify-start text-left !line-clamp-1">
			{{ content.title }}
		</SofaNormalText>
		<div class="flex flex-row gap-2 items-center">
			<SofaNormalText :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
				{{ content.labels.main }}
			</SofaNormalText>
			<span :class="`size-[5px] rounded-full ${content.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'}`" />
			<SofaNormalText :color="content.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">{{
				content.labels.sub
			}}</SofaNormalText>
		</div>

		<div class="w-full flex flex-row gap-2 items-center">
			<SofaIcon name="star-full" class="h-[16px]" />

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
				<SofaNormalText class="!whitespace-nowrap !line-clamp-1">
					{{ content.authUserId === content.user.id ? 'You' : content.user.bio.publicName }}
				</SofaNormalText>
				<SofaIcon v-if="content.user.roles.isVerified" name="verify" class="h-[13px]" />
				<SofaIcon v-if="content.user.type?.type === 'teacher'" name="tutor-bagde" class="h-[13px]" />
			</router-link>

			<SofaIcon name="bookmark" class="h-[18px]" @click.stop.prevent="bookmarkAction" />
		</div>
	</router-link>
	<component
		:is="isRoute ? 'router-link' : 'div'"
		v-bind="$attrs"
		v-if="type === 'activity'"
		:to="activity.route"
		class="shrink-0 mdlg:w-full shadow-custom mdlg:shadow-none flex items-start gap-3 p-3 justify-between rounded-custom mdlg:bg-lightGray bg-white cursor-pointer relative"
		:class="isWrapped ? 'w-full' : 'w-[220px]'">
		<div class="flex mdlg:!flex-row gap-2 mdlg:gap-3 items-start w-full" :class="isWrapped ? 'flex-row' : 'flex-col'">
			<SofaImageLoader
				:photoUrl="activity.image"
				class="mdlg:!h-[115px] mdlg:!w-[200px] rounded-custom relative"
				:class="isWrapped ? 'h-[100px] w-[150px]' : 'h-[120px] w-full'" />
			<div class="flex flex-col gap-2 relative h-full w-full">
				<div class="w-full flex items-center justify-between">
					<SofaNormalText class="!font-bold flex-1 line-clamp-1">{{ activity.title }}</SofaNormalText>
					<SofaIcon
						v-if="!hasShowMore"
						class="h-[16px] hidden mdlg:inline"
						name="bookmark"
						@click.stop.prevent="bookmarkAction" />
					<SofaIcon
						v-if="hasShowMore"
						name="more-options-horizontal"
						class="w-[20px]"
						@click.stop.prevent="(e) => handleShowMaterialMoreOptions(e, material)" />
				</div>
				<div class="flex gap-2 items-center">
					<SofaNormalText :color="activity.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
						{{ activity.labels.main }}
					</SofaNormalText>
					<span
						class="size-[5px] rounded-full"
						:class="activity.labels.color == 'pink' ? 'bg-primaryPurplePink' : 'bg-primaryPurple'">
					</span>
					<SofaNormalText :color="activity.labels.color == 'pink' ? 'text-primaryPurplePink' : 'text-primaryPurple'">
						{{ activity.labels.sub }}
					</SofaNormalText>
				</div>

				<div class="w-full flex gap-2 items-center">
					<SofaIcon name="star-full" class="h-[16px]" />

					<div class="flex gap-1 items-center">
						<SofaNormalText> {{ activity.ratings.avg }} </SofaNormalText>
						<SofaNormalText color="text-grayColor">
							({{ activity.ratings.count }} {{ pluralize(activity.ratings.count, 'rating', 'ratings') }})
						</SofaNormalText>
					</div>
				</div>

				<div class="flex items-center gap-2 flex-grow justify-between w-full">
					<router-link class="gap-2 flex items-center" :to="`/profile/${activity.user.id}`">
						<SofaAvatar size="20" :photoUrl="activity.user.bio.photo?.link" :userId="activity.user.id" />
						<SofaNormalText class="whitespace-nowrap line-clamp-1">
							{{ activity.authUserId === activity.user.id ? 'You' : activity.user.bio.publicName }}
						</SofaNormalText>
						<SofaIcon v-if="activity.user.roles.isVerified" name="verify" class="h-[13px]" />
						<SofaIcon v-if="activity.user.type?.type === 'teacher'" name="tutor-bagde" class="h-[13px]" />
					</router-link>

					<SofaIcon v-if="!isWrapped" name="bookmark" class="h-[17px] mdlg:hidden" @click.stop.prevent="bookmarkAction" />
				</div>
			</div>
		</div>
	</component>
</template>

<script lang="ts" setup>
import { pluralize } from 'valleyed'
import { computed } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaBadge from '../SofaBadge'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import { SofaNormalText } from '../SofaTypography'
import { Logic } from 'sofa-logic'
import { CourseEntity, FolderSaved, QuizEntity } from '@modules/study'
import { extractResource } from '@app/composables/library'
import { extractContent } from '@app/composables/marketplace'
import { useModals } from '@app/composables/core/modals'

const props = withDefaults(
	defineProps<{
		type: 'item' | 'activity'
		material: QuizEntity | CourseEntity
		isWrapped?: boolean
		isRoute?: boolean
		hasShowMore?: boolean
	}>(),
	{
		isWrapped: false,
		isRoute: true,
		hasShowMore: false,
	},
)

const content = computed(() => extractResource(props.material))
const activity = computed(() => extractContent(props.material))

const bookmarkAction = () => {
	const item = props.material
	useModals().study.saveToFolder.open({
		id: item.id,
		type: item.isCourse() ? FolderSaved.courses : FolderSaved.quizzes,
	})
}

const handleShowMaterialMoreOptions = (event: Event, material: QuizEntity | CourseEntity) => {
	useModals().study.materialMoreOptions.open({ material }, event)
}
</script>
