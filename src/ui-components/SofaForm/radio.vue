<template>
	<input v-model="selected" type="radio" :value="value" :name="name" class="form-radio size-4" />
</template>

<script lang="ts" setup generic="T">
defineProps<{
	value: T
	name: string
}>()

const selected = defineModel<T>()
</script>
