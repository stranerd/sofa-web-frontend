<template>
	<SofaInput
		v-for="(item, index) in factory.getSocials()"
		:key="index"
		v-model="item.link"
		:placeholder="`Enter ${item.ref} link`"
		type="url"
		:error="item.error">
		<template #prefix>
			<SofaIcon :name="socials[item.ref]" class="h-5 fill-deepGray" />
		</template>
		<template #suffix>
			<SofaIcon name="trash" class="h-[16px]" @click="deleteItem(index)" />
		</template>
	</SofaInput>

	<div class="w-full flex flex-col gap-3">
		<a
			class="w-full flex items-center justify-between gap-3 p-3 rounded-custom border-2 border-darkLightGray"
			@click="showAddNewItems = !showAddNewItems">
			<div class="flex items-center gap-3 text-grayColor">
				<SofaIcon name="add" class="h-[20px] fill-current" />
				<SofaText content="Add link" />
			</div>

			<SofaIcon name="chevron-down" class="h-[7px]" :class="{ 'rotate-180': showAddNewItems }" />
		</a>

		<div v-if="showAddNewItems" class="w-full flex flex-col gap-2">
			<a
				v-for="(icon, key) in socials"
				:key="key"
				class="w-full flex items-center justify-start gap-3 p-3 rounded-custom border-2 border-darkLightGray text-grayColor"
				@click="factory.addNewSocial(key)">
				<SofaIcon :name="icon" class="h-5 fill-deepGray" />
				<SofaText class="capitalize" :content="key" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { socials } from '@app/composables/users/profile'
import { UserSocialsFactory } from '@modules/users'

const props = defineProps<{
	factory: UserSocialsFactory
}>()

const deleteItem = async (index: number) => {
	const confirm = await $utils.confirm({
		title: 'Are you sure?',
		sub: 'This action is permanent. The saved social link would be lost',
		right: { label: 'Yes, delete' },
	})
	if (!confirm) return
	props.factory.removeSocial(index)
}

const showAddNewItems = ref(false)
</script>
