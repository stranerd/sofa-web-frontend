<template>
	<div>
		<div class="header flex justify-between p-4">
			<SofaHeading content="Tutor application" />
			<div class="flex items-center justify-end w-3/4 border-l border-lightGray px-4 gap-2">
				<div class="inline">{{ currentIndex + 1 }}-10 of {{ totalItems }}</div>
				<SofaIcon class="h-[20px]" name="alt-arrow-left" />
				<div class="w-[2px] h-4 bg-grayColor" />
				<SofaIcon class="h-[20px]" name="alt-arrow-right" />
				<SofaIcon class="h-[16px] pr-2" name="circle-close" @click="close" />
			</div>
		</div>
		<div class="bg-primaryPurple w-full h-[100px] relative">
			<div class="rounded-full w-[100px] h-[100px] bg-white p-2 absolute -bottom-2/4 left-4 z-10">
				<SofaAvatar photoUrl="/images/auth-bg.png" :size="80" />
			</div>
		</div>
		<div class="p-6 mt-6 space-y-6">
			<div>
				<SofaHeading :content="tutorRequest.userId" />
				<SofaText content="This is a description" />
			</div>
			<div>
				<SofaHeading content="Qualification" />
				<SofaText content="This is a description" />
			</div>
			<div>
				<SofaHeading content="Verification" />
				<SofaText :content="tutorRequest.verification.name" />
			</div>
			<div>
				<SofaHeading content="Subject" />
				<div class="flex items-center gap-4">
					<div v-for="i in 2" :key="i" class="flex items-center gap-2">
						<SofaIcon name="notes" />
						<SofaText content="Chemistry" />
					</div>
				</div>
			</div>
			<div>
				<SofaHeading content="Location" />
				<SofaText :content="tutorRequest.verification.name" />
			</div>
		</div>
		<div class="footer flex justify-between p-4">
			<SofaButton bgColor="bg-primaryRed" padding="py-3 px-4">Reject</SofaButton>
			<SofaButton bgColor="bg-primaryGreen" padding="py-3 px-4">Accept</SofaButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { TutorRequestEntity, UserEntity } from '@modules/users'

defineProps<{
	close: () => void
	tutorRequest: TutorRequestEntity
	user: UserEntity
	currentIndex: number
	totalItems: number
	onNext?: () => void
	onPrevious?: () => void
}>()
</script>

<style scoped></style>
