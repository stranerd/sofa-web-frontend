<template>
	<SofaTextField
		v-for="(item, index) in factory.getSocials()"
		:key="index"
		v-model="item.link"
		:placeholder="`Enter ${item.ref} link`"
		type="url"
		:error="item.error"
		custom-class="rounded-custom !bg-lightGray">
		<template #inner-prefix>
			<SofaIcon :name="socials[item.ref]" class="h-[20px]" />
		</template>
		<template #inner-suffix>
			<SofaIcon name="trash" class="h-[16px]" @click="deleteItem(index)" />
		</template>
	</SofaTextField>

	<div class="w-full flex flex-col gap-3">
		<a
			class="w-full flex items-center justify-between gap-3 p-3 rounded-custom border-2 border-darkLightGray"
			@click="showAddNewItems = !showAddNewItems">
			<div class="flex items-center gap-3">
				<SofaIcon name="box-plus" class="h-[20px]" />
				<SofaNormalText color="text-grayColor" content="Add link" />
			</div>

			<SofaIcon class="h-[7px]" :name="showAddNewItems ? 'chevron-up' : 'chevron-down'" />
		</a>

		<div v-if="showAddNewItems" class="w-full flex flex-col gap-2">
			<a
				v-for="(icon, key) in socials"
				:key="key"
				class="w-full flex items-center justify-start gap-3 p-3 rounded-custom border-2 border-darkLightGray"
				@click="factory.addNewSocial(key)">
				<SofaIcon :name="icon" class="h-[20px]" />
				<SofaNormalText color="text-grayColor" class="capitalize" :content="key" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { socials } from '@app/composables/users/profile'
import { UserSocialsFactory } from '@modules/users'
import { Logic } from 'sofa-logic'
import { ref } from 'vue'

const props = defineProps<{
	factory: UserSocialsFactory
}>()

const deleteItem = async (index: number) => {
	const confirm = await Logic.Common.confirm({
		title: 'Are you sure?',
		sub: 'This action is permanent. The saved social link would be lost',
		right: { label: 'Yes, delete' },
	})
	if (!confirm) return
	props.factory.removeSocial(index)
}

const showAddNewItems = ref(false)
</script>
