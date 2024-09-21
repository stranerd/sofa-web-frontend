<template>
	<Card :as="isRoute ? 'router-link' : 'div'" :image="material.picture" v-bind="$attrs" :wrapped="wrapped" :to="material.pageLink">
		<template v-if="price && price.amount > 0" #image-content>
			<div class="flex gap-2 items-center justify-end absolute bottom-0 left-0 w-full p-2">
				<SofaBadge color="body" class="bg-opacity-50 !px-4 !py-2 rounded-custom">
					{{ $utils.formatPrice(price.amount, price.currency) }}
				</SofaBadge>
			</div>
		</template>
		<template #default>
			<div class="w-full flex items-center gap-2">
				<SofaHeading :content="material.title" class="grow" />
				<SofaIcon
					v-if="!hasShowMore && hasBookmark"
					class="h-[16px] hidden mdlg:inline"
					:name="saveIcon"
					@click.stop.prevent="bookmarkAction" />
				<SofaIcon
					v-if="hasShowMore"
					name="more-options-horizontal"
					class="w-[20px] h-3"
					@click.stop.prevent="handleShowMaterialMoreOptions" />
				<slot name="side-icons" />
			</div>
			<div class="flex gap-2 items-center whitespace-nowrap line-clamp-1" :class="[color]">
				<SofaText :content="label" />
				<span class="size-[5px] rounded-full bg-current" />
				<SofaText :content="sub" />
			</div>

			<div class="w-full flex gap-2 items-center">
				<SofaIcon name="star" class="h-[16px] fill-primaryYellow" />

				<div class="flex gap-1 items-center">
					<SofaText> {{ material.ratings.avg }} </SofaText>
					<SofaText class="text-grayColor">
						({{ material.ratings.count }} {{ $utils.pluralize(material.ratings.count, 'rating', 'ratings') }})
					</SofaText>
				</div>
			</div>

			<div class="flex items-center gap-2 justify-between w-full">
				<UserName :user="material.user" as="router-link" />
				<SofaIcon v-if="hasBookmark" :name="saveIcon" class="h-[17px] mdlg:hidden" @click.stop.prevent="bookmarkAction" />
			</div>
		</template>
	</Card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { saveToFolder, useMyFolders } from '@app/composables/study/folders'
import { StudyMaterial } from '@modules/study'

const props = withDefaults(
	defineProps<{
		material: StudyMaterial
		wrapped?: boolean
		isRoute?: boolean
		hasBookmark?: boolean
		hasShowMore?: boolean
	}>(),
	{
		wrapped: false,
		isRoute: true,
		hasBookmark: false,
		hasShowMore: false,
	},
)

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
		: `${props.material.sections.length} ${$utils.pluralize(props.material.sections.length, 'topic', 'topics')}`,
)
</script>
