<template>
	<div class="flex flex-col items-center gap-2 p-4 md:p-8">
		<SofaIcon v-if="hasRequested" name="checkmark-circle" class="rounded-full h-[40px]" />
		<SofaHeading size="title" class="text-deepGray" :content="hasRequested ? 'Request sent' : 'Request editing access'" />
		<SofaText
			:content="
				hasRequested ? 'You will get notified when the quiz owner responds' : 'You do not have access to collaborate on this quiz'
			" />

		<div class="w-full flex mt-2 items-center justify-center gap-4">
			<SofaButton v-if="hasRequested" class="w-full md:w-auto" padding="py-3 md:px-6" @click="$utils.goBack"> Done </SofaButton>
			<SofaButton
				v-if="!hasRequested"
				class="w-full md:w-auto mr-auto border border-gray-100"
				padding="py-3 md:px-6"
				color="white"
				@click="$utils.goBack">
				Cancel
			</SofaButton>
			<SofaButton v-if="!hasRequested" class="w-full md:w-auto ml-auto" padding="py-3 md:px-6" @click="requestAccess(true)">
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
