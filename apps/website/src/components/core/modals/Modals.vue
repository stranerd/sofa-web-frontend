<template>
	<component
		:is="modals[key].component"
		v-for="key in modalStack"
		:key="key"
		v-bind="modals[key].args ?? {}"
		:close="() => modalClose(key)" />
	<component
		:is="popovers[key].component"
		v-for="key in popoverStack"
		:key="key"
		v-bind="popovers[key].args ?? {}"
		:close="() => popoverClose(key)" />
</template>

<script lang="ts" setup>
import { modal, popover } from '@/composables/core/modal'

const { modals, stack: modalStack, close: modalClose } = modal
const { popovers, stack: popoverStack, close: popoverClose } = popover
</script>
