<template>
	<div class="w-full flex items-center gap-3 p-3 border-2 border-darkLightGray rounded-custom">
		<SofaIcon class="h-[20px]" name="atm-card" />
		<SofaText class="mr-auto"> **** **** **** {{ method.data.last4Digits }} </SofaText>
		<div class="flex items-center gap-4">
			<SofaText
				as="a"
				size="sub"
				class="px-4 py-1 rounded-[14px] text-white"
				:class="method.primary ? 'bg-primaryGreen' : 'bg-primaryPurple'"
				@click="makeMethodPrimary">
				{{ method.primary ? 'Primary' : 'Set as primary' }}
			</SofaText>
			<SofaIcon class="h-[20px]" name="remove" @click="deleteMethod" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useMethod } from '@app/composables/payment/methods'
import { MethodEntity } from '@modules/payment'

const props = defineProps<{ method: MethodEntity }>()

const { deleteMethod, makeMethodPrimary } = useMethod(props.method)
</script>
