<template>
	<SofaModal :close="Logic.Common.goBack" :canClose="false">
		<div
			class="md:w-[70%] mdlg:w-[50%] mdlg:h-full h-auto w-full flex flex-col items-center rounded-t-2xl md:rounded-2xl bg-white gap-2 p-4 md:p-8 text-bodyBlack">
			<SofaIcon v-if="hasRequested" name="checkmark-circle" class="rounded-full h-[40px]" />
			<SofaHeaderText size="xl" class="!font-bold text-deepGray"
				:content="hasRequested ? 'Request sent' : 'Request editing access'" />
			<SofaNormalText color="text-inherit"
				:content="hasRequested ? 'You will get notified when the quiz owner responds' : 'You do not have access to collaborate on this quiz'" />

			<div class="w-full flex mt-2 items-center justify-center gap-4">
				<SofaButton v-if="hasRequested" class="!w-full md:!w-auto"
					customClass="w-full md:font-semibold whitespace-nowrap" padding="py-3 md:px-6" bgColor="bg-primaryBlue"
					textColor="text-white" @click="Logic.Common.goBack">
					Done
				</SofaButton>
				<SofaButton v-if="!hasRequested" class="!w-full md:!w-auto mr-auto"
					customClass="w-full md:font-semibold whitespace-nowrap" padding="py-3 md:px-6"
					bgColor="bg-white border border-gray-100" textColor="text-grayColor" @click="Logic.Common.goBack">
					Cancel
				</SofaButton>
				<SofaButton v-if="!hasRequested" class="!w-full md:!w-auto ml-auto"
					customClass="w-full md:font-semibold whitespace-nowrap" padding="py-3 md:px-6" bgColor="bg-primaryBlue"
					textColor="text-white" @click="emits('requestAccess', true)">
					Request
				</SofaButton>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { Logic, Quiz } from 'sofa-logic'
import { SofaButton, SofaHeaderText, SofaIcon, SofaModal, SofaNormalText } from 'sofa-ui-components'
import { PropType, computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
	quiz: {
		type: Object as PropType<Quiz>,
		required: true
	}
})

const emits = defineEmits<{
	requestAccess: [add: boolean]
}>()

const { id } = useAuth()

const hasRequested = computed(() => props.quiz.access.requests.includes(id.value))
</script>