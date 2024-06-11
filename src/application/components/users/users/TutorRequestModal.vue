<template>
	<div v-if="currentItem">
		<div class="header flex justify-between p-4">
			<SofaHeading content="Tutor application" />
			<div class="flex items-center justify-end w-3/4 border-l border-lightGray px-4 gap-2">
				<div class="inline">{{ currentIndex + 1 }} of {{ data.length }}</div>
				<SofaIcon
					class="h-[20px]"
					name="alt-arrow-left"
					:class="{ 'fill-grayColor': currentIndex < 1 }"
					@click="currentIndex > 0 ? currentIndex-- : null" />
				<div class="w-[2px] h-4 bg-grayColor" />
				<SofaIcon class="h-[20px]" name="alt-arrow-right" @click="currentIndex < data.length - 1 ? currentIndex++ : null" />
				<SofaIcon class="h-[16px] pr-2" name="circle-close" @click="close" />
			</div>
		</div>
		<div class="bg-primaryPurple w-full h-[100px] relative">
			<div class="rounded-full w-[100px] h-[100px] bg-white p-2 absolute -bottom-2/4 left-4 z-10">
				<SofaAvatar :photoUrl="currentItem.user.picture" :size="80" />
			</div>
		</div>
		<div class="p-6 mt-6 flex flex-col gap-6">
			<div>
				<SofaHeading :content="currentItem.user.publicName" />
				<SofaText :content="currentItem.user.bio.description" />
			</div>
			<div>
				<SofaHeading content="Qualification" />
				<div v-for="(file, index) in currentItem.tutorRequest.qualification" :key="index" class="flex items-center gap-2">
					<SofaIcon name="file-document" class="fill-primaryPurple" />
					<SofaText :content="file.name" class="text-primaryPurple" />
				</div>
			</div>
			<div>
				<SofaHeading content="Verification" />
				<div class="flex items-center gap-2">
					<SofaIcon name="file-document" class="fill-primaryPurple" />
					<SofaText :content="currentItem.tutorRequest.verification.name" class="text-primaryPurple" />
				</div>
			</div>
			<div>
				<SofaHeading content="Applied for Subjects" />
				<div class="flex items-center gap-4">
					<div v-for="(subject, index) in appliedSubjects" :key="index" class="flex items-center gap-2">
						<SofaIcon name="lessons" class="fill-deepGray" />
						<SofaText :content="subject.title" />
					</div>
				</div>
			</div>
			<div v-if="currentlyTeaching.length > 0">
				<SofaHeading content="Currently Teaching" />
				<div class="flex items-center gap-4">
					<div v-for="(topic, index) in currentlyTeaching" :key="index" class="flex items-center gap-2">
						<SofaIcon name="lessons" class="fill-deepGray" />
						<SofaText :content="topic.title" />
					</div>
				</div>
			</div>
			<div>
				<SofaHeading content="Location" />
				<SofaText :content="`${currentItem.user.location?.state}, ${currentItem.user.location?.country}`" />
			</div>
		</div>
		<div class="flex justify-between p-4">
			<SofaButton bgColor="bg-primaryRed" padding="py-3 px-4">Reject</SofaButton>
			<SofaButton bgColor="bg-primaryGreen" padding="py-3 px-4">Accept</SofaButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TutorRequestEntity, UserEntity } from '@modules/users'
import { useTagsInList } from '@app/composables/interactions/tags'

const props = defineProps<{
	close: () => void
	data: {
		tutorRequest: TutorRequestEntity
		user: UserEntity
	}[]
	selectedIndex?: number
}>()

const currentIndex = ref(props.selectedIndex || 0)
const currentItem = computed(() => props.data.at(currentIndex.value))

const currentlyTeachingIds = computed(() => currentItem.value?.user.tutor.topics ?? [])
const { tags: currentlyTeaching } = useTagsInList(currentlyTeachingIds)
const appliedForIds = computed(() => (currentItem.value ? [currentItem.value.tutorRequest.topicId] : []))
const { tags: appliedSubjects } = useTagsInList(appliedForIds)
</script>
