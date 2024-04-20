<template>
	<router-link
		v-if="type === 'item'"
		:to="material.pageLink"
		v-bind="$attrs"
		class="shrink-0 bg-white flex flex-col gap-2 p-3 rounded-2xl shadow-itemBox">
		<SofaImageLoader class="w-full mdlg:h-[155px] h-[120px] rounded-custom relative" :photoUrl="material.picture">
			<div v-if="price && price.amount > 0" class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
				<SofaBadge class="!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom">
					{{ $utils.formatPrice(price.amount, price.currency) }}
				</SofaBadge>
			</div>
		</SofaImageLoader>
		<SofaNormalText class="!font-bold w-full flex pt-1 justify-start text-left !line-clamp-1">
			{{ material.title }}
		</SofaNormalText>
		<div class="flex gap-2 items-center" :class="[color]">
			<SofaNormalText color="text-current" :content="label" />
			<span class="size-[5px] rounded-full bg-current" />
			<SofaNormalText color="text-current" :content="sub" />
		</div>

		<div class="w-full flex gap-2 items-center">
			<SofaIcon name="star" class="h-[16px] fill-primaryYellow" />

			<div class="flex gap-1 items-center">
				<SofaNormalText> {{ material.ratings.avg }} </SofaNormalText>
				<SofaNormalText color="text-grayColor">
					({{ material.ratings.count }} {{ $utils.pluralize(material.ratings.count, 'rating', 'ratings') }})
				</SofaNormalText>
			</div>
		</div>

		<div class="flex gap-2 items-center justify-between pt-1">
			<router-link class="gap-2 flex items-center" :to="`/profile/${material.user.id}`">
				<SofaAvatar :size="20" :photoUrl="material.user.bio.photo?.link" :userId="material.user.id" />
				<SofaNormalText class="!whitespace-nowrap !line-clamp-1">
					{{ material.user.id === id ? 'You' : material.user.bio.publicName }}
				</SofaNormalText>
				<SofaIcon v-if="material.user.roles.isVerified" name="verify" class="h-[13px]" />
				<SofaIcon v-if="material.user.type?.type === UserType.teacher" name="tutor-bagde" class="h-[13px]" />
			</router-link>

			<SofaIcon v-if="hasBookmark" :name="saveIcon" class="h-[18px]" @click.stop.prevent="bookmarkAction" />
		</div>
	</router-link>

	<component
		:is="isRoute ? 'router-link' : 'div'"
		v-bind="$attrs"
		v-if="type === 'activity'"
		:to="material.pageLink"
		class="shrink-0 mdlg:w-full shadow-custom mdlg:shadow-none flex items-start gap-3 p-3 justify-between rounded-custom mdlg:bg-lightGray bg-white cursor-pointer relative"
		:class="isWrapped ? 'w-full' : 'w-[220px]'">
		<div class="flex mdlg:flex-row gap-2 mdlg:gap-3 items-start w-full" :class="isWrapped ? 'flex-row' : 'flex-col'">
			<SofaImageLoader
				:photoUrl="material.picture"
				class="mdlg:h-[115px] mdlg:w-[200px] rounded-custom"
				:class="isWrapped ? 'h-[100px] w-[150px]' : 'h-[120px] w-full'">
				<div v-if="price && price.amount > 0" class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
					<SofaBadge class="!bg-bodyBlack !bg-opacity-50 !text-white !px-4 !py-2 rounded-custom">
						{{ $utils.formatPrice(price.amount, price.currency) }}
					</SofaBadge>
				</div>
			</SofaImageLoader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<div class="w-full flex items-center gap-2">
					<SofaNormalText class="!font-bold flex-1 line-clamp-1">{{ material.title }}</SofaNormalText>
					<SofaIcon
						v-if="!hasShowMore && hasBookmark"
						class="h-[16px] hidden mdlg:inline"
						:name="saveIcon"
						@click.stop.prevent="bookmarkAction" />
					<SofaIcon
						v-if="hasShowMore"
						name="more-options-horizontal"
						class="w-[20px] h-3"
						@click.stop.prevent="(e) => handleShowMaterialMoreOptions(e)" />
					<slot name="side-icons" />
				</div>
				<div class="flex gap-2 items-center" :class="[color]">
					<SofaNormalText color="text-current" :content="label" />
					<span class="size-[5px] rounded-full bg-current" />
					<SofaNormalText color="text-current" :content="sub" />
				</div>

				<div class="w-full flex gap-2 items-center">
					<SofaIcon name="star" class="h-[16px] fill-primaryYellow" />

					<div class="flex gap-1 items-center">
						<SofaNormalText> {{ material.ratings.avg }} </SofaNormalText>
						<SofaNormalText color="text-grayColor">
							({{ material.ratings.count }} {{ $utils.pluralize(material.ratings.count, 'rating', 'ratings') }})
						</SofaNormalText>
					</div>
				</div>

				<div class="flex items-center gap-2 grow justify-between w-full">
					<router-link class="gap-2 flex items-center" :to="`/profile/${material.user.id}`">
						<SofaAvatar :size="20" :photoUrl="material.user.bio.photo?.link" :userId="material.user.id" />
						<SofaNormalText class="whitespace-nowrap line-clamp-1">
							{{ material.user.id === id ? 'You' : material.user.bio.publicName }}
						</SofaNormalText>
						<SofaIcon v-if="material.user.roles.isVerified" name="verify" class="h-[13px]" />
						<SofaIcon v-if="material.user.type?.type === UserType.teacher" name="tutor-bagde" class="h-[13px]" />
					</router-link>

					<SofaIcon
						v-if="!isWrapped && hasBookmark"
						:name="saveIcon"
						class="h-[17px] mdlg:hidden"
						@click.stop.prevent="bookmarkAction" />
				</div>
			</div>
		</div>
	</component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { StudyMaterial } from '@modules/study'
import { UserType } from '@modules/users'
import { useAuth } from '@app/composables/auth/auth'
import { useMyFolders, saveToFolder } from '@app/composables/study/folders'
import { useModals } from '@app/composables/core/modals'

const props = withDefaults(
	defineProps<{
		type: 'item' | 'activity'
		material: StudyMaterial
		isWrapped?: boolean
		isRoute?: boolean
		hasBookmark?: boolean
		hasShowMore?: boolean
	}>(),
	{
		isWrapped: false,
		isRoute: true,
		hasBookmark: true,
		hasShowMore: false,
	},
)

const { id } = useAuth()
const { folders } = useMyFolders()

const isSaved = computed(() => folders.value.some((folder) => folder.hasItem(props.material)))
const saveIcon = computed(() => (isSaved.value ? 'bookmark-filled' : 'bookmark'))

const bookmarkAction = () => {
	saveToFolder(props.material)
}

const handleShowMaterialMoreOptions = (event: Event) => {
	useModals().study.materialMoreOptions.open({ material: props.material }, event)
}

const price = computed(() => (props.material.isCourse() ? props.material.price : null))
const color = computed(() => (props.material.isQuiz() ? 'text-primaryPurplePink' : 'text-primaryPurple'))
const label = computed(() => (props.material.isQuiz() ? 'Quiz - Learn' : 'Course'))
const sub = computed(() =>
	props.material.isQuiz()
		? `${props.material.questions.length} ${$utils.pluralize(props.material.questions.length, 'question', 'questions')}`
		: `${props.material.sections.length} ${(props.material.sections.length, 'topic', 'topics')}`,
)
</script>
