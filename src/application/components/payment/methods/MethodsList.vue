<template>
	<div class="flex flex-col gap-4">
		<SofaHeading size="title"> Payment methods </SofaHeading>

		<a class="w-full flex items-center gap-3 p-3 text-grayColor" @click="addMethod">
			<SofaIcon class="h-[18px] fill-current" name="add" />
			<SofaText>Add credit or debit card</SofaText>
		</a>

		<MethodListCard v-for="method in methods" :key="method.hash" :method="method" />
	</div>
</template>

<script lang="ts" setup>
import { useMyMethods } from '@app/composables/payment/methods'
const { methods, addMethod } = useMyMethods()
</script>
