<template>
	<SofaButton color="purple" padding="p-4" class="rounded-full fixed bottom-[4rem] right-[1.5rem]" @click="handleShowAddMaterial">
		<SofaIcon name="plus" class="fill-current" />
	</SofaButton>
</template>

<script lang="ts" setup>
import { handleShowAddMaterial } from '@app/composables/study'
</script>
