<template>
	<AdminLayout title="Tutors">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center py-1">
				<SofaHeading content="Tutor applications" class="px-4 w-[60%]" />
				<form class="py-1 w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
				<div class="flex items-center w-[20%] border-l border-lightGray px-4 gap-2">
					<div>1-10 of 50</div>
					<span class="flex-1" />
					<SofaIcon class="h-[20px]" name="alt-arrow-left" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon class="h-[20px]" name="alt-arrow-right" />
				</div>
			</div>
			<div class="px-1 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{ id: 'teacher', key: (d) => d.tutorApplication.userId, label: 'Teacher', class: 'w-[60%]' },
						{
							id: 'applied',
							key: (d) => $utils.formatTime(d.tutorApplication.createdAt),
							label: 'Applied',
							class: 'text-grayColor w-[20%]',
						},
						{ id: 'action', key: () => 'Reject', label: 'Action', class: 'text-grayColor w-[20%]' },
					]"
					:data="data"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')"
					@displayData="handleActionClick">
					<template #data-action>
						<div class="flex items-center justify-between">
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1">Reject</SofaButton>
							<SofaButton bgColor="bg-none" textColor="text-primaryGreen" padding="py-1">Accept</SofaButton>
						</div>
					</template>
				</SofaTable>
			</div>
			<div class="p-4 flex justify-between items-center w-full">
				<SofaText content="Bulk actions:" class="text-grayColor font-bold" />
				<div class="flex items-center">
					<SofaButton bgColor="bg-white" textColor="text-primaryRef" padding="px-4 py-1"> Reject all </SofaButton>
					<SofaButton bgColor="bg-white" textColor="text-primaryGreen" padding="px-4 py-1"> Accept all </SofaButton>
				</div>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useModals } from '@app/composables/core/modals'
import { TutorRequestEntity, UserEntity } from '@modules/users'

const data: { tutorApplication: TutorRequestEntity; user: UserEntity }[] = [
	{
		tutorApplication: new TutorRequestEntity({
			id: '1',
			userId: '2768379',
			pending: false,
			accepted: null,
			testId: '1',
			testFinished: false,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			topicId: '552',
			verification: {
				name: 'tyyuoi',
				type: '',
				size: 0,
				path: '',
				timestamp: 0,
				duration: 0,
				link: '',
			},
			qualification: [],
		}),
		user: new UserEntity({
			id: '',
			bio: {},
			roles: '',
			account: {
				// ... account data
			},
			status: {
				// ... status data
			},
			dates: {
				createdAt: 0,
				deletedAt: 0,
			},
			type: null,
			tutor: {
				conversations: [],
				topics: [],
			},
			ai: {
				photo: null,
				name: '',
				tagline: '',
			},
			socials: [],
			location: null,
		}),
	},
	{
		tutorApplication: new TutorRequestEntity({
			id: '2',
			userId: '2877837',
			pending: false,
			accepted: null,
			testId: '1',
			testFinished: false,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			topicId: '552',
			verification: {
				name: 'tyyuoi',
				type: '',
				size: 0,
				path: '',
				timestamp: 0,
				duration: 0,
				link: '',
			},
			qualification: [],
		}),
		user: new UserEntity({
			id: '',
			bio: {},
			roles: '',
			account: {
				// ... account data
			},
			status: {
				// ... status data
			},
			dates: {
				createdAt: 0,
				deletedAt: 0,
			},
			type: null,
			tutor: {
				conversations: [],
				topics: [],
			},
			ai: {
				photo: null,
				name: '',
				tagline: '',
			},
			socials: [],
			location: null,
		}),
	},
]
const handleActionClick = (item: T, index: number) => {
	useModals().users.tutorApplication.open({
		tutorRequest: item.tutorApplication,
		user: item.user, // pass the user data here
		currentIndex: index,
		totalItems: data.length,
		onNext: () => {},
		onPrevious: () => {},
	})
	console.log(item, index)
}
</script>

<style scoped></style>
