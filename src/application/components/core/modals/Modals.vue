<template>
	<SofaModal
		v-for="key in modals"
		:key="key"
		:event="modalsDef[key].event"
		v-bind="stripKeys(modalsDef[key].modalArgs ?? {}, ['popover', 'closeOnClickOutside'])"
		:close="(modalsDef[key].modalArgs?.closeOnClickOutside ?? false) ? () => close(key) : undefined">
		<component :is="modalsDef[key].component" v-bind="modalsDef[key].args ?? {}" :close="() => close(key)" />
	</SofaModal>
	<SofaModal
		v-for="key in popovers"
		:key="key"
		:popover="true"
		:event="modalsDef[key].event"
		maxWidth="mdlg:!w-auto"
		v-bind="stripKeys(modalsDef[key].modalArgs ?? {}, ['popover', 'closeOnClickOutside'])"
		:close="(modalsDef[key].modalArgs?.closeOnClickOutside ?? true) ? () => close(key) : undefined">
		<component :is="modalsDef[key].component" v-bind="modalsDef[key].args ?? {}" :close="() => close(key)" />
	</SofaModal>
	<SofaConfirm
		v-for="confirmation in $utils.confirmations"
		:key="confirmation.id"
		v-bind="confirmation"
		:close="() => confirmation.close(false)"
		:left="{
			label: confirmation.left?.label ?? 'No',
			hide: confirmation.left?.hide,
			bgColor: confirmation.left?.bg,
			textColor: confirmation.left?.color,
			isClose: true,
			action: () => confirmation.close(false),
		}"
		:right="{
			label: confirmation.right?.label ?? 'Yes',
			hide: confirmation.right?.hide,
			bgColor: confirmation.right?.bg,
			textColor: confirmation.right?.color,
			isClose: false,
			action: () => confirmation.close(true),
		}" />
	<SofaPrompt
		v-for="prompt in $utils.prompts"
		:key="prompt.id"
		v-bind="prompt"
		:close="() => prompt.close(undefined)"
		:left="{
			label: prompt.left?.label ?? 'No',
			hide: prompt.left?.hide,
			bgColor: prompt.left?.bg,
			textColor: prompt.left?.color,
			isClose: true,
			action: () => prompt.close(undefined),
		}"
		:right="{
			label: prompt.right?.label ?? 'Yes',
			hide: prompt.right?.hide,
			bgColor: prompt.right?.bg,
			textColor: prompt.right?.color,
			isClose: false,
			action: (message) => prompt.close(message),
		}" />
	<SofaSuccess
		v-for="success in $utils.successes"
		:key="success.id"
		v-bind="success"
		:close="() => success.close(false)"
		:button="{
			label: success.button?.label ?? 'Ok',
			hide: success.button?.hide,
			bgColor: success.button?.bg,
			textColor: success.button?.color,
			action: () => success.close(true),
		}" />
	<SofaAlert
		v-for="(alert, i) in $utils.loaderSetup.alerts"
		:key="i"
		:close="() => $utils.loaderSetup.alerts.splice(i, 1)"
		:content="alert.message"
		:type="alert.type" />
	<div
		v-if="$utils.loaderSetup.loading || $utils.loaderSetup.loaders.length"
		class="fixed top-0 left-0 h-full w-full bg-black opacity-80 z-[100000000000] cursor-not-allowed">
		<div class="loader-bar" />
	</div>
</template>

<script lang="ts" setup>
import { modal } from '@app/composables/core/modal'
import { SofaPrompt } from 'sofa-ui-components'

const { modals, popovers, modalsDef, close } = modal

const stripKeys = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]) =>
	Object.keys(obj).reduce((acc, key: keyof T) => {
		if (!keys.includes(key)) acc[key] = obj[key]
		return acc
	}, {} as T)
</script>
