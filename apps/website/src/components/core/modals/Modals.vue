<template>
	<SofaModal v-for="key in mStack" :key="key" v-bind="modals[key].modalArgs ?? {}" :close="() => mClose(key)">
		<component :is="modals[key].component" v-bind="modals[key].args ?? {}" :close="() => mClose(key)" />
	</SofaModal>
	<SofaModal v-for="key in pStack" :key="key" v-bind="popovers[key].modalArgs ?? {}" :close="() => pClose(key)">
		<component :is="popovers[key].component" v-bind="popovers[key].args ?? {}" :close="() => pClose(key)" />
	</SofaModal>
</template>

<script lang="ts" setup>
import { modal, popover } from '@/composables/core/modal'
import { SofaModal2 as SofaModal } from 'sofa-ui-components'

const { modals, stack: mStack, close: mClose } = modal
const { popovers, stack: pStack, close: pClose } = popover
</script>
