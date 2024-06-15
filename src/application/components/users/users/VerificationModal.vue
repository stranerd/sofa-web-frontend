<template>
	<div v-if="currentItem">
		<div class="flex justify-between gap-4 p-4">
			<SofaHeading content="Verification application" />
			<div class="flex items-center justify-end w-1/2 border-l border-lightGray gap-2">
				<div class="inline">{{ currentIndex + 1 }}-10 of {{ data.length }}</div>
				<SofaIcon class="h-[20px]" name="alt-arrow-left" />
				<div class="w-[2px] h-4 bg-grayColor" />
				<SofaIcon class="h-[20px]" name="alt-arrow-right" @click="currentIndex < data.length - 1 ? currentIndex++ : null" />
				<SofaIcon class="h-[16px] pr-2" name="circle-close" @click="close" />
			</div>
		</div>
		<div class="bg-primaryPurple w-full h-[100px] relative">
			<div class="rounded-full size-[100px] bg-white p-2 absolute -bottom-2/4 left-4 z-10">
				<SofaAvatar :photoUrl="currentItem.user.picture" :size="80" />
			</div>
		</div>
		<div class="p-6 mt-6 flex flex-col gap-6">
			<div class="flex flex-col gap-1">
				<SofaHeading :content="currentItem.user.publicName" />
				<SofaText :content="currentItem.user.bio.description" />
			</div>
			<div v-if="currentItem.user.socials.length !== 0" class="flex flex-col gap-1">
				<SofaHeading content="Links" />
				<div class="flex items-center gap-4">
					<a
						v-for="social in currentItem.user.socials"
						:key="social.link"
						:href="social.link"
						target="_blank"
						class="flex items-center gap-2">
						<SofaIcon :name="`socials-${social.ref}`" class="bg-primaryBlue" />
					</a>
				</div>
			</div>
			<div class="flex flex-col gap-1">
				<SofaHeading content="Content" />
				<div class="flex items-center gap-6 min-w-full overflow-x-auto flex-nowrap">
					<StudyMaterialCard v-for="material in [...courses, ...quizzes]" :key="material.hash" :material />
				</div>
			</div>
		</div>
		<div v-if="currentItem.verification.pending" class="flex justify-between p-4">
			<SofaButton bgColor="bg-primaryRed" padding="py-3 px-4" @click="handleReject(currentItem.verification)">Reject</SofaButton>
			<SofaButton bgColor="bg-primaryGreen" padding="py-3 px-4" @click="handleAccept(currentItem.verification)">Accept</SofaButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserEntity, VerificationEntity } from '@modules/users'
import { useCoursesInList } from '@app/composables/study/courses-list'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { useAcceptVerificationRequest } from '@app/composables/users/verifications'
import StudyMaterialCard from '@app/components/study/StudyMaterialCard.vue'

const props = defineProps<{
	close: () => void
	data: {
		verification: VerificationEntity
		user: UserEntity
	}[]
	selectedIndex?: number
}>()

const currentIndex = ref(props.selectedIndex || 0)
const currentItem = computed(() => props.data.at(currentIndex.value))

const { handleAccept, handleReject } = useAcceptVerificationRequest()

const courseIds = computed(() => currentItem.value?.verification.content.courses ?? [])
const { courses } = useCoursesInList(courseIds)
const quizIds = computed(() => currentItem.value?.verification.content.quizzes ?? [])
const { quizzes } = useQuizzesInList(quizIds)
</script>
