<template>
	<div class="flex flex-col gap-4">
		<div class="w-full flex items-center justify-between border-b border-lightGray pb-2">
			<SofaHeading size="title"> Transaction history </SofaHeading>
			<SofaIcon class="h-[20px]" name="calendar" />
		</div>

		<div v-if="transactions.length" class="w-full flex flex-col gap-2">
			<a
				v-for="(transaction, index) in transactions"
				:key="transaction.hash"
				class="w-full flex flex-col gap-1 pb-2"
				:class="{ 'border-b border-lightGray': index !== transactions.length - 1 }"
				@click="showTransaction(transaction)">
				<div class="w-full flex items-center justify-between">
					<SofaText :content="transaction.title" />
					<SofaHeading :class="transaction.color">
						{{ $utils.formatPrice(transaction.amount, transaction.currency) }}
					</SofaHeading>
				</div>
				<SofaText :content="$utils.formatTime(transaction.createdAt)" />
			</a>
			<a
				v-if="hasMore"
				class="w-full flex items-center justify-center border-t border-lightGray pt-3"
				@click="fetchOlderTransactions">
				<SofaText class="text-primaryPink">Load more</SofaText>
			</a>
		</div>

		<SofaEmptyState v-else title="No transaction yet" subTitle="All you wallet transaction would show up here" />
	</div>
</template>

<script lang="ts" setup>
import { useModals } from '@app/composables/core/modals'
import { useMyTransactions } from '@app/composables/payment/transactions'
import { TransactionEntity } from '@modules/payment'

const { transactions, hasMore, fetchOlderTransactions } = useMyTransactions()

const showTransaction = (transaction: TransactionEntity) => {
	useModals().payment.transactionDetails.open({ transaction })
}
</script>
