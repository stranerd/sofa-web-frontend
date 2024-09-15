<template>
	<div class="flex flex-col items-center">
		<div class="w-full flex flex-col h-full gap-3 md:gap-4 mdlg:px-6 md:px-4 overflow-y-auto">
			<div
				class="w-full flex flex-col justify-between items-center sticky top-0 left-0 bg-white z-[1] border-lightGray border-b md:border-0 p-4 md:gap-2">
				<SofaHeaderText class="text-xl hidden md:inline-block" content="Message a tutor" />

				<div class="flex w-full md:hidden items-center gap-2 justify-between">
					<SofaHeaderText class="!font-bold" content="Message a tutor" />
					<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
				</div>

				<div class="w-full grid grid-cols-3 gap-2 py-3">
					<div
						v-for="(_, index) in 3"
						:key="index"
						class="col-span-1 h-2 rounded-full"
						:class="index <= currentStep ? 'bg-deepGray' : 'bg-darkLightGray'" />
				</div>

				<div v-if="currentStep === 2" class="w-full flex flex-col pt-3">
					<SofaSelect v-model="selectedTopic" placeholder="Subject" class="!bg-white border" :options="allTopics" />
				</div>
			</div>

			<template v-if="currentStep == 0">
				<div class="w-full flex flex-col gap-3 px-4 md:px-0">
					<SofaText class="text-center mx-auto" content="What type of help do you need?" />
					<a
						v-for="option in helpOptions"
						:key="option.key"
						class="w-full flex items-center justify-between p-4 rounded-custom bg-lightGray"
						@click="selectedhelpOption = option.key">
						<SofaText
							:class="selectedhelpOption == option.key ? 'text-primaryPurple' : 'text-grayColor'"
							:content="option.title" />
						<SofaIcon :name="selectedhelpOption == option.key ? 'selected' : 'not-selected'" class="h-[20px]" />
					</a>
					<SofaTextField v-model="selectedhelpOptionOthers" customClass="border rounded-custom" placeholder="Others" />
				</div>
			</template>

			<template v-if="currentStep == 1">
				<div class="w-full flex flex-col gap-3 px-4 md:px-0">
					<SofaTextarea v-model="factory.body" placeholder="Tell the tutor why you need him/her" />
				</div>
			</template>

			<template v-if="currentStep == 2">
				<div class="w-full flex flex-col gap-3 md:px-0 px-4 grow">
					<template v-if="filteredTutors.length">
						<a
							v-for="tutor in filteredTutors"
							:key="tutor.hash"
							class="w-full rounded-custom bg-lightGray p-4 flex items-center gap-3"
							:class="{ 'border-2 border-primaryPurple': factory.tutorId === tutor.id }"
							@click="factory.tutorId = tutor.id">
							<SofaAvatar :size="60" :photoUrl="tutor.photoUrl" :online="tutor.online" />
							<div class="w-full flex flex-col grow gap-1">
								<UserName :user="tutor.user" :avatar="false" class="font-bold" />
								<SofaText clamp :content="tutor.subjects" />

								<div class="w-full flex gap-2 items-center">
									<SofaIcon name="star" class="h-[16px] fill-primaryYellow" />
									<div class="flex gap-1 items-center">
										<SofaText :content="tutor.ratings.value" />
										<SofaText :content="`(${tutor.ratings.count}) rating${tutor.ratings.count > 1 ? 's' : ''}`" />
									</div>
								</div>
							</div>
						</a>
					</template>
					<template v-else>
						<div class="flex flex-col items-center justify-center pt-3">
							<SofaText content="No tutor found for selected subject" />
						</div>
					</template>
				</div>
			</template>
		</div>

		<div class="w-full flex items-center justify-between p-4">
			<SofaButton
				padding="px-5 py-2"
				bgColor="bg-white"
				textColor="text-grayColor"
				class="hidden md:!inline-block"
				customClass="border border-gray-100"
				@click="close">
				Exit
			</SofaButton>

			<SofaButton
				class="w-full md:w-auto"
				:disabled="currentStep == 2 && !factory.isValid('tutorId')"
				padding="px-5 py-3 md:!py-2"
				@click="handleAddTutor">
				{{ currentStep == 2 ? 'Send request' : 'Next' }}
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCreateConversation } from '@app/composables/conversations/conversations'
import { useTopicsList } from '@app/composables/interactions/tags'
import { useTutorsList } from '@app/composables/users/users'
import { ConversationEntity } from '@modules/conversations'

const props = defineProps<{
	close: () => void
	conversation: ConversationEntity
}>()

const helpOptions = [
	{ title: 'Homework help', key: 'homework_help' },
	{ title: 'Explanation', key: 'explanation' },
	{ title: 'Project help', key: 'project_help' },
	{ title: 'Essay', key: 'essay' },
]

const selectedTopic = ref('')
const selectedhelpOption = ref(helpOptions[0].key)
const selectedhelpOptionOthers = ref('')
const currentStep = ref(0)

const { tutors } = useTutorsList()
const { topics } = useTopicsList()
const { factory, createConversation } = useCreateConversation()

const allTopics = computed(() =>
	topics.map((t) => ({
		key: t.id,
		value: t.title,
	})),
)

const filteredTutors = computed(() =>
	tutors.value
		.filter((t) => t.tutor.topics.includes(selectedTopic.value))
		.map((t) => ({
			id: t.id,
			name: t.publicName,
			hash: t.hash,
			user: t,
			online: t.status.connections.length > 0,
			photoUrl: t.bio.photo?.link ?? null,
			ratings: {
				count: t.account.ratings.count,
				value: window.$utils.formatNumber(t.account.ratings.avg, 2),
			},
			subjects: t.tutor.topics
				.map((item) => topics.find((t) => t.id === item)?.title)
				.filter(Boolean)
				.join(', '),
		})),
)

const handleAddTutor = async () => {
	if (currentStep.value === 0) return (currentStep.value = 1)
	if (currentStep.value === 1 && factory.isValid('body')) return (currentStep.value = 2)
	if (currentStep.value === 2 && factory.isValid('tutorId')) return createConversation().then(props.close)
}
</script>
