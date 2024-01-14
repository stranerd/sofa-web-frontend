<template>
	<SofaModal
		v-for="key in modals"
		:key="key"
		v-bind="modalsDef[key].modalArgs ?? {}"
		:close="modalsDef[key].modalArgs?.closeOnClickOutside ?? false ? () => close(key) : undefined">
		<component :is="modalsDef[key].component" v-bind="modalsDef[key].args ?? {}" :close="() => close(key)" />
	</SofaModal>
	<SofaModal
		v-for="key in popovers"
		:key="key"
		v-bind="modalsDef[key].modalArgs ?? {}"
		:close="modalsDef[key].modalArgs?.closeOnClickOutside ?? true ? () => close(key) : undefined">
		<component :is="modalsDef[key].component" v-bind="modalsDef[key].args ?? {}" :close="() => close(key)" />
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
import { modal } from '@app/composables/core/modal'
import { Logic } from 'sofa-logic'

const { modals, popovers, modalsDef, close } = modal

const loaderSetup = Logic.Common.loaderSetup
const confirmations = Logic.Common.confirmations
const successes = Logic.Common.successes
</script>
