<template>
	<VueTelInput v-model="phone" mode="international" class="flex" :onlyCountries="['ng']" @validate="update" />
</template>

<script lang="ts" setup>
import { Phone } from '@modules/auth'
import { ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VueTelInput } from 'vue-tel-input'

const model = defineModel<Phone | null>({ default: null })

const phone = ref((model.value?.code ?? '') + (model.value?.number ?? ''))
const update = (event: any) => {
	model.value = event.valid ? { code: '+' + event.countryCallingCode, number: event.nationalNumber } : null
}
</script>

<style>
@import 'vue-tel-input/vue-tel-input.css';

.vti__dropdown.open,
.vti__dropdown.disabled,
.vti__dropdown:hover,
.vti__dropdown-list,
.vti__input,
.vti__dropdown-item.highlighted {
	background-color: inherit !important;
}

.vti__selection .vti__country-code,
.vti__dropdown-arrow {
	color: inherit !important;
}
</style>
