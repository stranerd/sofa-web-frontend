<template>
	<table class="table-auto border-collapse">
		<thead>
			<tr>
				<SofaText v-for="(field, fieldIdx) in fields" :key="fieldIdx" as="th" :class="[field.headerClass]" class="p-2">
					<slot :name="`header-${field.id ?? fieldIdx}`">
						{{ field.label }}
					</slot>
				</SofaText>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in data" :key="index" :class="[typeof rowClass === 'function' ? rowClass(item, index) : rowClass]">
				<SofaText
					v-for="(field, fieldIdx) in fields"
					:key="fieldIdx"
					as="td"
					:class="[typeof field.class === 'function' ? field.class(item, index) : field.class]"
					class="p-2">
					<slot
						:name="`data-${field.id ?? index}`"
						:value="typeof field.key === 'function' ? field.key(item) : $utils.deepGet(item, field.key)">
						{{ typeof field.key === 'function' ? field.key(item) : $utils.deepGet(item, field.key) }}
					</slot>
				</SofaText>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts" setup generic="T">
defineProps<{
	fields: {
		id?: string
		key: Paths<T> | ((data: T) => unknown)
		label: string
		headerClass?: string
		class?: string | ((item: T, index: number) => string)
	}[]
	data: T[]
	rowClass?: string | ((item: T, index: number) => string)
}>()
</script>
