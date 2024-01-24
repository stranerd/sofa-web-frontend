<template>
	<VueTelInput v-model="phone" mode="international" class="flex" :only-countries="['ng']" @validate="update" />
</template>

<script lang="ts" setup>
import { Phone } from '@modules/auth'
import { defineEmits, defineProps, PropType, ref } from 'vue'
import { VueTelInput } from 'vue-tel-input'

const props = defineProps({
	modelValue: {
		type: Object as PropType<Phone | null>,
		default: null,
		validator: (p: any) => p === null || (typeof p.code === 'string' && typeof p.number === 'string'),
	},
})

const emit = defineEmits<{
	'update:modelValue': [phone: Phone | null]
}>()

const phone = ref((props.modelValue?.code ?? '') + (props.modelValue?.number ?? ''))
const update = (event: any) => {
	emit('update:modelValue', event.valid ? { code: '+' + event.countryCallingCode, number: event.nationalNumber } : null)
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
