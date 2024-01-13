<template>
	<SofaModal>
		<div class="flex flex-col items-center gap-2 p-4 md:p-8">
			<SofaIcon v-if="hasRequested" name="checkmark-circle" class="rounded-full h-[40px]" />
			<SofaHeaderText
				size="xl"
				class="!font-bold text-deepGray"
				:content="hasRequested ? 'Request sent' : 'Request editing access'" />
			<SofaNormalText
				color="text-inherit"
				:content="
					hasRequested
						? 'You will get notified when the quiz owner responds'
						: 'You do not have access to collaborate on this quiz'
				" />

			<div class="w-full flex mt-2 items-center justify-center gap-4">
				<SofaButton
					v-if="hasRequested"
					class="w-full md:w-auto"
					custom-class="md:font-semibold"
					padding="py-3 md:px-6"
					bg-color="bg-primaryBlue"
					text-color="text-white"
					@click="Logic.Common.goBack">
					Done
				</SofaButton>
				<SofaButton
					v-if="!hasRequested"
					class="w-full md:w-auto mr-auto"
					custom-class="md:font-semibold"
					padding="py-3 md:px-6"
					bg-color="bg-white border border-gray-100"
					text-color="text-grayColor"
					@click="Logic.Common.goBack">
					Cancel
				</SofaButton>
				<SofaButton
					v-if="!hasRequested"
					class="w-full md:w-auto ml-auto"
					custom-class="md:font-semibold"
					padding="py-3 md:px-6"
					bg-color="bg-primaryBlue"
					text-color="text-white"
					@click="emits('requestAccess', true)">
					Request
				</SofaButton>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'
import { SofaButton, SofaHeaderText, SofaIcon, SofaModal2 as SofaModal, SofaNormalText } from 'sofa-ui-components'
import { PropType, computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
	quiz: {
		type: Object as PropType<QuizEntity>,
		required: true,
	},
})

const emits = defineEmits<{
	requestAccess: [add: boolean]
}>()

const { id } = useAuth()

const hasRequested = computed(() => props.quiz.access.requests.includes(id.value))
</script>
