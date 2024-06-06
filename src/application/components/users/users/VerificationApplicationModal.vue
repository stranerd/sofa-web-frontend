<template>
	<div>
		<div class="header flex justify-between p-4">
			<SofaHeading content="Verification application" />
			<div class="flex items-center justify-end w-1/2 border-l border-lightGray px-4 gap-2">
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
			<div class="space-y-2">
				<SofaHeading :content="verificationRequest.userId" />
				<SofaText content="This is a description" />
			</div>
			<div class="space-y-2">
				<SofaHeading content="Links" />
				<div class="flex items-center gap-4">
					<div v-for="i in 3" :key="i" class="flex items-center gap-2">
						<SofaIcon name="socials-facebook" class="bg-primaryBlue" />
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
		<div class="footer flex justify-between p-4">
			<SofaButton bgColor="bg-primaryRed" padding="py-3 px-4">Reject</SofaButton>
			<SofaButton bgColor="bg-primaryGreen" padding="py-3 px-4">Accept</SofaButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { VerificationEntity, UserEntity } from '@modules/users'

defineProps<{
	close: () => void
	verificationRequest: VerificationEntity
	user: UserEntity
	currentIndex: number
	totalItems: number
	onNext?: () => void
	onPrevious?: () => void
}>()
</script>

<style scoped></style>
