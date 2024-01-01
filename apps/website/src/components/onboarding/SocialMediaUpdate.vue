<template>
	<SofaTextField v-for="(item, index) in factory.socials" :key="index" :placeholder="`Add ${item[0]} link`" type="url"
		:error="factory.getUrlError(item[1])" customClass="rounded-custom !bg-lightGray !placeholder:text-grayColor"
		v-model="item[1]">
		<template v-slot:inner-prefix>
			<SofaIcon :name="socials[item[0]]" class="h-[20px]" />
		</template>
		<template v-slot:inner-suffix>
			<SofaIcon name="trash" class="h-[16px]" @click="deleteItem(index)" />
		</template>
	</SofaTextField>

	<div class="w-full flex flex-col gap-3">
		<a class="w-full flex items-center justify-between gap-3 p-3 rounded-custom border-2 border-darkLightGray"
			@click="showAddNewItems = !showAddNewItems">
			<div class="flex items-center gap-3">
				<SofaIcon name="box-plus" class="h-[20px]" />
				<SofaNormalText color="text-grayColor" content="Add link" />
			</div>

			<SofaIcon class="h-[7px]" :name="showAddNewItems ? 'chevron-up' : 'chevron-down'" />
		</a>

		<div class="w-full flex flex-col gap-2" v-if="showAddNewItems">
			<a class="w-full flex items-center justify-start gap-3 p-3 rounded-custom border-2 border-darkLightGray"
				@click="factory.addNewSocial(key)" v-for="(icon, key) in socials" :key="key">
				<SofaIcon :name="icon" class="h-[20px]" />
				<SofaNormalText color="text-grayColor" class="capitalize" :content="key" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { socials } from '@/composables/users/profile'
import { UserSocialsFactory } from '@modules/users'
import { Logic } from 'sofa-logic'
import {
	SofaIcon,
	SofaNormalText,
	SofaTextField
} from 'sofa-ui-components'
import { ref } from 'vue'

const props = defineProps({
	factory: {
		type: UserSocialsFactory,
		required: true
	}
})

const deleteItem = async (index: number) => {
	const confirm = await Logic.Common.confirm({
		title: 'Are you sure?',
		sub: 'This action is permanent. The saved social link would be lost',
		right: { label: 'Yes, delete' }
	})
	if (!confirm) return
	props.factory.removeSocial(index)
}

const showAddNewItems = ref(false)
</script>
