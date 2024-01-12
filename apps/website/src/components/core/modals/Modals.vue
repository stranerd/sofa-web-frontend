<template>
	<SofaModal
		v-for="key in mStack"
		:key="key"
		v-bind="modals[key].modalArgs ?? {}"
		:close="modals[key].modalArgs?.closeOnClickOutside ?? false ? () => mClose(key) : null">
		<component :is="modals[key].component" v-bind="modals[key].args ?? {}" :close="() => mClose(key)" />
	</SofaModal>
	<SofaModal
		v-for="key in pStack"
		:key="key"
		v-bind="popovers[key].modalArgs ?? {}"
		:close="popovers[key].modalArgs?.closeOnClickOutside ?? true ? () => pClose(key) : null">
		<component :is="popovers[key].component" v-bind="popovers[key].args ?? {}" :close="() => pClose(key)" />
	</SofaModal>
	<SofaDeletePrompt
		v-for="confirmation in confirmations"
		:key="confirmation.id"
		:title="confirmation.title"
		:sub-title="confirmation.sub"
		:close="() => confirmation.close(false)"
		:buttons="[
			{
				label: confirmation.left?.label ?? 'No',
				hide: confirmation.left?.hide,
				bgColor: confirmation.left?.bg,
				textColor: confirmation.left?.color,
				isClose: true,
				action: () => confirmation.close(false),
			},
			{
				label: confirmation.right?.label ?? 'Yes',
				hide: confirmation.right?.hide,
				bgColor: confirmation.right?.bg,
				textColor: confirmation.right?.color,
				isClose: false,
				action: () => confirmation.close(true),
			},
		]" />
	<SofaSuccessPrompt
		v-for="confirmation in successes"
		:key="confirmation.id"
		:title="confirmation.title"
		:sub-title="confirmation.sub"
		:close="() => confirmation.close(false)"
		:button="{
			label: confirmation.button?.label ?? 'Ok',
			hide: confirmation.button?.hide,
			bgColor: confirmation.button?.bg,
			textColor: confirmation.button?.color,
			action: () => confirmation.close(true),
		}" />
	<SofaAlert
		v-for="(alert, i) in loaderSetup.alerts"
		:key="i"
		:close="() => loaderSetup.alerts.splice(i, 1)"
		:content="alert.message"
		:type="alert.type" />
	<div
		v-if="loaderSetup.loading || loaderSetup.loaders.length"
		class="fixed top-0 left-0 h-full w-full bg-black opacity-80 z-[100000000000] cursor-not-allowed">
		<div class="loader-bar" />
	</div>
</template>

<script lang="ts" setup>
import { modal, popover } from '@/composables/core/modal'
import { Logic } from 'sofa-logic'
import { SofaAlert, SofaDeletePrompt, SofaModal2 as SofaModal, SofaSuccessPrompt } from 'sofa-ui-components'

const { modals, stack: mStack, close: mClose } = modal
const { popovers, stack: pStack, close: pClose } = popover

const loaderSetup = Logic.Common.loaderSetup
const confirmations = Logic.Common.confirmations
const successes = Logic.Common.successes
</script>
