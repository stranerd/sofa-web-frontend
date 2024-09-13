<template>
	<input v-model="selected" type="radio" :value="value" :name="name" :class="['form-radio size-4', color]" />
</template>

<script lang="ts" setup generic="T">
defineProps<{
	value: T
	name: string
	color?: string
}>()

const selected = defineModel<T>()
</script>
