<template>
	<SofaModal>
		<div class="flex flex-col items-center">
			<div class="w-full flex flex-col h-full gap-3 md:gap-4 mdlg:px-6 md:px-4 overflow-y-auto">
				<div
					class="w-full flex flex-col justify-between items-center sticky top-0 left-0 bg-white z-1 border-lightGray border-b md:border-0 p-4 md:gap-2">
					<SofaHeaderText class="text-xl hidden md:inline-block " content="Add a tutor" />

					<div class="flex w-full md:hidden items-center gap-2 justify-between">
						<SofaHeaderText class="!font-bold" content="Add a tutor" />
						<SofaIcon class="h-[16px]" name="circle-close" @click="emits('close')" />
					</div>

					<div class="w-full grid grid-cols-3 gap-2 py-3">
						<div class="col-span-1 h-2 rounded-full" v-for="(_, index) in 3" :key="index"
							:class="index <= currentStep ? 'bg-deepGray' : 'bg-darkLightGray'" />
					</div>

					<div class="w-full flex flex-col pt-3" v-if="currentStep === 2">
						<SofaSelect placeholder="Select subject" padding="px-2 py-4" customClass="rounded-custom border"
							:options="allTopics" :autoComplete="true" v-model="selectedTopic">
						</SofaSelect>
					</div>
				</div>

				<template v-if="currentStep == 0">
					<div class="w-full flex flex-col gap-3 px-4 md:px-0">
						<SofaNormalText class="text-center mx-auto" content="What type of help do you need?" />
						<a class="w-full flex items-center justify-between p-4 rounded-custom bg-lightGray"
							v-for="(option, index) in helpOptions" :key="index" @click="selectedhelpOption = option.key">
							<SofaNormalText :color="selectedhelpOption == option.key ? 'text-primaryPurple' : 'text-grayColor'"
								:content="option.title" />
							<SofaIcon :name="selectedhelpOption == option.key ? 'selected' : 'not-selected'" class="h-[20px]" />
						</a>
						<SofaTextField padding="px-3 py-4" customClass="border rounded-custom" placeholder="Others"
							v-model="selectedhelpOptionOthers" />
					</div>
				</template>

				<template v-if="currentStep == 1">
					<div class="w-full flex flex-col gap-3 px-4 md:px-0">
						<SofaTextarea padding="px-3 py-4" customClass="bg-lightGray rounded-custom"
							placeholder="Tell the tutor why you need him/her" v-model="factory.body"
							textAreaStyle="!bg-lightGray rounded-custom">
						</SofaTextarea>
					</div>
				</template>

				<template v-if="currentStep == 2">
					<div class="w-full flex flex-col gap-3 md:px-0 px-4 flex-grow">
						<template v-if="filteredTutors.length">
							<a class="w-full rounded-custom bg-lightGray p-4 flex items-center gap-3"
								:class="{ 'border-2 border-primaryPurple': factory.tutorId === tutor.id }"
								v-for="(tutor, index) in filteredTutors" :key="index" @click="factory.tutorId = tutor.id">
								<SofaAvatar size="60" :photoUrl="tutor.photo_url" :showOnline="true" :online="tutor.online" />
								<div class="w-full flex flex-col flex-grow gap-1">
									<div class="flex gap-2 items-center">
										<SofaNormalText class="!font-bold" :content="tutor.name" />
										<SofaIcon class="h-[17px]" name="tutor-bagde" />
									</div>
									<SofaNormalText class="!line-clamp-1 !text-left" :content="tutor.subjects" />

									<div class="w-full flex gap-2 items-center">
										<SofaIcon name="star-full" class="h-[16px]" />
										<div class="flex gap-1 items-center">
											<SofaNormalText :content="tutor.ratings.value" />
											<SofaNormalText color="text-grayColor"
												:content="`(${tutor.ratings.count}) rating${tutor.ratings.count > 1 ? 's' : ''}`" />
										</div>
									</div>
								</div>
							</a>
						</template>
						<template v-else>
							<div class="flex flex-col items-center justify-center pt-3">
								<SofaNormalText color="text-grayColor" content="No tutor found for selected subject" />
							</div>
						</template>
					</div>
				</template>
			</div>

			<div class="w-full flex items-center justify-between p-4">
				<SofaButton padding="px-5 py-2" bgColor="bg-white" textColor="text-grayColor" class="hidden md:!inline-block"
					customClass="border border-gray-100" @click="emits('close')">
					Exit
				</SofaButton>

				<SofaButton class="w-full md:w-auto" :disabled="currentStep == 2 && !factory.isValid('tutorId')"
					padding="px-5 py-3 md:!py-2" @click="handleAddTutor">
					{{ currentStep == 2 ? "Send request" : "Next" }}
				</SofaButton>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import { useCreateConversation } from '@/composables/conversations/conversations'
import { useTopicsList } from '@/composables/interactions/tags'
import { useTutorsList } from '@/composables/users/users'
import { Logic } from 'sofa-logic'
import {
	SofaAvatar,
	SofaButton,
	SofaHeaderText,
	SofaIcon,
	SofaModal,
	SofaNormalText,
	SofaSelect,
	SofaTextField,
	SofaTextarea,
} from 'sofa-ui-components'
import { computed, defineEmits, ref } from 'vue'

const emits = defineEmits(['close'])

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

const allTopics = computed(() => topics.map((t) => ({
	key: t.id,
	value: t.title
})))

const filteredTutors = computed(() => tutors.value
	.filter((t) => t.tutor.topics.includes(selectedTopic.value))
	.map((t) => ({
		id: t.id,
		name: t.bio.name.full,
		online: t.status.connections.length > 0,
		photo_url: t.bio.photo?.link || '',
		ratings: {
			count: t.account.ratings.count,
			value: Logic.Common.convertToMoney(t.account.ratings.avg, false, ''),
		},
		subjects: t.tutor.topics
			.map((item) => topics.find((t) => t.id === item)?.title)
			.filter(Boolean)
			.join(', '),
	}))
)

const handleAddTutor = async () => {
	if (currentStep.value === 0) return currentStep.value = 1
	if (currentStep.value === 1 && factory.isValid('body')) return currentStep.value = 2
	if (currentStep.value === 2 && factory.isValid('tutorId')) return createConversation().then(() => emits('close'))
}
</script>
