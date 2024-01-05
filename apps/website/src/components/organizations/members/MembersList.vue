<template>
	<div v-if="!members.length" class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col mdlg:flex-row gap-4 p-6">
		<div class="h-full aspect-square bg-lightGray rounded flex items-center justify-center">
			<img class="w-3/4 h-3/4" :src="image" />
		</div>
		<div class="flex flex-col gap-2">
			<SofaHeaderText color="text-inherit" size="xl" :content="`Getting started with ${label}`" />
			<div v-for="message in messages" :key="message" class="flex gap-2 items-center">
				<SofaIcon name="checkmark-circle" class="h-[16px]" />
				<SofaNormalText color="text-grayColor" :content="message" />
			</div>
			<SofaButton
				bgColor="bg-primaryBlue"
				textColor="text-white"
				class="self-start mt-2"
				padding="px-6 py-3"
				@click="emits('openAddModal', type)">
				Add {{ label }}
			</SofaButton>
		</div>
	</div>
	<div v-else class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 md:gap-6 py-4 md:py-6">
		<div class="flex gap-4 items-center px-4 md:px-6">
			<div class="flex items-center border border-darkLightGray rounded-custom pl-4 md:min-w-[300px]">
				<SofaIcon name="search" class="h-[16px]" />
				<SofaTextField v-model="searchValue" class="w-full" placeholder="Search" type="search" borderColor="!border-none" />
			</div>
			<SofaButton
				class="ml-auto"
				customClass="font-semibold"
				padding="py-3 px-6"
				bgColor="bg-primaryBlue"
				textColor="text-white"
				@click="emits('openAddModal', type)">
				Add {{ label }}
			</SofaButton>
		</div>
		<div class="w-full bg-darkLightGray h-[1px]" />
		<div class="flex flex-col gap-4 md:gap-6">
			<SofaNormalText
				v-if="!pending.length && !nonPending.length"
				color="text-inherit"
				content="No member matches the search query" />
			<template v-for="member in [...pending, ...nonPending]" :key="member.id">
				<div class="flex gap-2 items-center w-full px-4 md:px-6">
					<SofaAvatar :photoUrl="member.user?.bio.photo?.link" size="28" />
					<SofaNormalText
						color="text-inherit"
						:content="`${member.user?.bio.name.full ?? member.email}${member.pending ? ' sent a request' : ''}`"
						class="truncate flex-grow" />
					<template v-if="member.pending">
						<SofaNormalText as="a" color="text-primaryRed" content="Decline" @click="emits('acceptMember', member, false)" />
						<div class="h-full bg-darkLightGray w-[1px]" />
						<SofaNormalText as="a" color="text-primaryGreen" content="Accept" @click="emits('acceptMember', member, true)" />
					</template>
					<SofaNormalText v-else as="a" color="text-primaryRed" content="Remove" @click="emits('removeMember', member)" />
				</div>
				<div v-if="nonPending.at(-1)?.id !== member.id" class="w-full bg-darkLightGray h-[1px]" />
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { MemberEntity, MemberTypes } from '@modules/organizations'
import { SofaAvatar, SofaButton, SofaHeaderText, SofaIcon, SofaNormalText, SofaTextField } from 'sofa-ui-components'
import { PropType, computed, defineEmits, defineProps, ref } from 'vue'

const emits = defineEmits<{
	openAddModal: [type: MemberTypes]
	acceptMember: [member: MemberEntity, accept: boolean]
	removeMember: [member: MemberEntity]
}>()

const props = defineProps({
	image: {
		type: String,
		required: true,
	},
	type: {
		type: String as PropType<MemberTypes>,
		required: true,
	},
	members: {
		type: Array as PropType<MemberEntity[]>,
		required: true,
	},
	messages: {
		type: Array as PropType<string[]>,
		required: true,
	},
})

const label = computed(() => (props.type === MemberTypes.student ? 'students' : 'teachers'))

const searchValue = ref('')

const pending = computed(() => props.members.filter((m) => m.pending && m.search(searchValue.value)))
const nonPending = computed(() => props.members.filter((m) => !m.pending && m.search(searchValue.value)))
</script>
