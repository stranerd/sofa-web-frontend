<template>
	<div class="flex flex-col gap-4">
		<SofaHeaderText size="xl"> Payment methods </SofaHeaderText>

		<a class="w-full flex items-center gap-3 p-3" @click="addMethod">
			<SofaIcon customClass="h-[18px]" name="add-gray" />
			<SofaNormalText color="text-grayColor">Add credit or debit card</SofaNormalText>
		</a>

		<MethodListCard v-for="method in methods" :key="method.hash" :method="method" />
	</div>
</template>

<script lang="ts" setup>
import { useMyMethods } from '@app/composables/payment/methods'
const { methods, addMethod } = useMyMethods()
</script>
