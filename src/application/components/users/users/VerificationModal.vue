<template>
	<div v-if="currentItem">
		<div class="flex justify-between p-4">
			<SofaHeading content="Verification application" />
			<div class="flex items-center justify-end w-1/2 border-l border-lightGray px-4 gap-2">
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
		<div class="p-6 mt-6 space-y-6">
			<div class="space-y-2">
				<SofaHeading :content="currentItem.user.publicName" />
				<SofaText :content="currentItem.user.bio.description" />
			</div>
			<div v-if="currentItem.user.socials.length !== 0" class="space-y-2">
				<SofaHeading content="Links" />
				<div class="flex items-center gap-4">
					<div v-for="social in currentItem.user.socials" :key="social.link" class="flex items-center gap-2">
						<SofaIcon :name="`socials-${social.ref}`" class="bg-primaryBlue" />
					</div>
				</div>
			</div>
			<div class="space-y-2">
				<SofaHeading content="Content" />
				<div class="flex items-center gap-6 min-w-full overflow-x-auto flex-nowrap">
					<div v-for="i in 8" :key="i" class="border-2 rounded-lg border-grayColor p-4 w-[212px] h-[240px] space-y-4">
						<img src="/images/auth-bg.png" alt="" class="rounded-lg h-[120px] w-[180px]" />
						<div class="">
							<SofaHeading content="Atoms I" />
							<div class="flex gap-2 items-center whitespace-nowrap line-clamp-1 text-primaryPurplePink">
								<SofaText content="Course" />
								<span class="size-[5px] rounded-full bg-current" />
								<SofaText content="4 materials" />
							</div>

							<div class="w-full flex gap-2 items-center">
								<SofaIcon name="star" class="h-[16px] fill-primaryYellow" />
								<div class="flex gap-1 items-center">
									<SofaText content="4.0" />
									<SofaText class="text-grayColor"> (24 ratings)</SofaText>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex justify-between p-4">
			<SofaButton bgColor="bg-primaryRed" padding="py-3 px-4" @click="handleReject(currentItem!.verification.id)">Reject</SofaButton>
			<SofaButton bgColor="bg-primaryGreen" padding="py-3 px-4" @click="handleAccept(currentItem!.verification.id)"
			>Accept</SofaButton
			>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserEntity, VerificationEntity } from '@modules/users'
// import { useTagsInList } from '@app/composables/interactions/tags'
import { useAcceptRejectVerificationRequest } from '@app/composables/users/verifications'

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

const { handleAccept, handleReject } = useAcceptRejectVerificationRequest()

// const currentlyTeachingIds = computed(() => currentItem.value?.user.tutor.topics ?? [])
// const { tags: currentlyTeaching } = useTagsInList(currentlyTeachingIds)
// const appliedForIds = computed(() => (currentItem.value ? [currentItem.value.verification.id] : []))
// const { tags: appliedSubjects } = useTagsInList(appliedForIds)

// console.log(currentlyTeaching.value)
</script>
