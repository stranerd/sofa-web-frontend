<template>
	<dashboard-layout :middleSessionWidth="'lg:w-[78%] mdlg:w-[75%]'" :topbarOptions="{ title }">
		<div
			class="mdlg:hidden w-full flex items-center gap-3 z-[99999999] justify-between bg-backgroundGray p-4 sticky top-0 left-0">
			<sofa-icon customClass="h-[15px]" :name="'back-arrow'" @click="Logic.Common.goBack()" />
			<sofa-normal-text customClass="!font-bold !text-base">{{ title }}</sofa-normal-text>
			<span />
		</div>

		<div v-if="!index" class="mdlg:hidden w-full">
			<slot />
		</div>

		<template v-slot:left-session>
			<div class="w-full shadow-custom bg-white rounded-[16px] flex flex-col py-4 px-3 gap-2">
				<router-link class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-[#E5F2FD]"
					v-for="item in libraryOptions" :key="item.routePath" :to="item.routePath"
					exact-active-class="bg-[#E5F2FD] !font-bold">
					<sofa-icon :name="item.icon" :custom-class="'h-[17px]'" />
					<sofa-normal-text>{{ item.title }}</sofa-normal-text>
				</router-link>

				<div class="w-full flex flex-row items-center justify-between px-2 mt-3 mb-2">
					<sofa-normal-text :customClass="'!font-bold'">Folders</sofa-normal-text>
					<sofa-normal-text :color="'text-primaryPink'" customClass="cursor-pointer"
						@click="addFolder">Add</sofa-normal-text>
				</div>

				<router-link
					class="w-full flex flex-row items-center justify-start gap-3 p-3 relative rounded-[8px] hover:bg-[#E5F2FD]"
					v-for="item in folders" :key="item.id" @mouseenter="item.hover = true" :to="`/libraries/${item.id}`"
					exact-active-class="bg-[#E5F2FD]" @mouseleave="item.hover = false">
					<sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />

					<sofa-custom-input v-if="item.edit"
						custom-class="lg:text-sm mdlg:text-[12px] text-xs w-full cursor-text !bg-white"
						:updateValue="item.name" placeholder="Folder name" @blur="() => {
							item.edit = false
							handleFolderNameBlur()
						}" @onContentChange="(content) => {
	item.name = content
	currentFolder.name = content
	currentFolder.id = item.id
}" />
					<sofa-normal-text v-else>{{ item.name }}</sofa-normal-text>

					<div v-if="item.hover && !item.edit"
						class="absolute right-0 top-0 h-full px-3 justify-center bg-[#E5F2FD] rounded-r-[8px] flex flex-row gap-2 items-center">
						<sofa-icon @click.stop="item.edit = true" customClass="h-[15px] cursor-pointer" name="edit-gray" />
						<sofa-icon customClass="h-[15px] cursor-pointer" name="trash-gray"
							@click.stop="showDeleteFolder = true" />
					</div>
				</router-link>

				<template v-if="allOrganizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text customClass="!font-bold">Organizations</sofa-normal-text>
					</div>
					<router-link
						class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-[#E5F2FD]"
						:to="`/libraries/${item.id}`" v-for="item in allOrganizations" :key="item.id"
						exact-active-class="bg-[#E5F2FD]">
						<sofa-icon :name="'organization'" :custom-class="'h-[20px]'" />
						<sofa-normal-text>{{ item.name }}</sofa-normal-text>
					</router-link>
				</template>
			</div>
		</template>

		<template v-slot:middle-session>
			<div class="w-full flex flex-col gap-4 px-4 mdlg:!hidden">
				<div class="px-2 bg-white flex flex-col shadow-custom custom-border">
					<router-link :to="item.routePath"
						class="w-full flex items-center justify-start gap-3 p-4 border-b border-[#F1F6FA]"
						v-for="item in libraryOptions" :key="item.routePath">
						<sofa-icon :name="item.icon" :custom-class="'h-[16px]'" />
						<sofa-normal-text>{{ item.title }}</sofa-normal-text>
					</router-link>
				</div>

				<div class="w-full flex flex-col gap-2">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text :customClass="'!font-bold'">Folders</sofa-normal-text>
						<sofa-normal-text :color="'text-primaryPink'" @click="addFolder()">Add</sofa-normal-text>
					</div>

					<component :is="item.edit ? 'span' : 'router-link'"
						class="w-full flex items-center relative justify-between gap-3 p-4 custom-border bg-white shadow-custom"
						v-for="item in folders" :key="item.id" :to="`/libraries/${item.id}`">
						<div class="flex items-center gap-3 w-full">
							<sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />
							<sofa-custom-input v-if="item.edit" :updateValue="item.name" :placeholder="'Folder name'"
								custom-class="lg:text-sm mdlg:text-[12px] text-xs w-full !py-1 !bg-backgroundGray rounded cursor-text"
								@blur="
									item.edit = false
								handleFolderNameBlur();
								" @onContentChange="(content) => {
									item.name = content
									currentFolder.name = content
									currentFolder.id = item.id
								}" />
							<sofa-normal-text v-else>{{ item.name }}</sofa-normal-text>
						</div>

						<div v-if="!item.edit" class="h-full justify-center flex gap-2 items-center">
							<sofa-icon @click.stop="item.edit = true" :customClass="'h-[15px] cursor-pointer'" :name="'edit-gray'" />
							<sofa-icon :customClass="'h-[15px] cursor-pointer'" :name="'trash-gray'" @click.stop="showDeleteFolder = true" />
						</div>
					</component>
				</div>

				<template v-if="allOrganizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text customClass="!font-bold">Organizations</sofa-normal-text>
					</div>
					<router-link
						class="w-full flex items-center relative justify-between gap-2 p-4 custom-border bg-white shadow-custom"
						:to="`/libraries/${item.id}`" v-for="item in allOrganizations" :key="item.id"
						exact-active-class="bg-[#E5F2FD]">
						<sofa-icon :name="'organization'" :custom-class="'h-[20px]'" />
						<sofa-normal-text>{{ item.name }}</sofa-normal-text>
					</router-link>
				</template>
			</div>
		</template>
	</dashboard-layout>
</template>

<script setup lang="ts">
import { scrollToTop } from '@/composables'
import { AllFolders, addFolder, currentFolder, folders, handleFolderNameBlur, setFolders, showDeleteFolder } from '@/composables/library'
import { libraryOptions } from '@/composables/settings'
import { Logic } from "sofa-logic"
import { Conditions } from 'sofa-logic/src/logic/types/common'
import { SingleUser } from 'sofa-logic/src/logic/types/domains/users'
import { SofaCustomInput, SofaIcon, SofaNormalText } from "sofa-ui-components"
import { defineProps, onMounted, ref, watch } from 'vue'

defineProps({
	title: {
		type: String,
		required: true
	},
	index: {
		type: Boolean,
		required: false,
		default: false
	}
})

const UserProfile = ref(Logic.Users.UserProfile)
const allOrganizations = ref<{ id: string; name: string; subscribed: boolean }[]>([])

const setOrganizations = async () => {
	const users: SingleUser[] = await Logic.Users.GetUsers({
		where: [
			{
				field: 'id',
				value: Logic.Users.UserProfile.account.organizationsIn,
				condition: Conditions.in,
			},
		],
	})
	allOrganizations.value = users.map((item) => ({
		id: item.id,
		name: item.type?.name ?? item.bio.name.full,
		subscribed: item.roles.isSubscribed,
	}))
}

watch(AllFolders, () => {
	setFolders()
})

watch(UserProfile, () => {
	setOrganizations()
})

onMounted(async () => {
	scrollToTop()
	Logic.Study.watchProperty("UserProfile", UserProfile)
	Logic.Study.watchProperty("AllFolders", AllFolders)
	await Logic.Study.GetFolders({
		where: [
			{
				field: "user.id",
				value: Logic.Auth.AuthUser?.id,
				condition: Conditions.eq,
			},
		],
	})
	setOrganizations()
})
</script>