<template>
	<div class="flex flex-col items-center gap-2 p-4 md:p-8">
		<SofaIcon v-if="hasRequested" name="checkmark-circle" class="rounded-full h-[40px]" />
		<SofaHeaderText size="xl" class="!font-bold text-deepGray" :content="hasRequested ? 'Request sent' : 'Request editing access'" />
		<SofaNormalText
			color="text-inherit"
			:content="
				hasRequested ? 'You will get notified when the quiz owner responds' : 'You do not have access to collaborate on this quiz'
			" />

		<div class="w-full flex mt-2 items-center justify-center gap-4">
			<SofaButton
				v-if="hasRequested"
				class="w-full md:w-auto"
				customClass="md:font-semibold"
				padding="py-3 md:px-6"
				bgColor="bg-primaryBlue"
				textColor="text-white"
				@click="$utils.goBack">
				Done
			</SofaButton>
			<SofaButton
				v-if="!hasRequested"
				class="w-full md:w-auto mr-auto"
				customClass="md:font-semibold"
				padding="py-3 md:px-6"
				bgColor="bg-white border border-gray-100"
				textColor="text-grayColor"
				@click="$utils.goBack">
				Cancel
			</SofaButton>
			<SofaButton
				v-if="!hasRequested"
				class="w-full md:w-auto ml-auto"
				customClass="md:font-semibold"
				padding="py-3 md:px-6"
				bgColor="bg-primaryBlue"
				textColor="text-white"
				@click="requestAccess(true)">
				Request
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { QuizEntity } from '@modules/study'

const props = defineProps<{
	quiz: QuizEntity
	requestAccess: (add: boolean) => Promise<void>
}>()

const { id } = useAuth()

const hasRequested = computed(() => props.quiz.access.requests.includes(id.value))
</script>
