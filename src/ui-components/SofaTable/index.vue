<template>
	<table class="table-auto border-collapse">
		<thead>
			<tr>
				<SofaText
					v-for="(field, fieldIdx) in allFields"
					:key="fieldIdx"
					as="th"
					:class="[field.headerClass, headClass]"
					class="p-4">
					<slot :name="`header-${field.id ?? fieldIdx}`">
						{{ field.label }}
					</slot>
				</SofaText>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="(item, index) in data"
				:key="index"
				class="cursor-pointer"
				:class="[typeof rowClass === 'function' ? rowClass(item, index) : rowClass]"
				@click.stop.prevent="onRowClick?.(item, index)">
				<SofaText
					v-for="(field, fieldIdx) in allFields"
					:key="fieldIdx"
					as="td"
					:class="[typeof field.class === 'function' ? field.class(item, index) : field.class]"
					class="p-4"
					@click.stop.prevent="field.onClick?.(item, index)">
					<slot
						:name="`data-${field.id ?? index}`"
						:data="item"
						:value="typeof field.key === 'function' ? field.key(item) : $utils.deepGet(item, field.key)">
						{{ typeof field.key === 'function' ? field.key(item) : $utils.deepGet(item, field.key) }}
					</slot>
				</SofaText>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts" setup generic="T">
const props = defineProps<{
	fields: {
		id?: string
		key: Paths<T> | ((data: T) => unknown)
		label: string
		headerClass?: string
		class?: string | ((data: T, index: number) => string)
		hide?: boolean
		onClick?: (data: T, index: number) => void
	}[]
	data: T[]
	headClass?: string
	rowClass?: string | ((data: T, index: number) => string)
	onRowClick?: (data: T, index: number) => void
}>()

const allFields = props.fields.filter((field) => !field.hide)
</script>
