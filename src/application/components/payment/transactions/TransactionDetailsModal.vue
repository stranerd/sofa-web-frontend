<template>
	<div class="flex flex-col gap-4 mdlg:p-6 p-4">
		<div class="w-full hidden justify-between items-center mdlg:flex">
			<SofaHeaderText class="text-xl"> Transaction details </SofaHeaderText>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden py-2 border-lightGray border-b">
			<SofaNormalText class="!font-bold !text-base"> Transaction details </SofaNormalText>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col p-4 justify-start border-2 border-darkLightGray rounded-custom">
			<SofaNormalText class="capitalize" :content="transaction.label" />
			<SofaHeaderText
				class="mdlg:!text-3xl !text-2xl"
				:content="Logic.Common.formatPrice(transaction.amount, transaction.currency)" />
		</div>

		<div class="w-full flex flex-col gap-4 py-4 md:pb-0">
			<div v-for="detail in details" :key="detail.label" class="w-full flex items-center justify-between">
				<SofaNormalText color="text-grayColor" :content="detail.label" />
				<SofaNormalText class="!font-semibold" color="text-deepGray" :content="detail.value" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { TransactionEntity } from '@modules/payment'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	close: () => void
	transaction: TransactionEntity
}>()

const details = computed(() => [
	{ label: 'Amount', value: Logic.Common.formatPrice(props.transaction.originalAmount, props.transaction.currency) },
	...(props.transaction.serviceAmount > 0
		? [
				{
					label: 'Commission',
					value: Logic.Common.formatPrice(props.transaction.serviceAmount, props.transaction.currency),
				},
			]
		: []),
	{ label: 'Title', value: props.transaction.title },
	{ label: 'Time', value: formatTime(props.transaction.createdAt) },
])
</script>
