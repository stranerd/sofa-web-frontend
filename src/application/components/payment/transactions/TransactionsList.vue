<template>
	<div class="flex flex-col gap-4">
		<div class="w-full flex items-center justify-between border-b border-lightGray pb-2">
			<SofaHeaderText size="xl"> Transaction history </SofaHeaderText>
			<SofaIcon customClass="h-[20px]" name="calendar" />
		</div>

		<div v-if="transactions.length" class="w-full flex flex-col gap-2">
			<a
				v-for="(transaction, index) in transactions"
				:key="transaction.hash"
				class="w-full flex flex-col gap-1 pb-2"
				:class="{ 'border-b border-lightGray': index !== transactions.length - 1 }"
				@click="showTransaction(transaction)">
				<div class="w-full flex items-center justify-between">
					<SofaNormalText customClass="text-left">
						{{ transaction.title }}
					</SofaNormalText>
					<SofaNormalText customClass="!font-bold" :color="transaction.color">
						{{ Logic.Common.formatPrice(transaction.amount, transaction.currency) }}
					</SofaNormalText>
				</div>
				<SofaNormalText color="text-grayColor">
					{{ formatTime(transaction.createdAt) }}
				</SofaNormalText>
			</a>
			<a
				v-if="hasMore"
				class="w-full flex items-center justify-center border-t border-lightGray pt-3"
				@click="fetchOlderTransactions">
				<SofaNormalText color="text-primaryPink">Load more</SofaNormalText>
			</a>
		</div>

		<SofaEmptyState v-else title="No transaction yet" subTitle="All you wallet transaction would show up here" />
	</div>
</template>

<script lang="ts" setup>
import { useModals } from '@app/composables/core/modals'
import { useMyTransactions } from '@app/composables/payment/transactions'
import { TransactionEntity } from '@modules/payment'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'

const { transactions, hasMore, fetchOlderTransactions } = useMyTransactions()

const showTransaction = (transaction: TransactionEntity) => {
	useModals().payment.transactionDetails.open({ transaction })
}
</script>
