<template>
	<sub-page-layout v-if="!index && !Logic.Common.isLarge">
		<div class="w-full h-full flex-grow flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 z-50 justify-between bg-lightGray p-4 sticky top-0 left-0">
				<sofa-icon :custom-class="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
				<sofa-normal-text :custom-class="'!font-bold !text-base'">{{ title }}</sofa-normal-text>
				<span class="w-4" />
			</div>
			<div v-if="tabs.length">
				<div class="w-full flex flex-nowrap overflow-x-auto scrollbar-hide px-4 py-2 gap-3">
					<router-link
						v-for="(item, i) in tabs.filter((t) => !t.hide)"
						:key="item.id"
						class="px-6 py-2 rounded-custom flex items-center justify-center"
						:class="(currentTab && item.id === currentTab) || (!currentTab && i === 0) ? 'bg-primaryPurple' : 'bg-white'"
						:to="`${$route.path}?tab=${item.id}`">
						<sofa-normal-text
							:color="(currentTab && item.id === currentTab) || (!currentTab && i === 0) ? 'text-white' : 'text-deepGray'"
							:custom-class="'!font-semibold'"
							:content="item.name" />
					</router-link>
				</div>
			</div>

			<div class="w-full flex flex-col gap-3 px-4 pt-3 h-full overflow-y-auto">
				<slot />
			</div>
		</div>
	</sub-page-layout>
	<dashboard-layout v-else :topbar-options="{ title }" :hide="{ right: true }">
		<template #left-session>
			<div class="w-full shadow-custom bg-white rounded-[16px] flex flex-col py-4 px-3 gap-1">
				<router-link
					v-for="item in libraryOptions"
					:key="item.routePath"
					class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-lightBlue"
					:to="item.routePath"
					exact-active-class="bg-lightBlue font-semibold">
					<sofa-icon :name="item.icon" :custom-class="'h-[17px]'" />
					<sofa-normal-text>{{ item.title }}</sofa-normal-text>
				</router-link>

				<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
					<sofa-normal-text :custom-class="'!font-bold'">Folders</sofa-normal-text>
					<sofa-normal-text :color="'text-primaryPink'" as="a" @click="generateNewFolder">Add</sofa-normal-text>
				</div>

				<component
					:is="item.id === factory.entityId ? 'span' : 'router-link'"
					v-for="item in folders"
					:key="item.id"
					class="w-full flex items-center justify-start text-left gap-3 p-3 relative rounded-[8px] hover:bg-lightBlue group folder-link"
					:to="`/library/folders/${item.id}`"
					exact-active-class="bg-lightBlue font-semibold">
					<sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />

					<sofa-custom-input
						v-if="item.id === factory.entityId"
						v-model="factory.title"
						custom-class="lg:text-sm mdlg:text-[12px] text-xs w-full cursor-text !bg-white"
						:auto-focus="true"
						placeholder="Folder name"
						@on-blur="saveFolder"
						@on-enter="saveFolder" />
					<sofa-normal-text v-else class="truncate w-full">{{ item.title }}</sofa-normal-text>

					<div
						v-if="item.id !== factory.entityId"
						class="px-3 ml-auto justify-center rounded-r-lg hidden group-hover-[.folder-link]:flex group-focus-within-[.folder-link]:flex gap-2 items-center">
						<SofaIcon class="h-[15px] cursor-pointer" name="edit-gray" @click.stop.prevent="edit(item)" />
						<SofaIcon class="h-[15px] cursor-pointer" name="trash-gray" @click.stop.prevent="deleteFolder(item)" />
					</div>
				</component>

				<template v-if="organizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text custom-class="!font-bold">Organizations</sofa-normal-text>
					</div>
					<router-link
						v-for="item in organizations"
						:key="item.id"
						class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-lightBlue"
						:to="`/library/organizations/${item.id}`"
						exact-active-class="bg-lightBlue font-semibold">
						<sofa-icon :name="'organization'" :custom-class="'h-[20px]'" />
						<sofa-normal-text class="truncate">{{ item.name }}</sofa-normal-text>
					</router-link>
				</template>
			</div>
		</template>

		<template #middle-session>
			<div v-if="index" class="w-full flex flex-col gap-4 px-4 mdlg:!hidden">
				<div class="bg-white flex flex-col shadow-custom rounded-custom">
					<router-link
						v-for="item in libraryOptions"
						:key="item.routePath"
						:to="item.routePath"
						class="w-full flex items-center justify-start gap-3 p-4 border-b border-lightGray">
						<sofa-icon :name="item.icon" :custom-class="'h-[16px]'" />
						<sofa-normal-text>{{ item.title }}</sofa-normal-text>
					</router-link>
				</div>

				<div class="w-full flex flex-col gap-2">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text :custom-class="'!font-bold'">Folders</sofa-normal-text>
						<sofa-normal-text :color="'text-primaryPink'" @click="generateNewFolder">Add</sofa-normal-text>
					</div>

					<component
						:is="item.id === factory.entityId ? 'span' : 'router-link'"
						v-for="item in folders"
						:key="item.id"
						class="w-full flex items-center relative gap-3 p-4 rounded-custom text-left bg-white shadow-custom group folder-link"
						:to="`/library/folders/${item.id}`"
						exact-active-class="bg-lightBlue font-semibold">
						<sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />
						<sofa-custom-input
							v-if="item.id === factory.entityId"
							v-model="factory.title"
							placeholder="Folder name"
							:auto-focus="true"
							custom-class="lg:text-sm mdlg:text-[12px] text-xs w-full !py-1 !bg-lightGray rounded cursor-text"
							@on-blur="saveFolder"
							@on-enter="saveFolder" />
						<sofa-normal-text v-else class="truncate w-full">{{ item.title }}</sofa-normal-text>

						<div
							v-if="item.id !== factory.entityId"
							class="ml-auto justify-center hidden group-hover-[.folder-link]:flex group-focus-within-[.folder-link]:flex gap-2 items-center">
							<SofaIcon class="h-[15px] cursor-pointer" name="edit-gray" @click.stop.prevent="edit(item)" />
							<SofaIcon class="h-[15px] cursor-pointer" name="trash-gray" @click.stop.prevent="deleteFolder(item)" />
						</div>
					</component>
				</div>

				<template v-if="organizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text custom-class="!font-bold">Organizations</sofa-normal-text>
					</div>
					<router-link
						v-for="item in organizations"
						:key="item.id"
						class="w-full flex items-center relative justify-start gap-2 p-4 rounded-custom bg-white shadow-custom"
						:to="`/library/organizations/${item.id}`"
						exact-active-class="bg-lightBlue font-semibold">
						<sofa-icon :name="'organization'" :custom-class="'h-[20px]'" />
						<sofa-normal-text class="truncate">{{ item.name }}</sofa-normal-text>
					</router-link>
				</template>
			</div>
			<div v-else class="w-full flex flex-col gap-4 mdlg:!pl-3 mdlg:!pr-7 h-full">
				<div v-if="tabs.length" class="w-full flex gap-2 justify-between items-center">
					<div class="w-full flex-nowrap overflow-x-auto scrollbar-hide flex gap-3 items-center">
						<router-link
							v-for="(item, i) in tabs.filter((t) => !t.hide)"
							:key="item.id"
							class="px-6 py-2 rounded-custom flex items-center justify-center"
							:class="(currentTab && item.id === currentTab) || (!currentTab && i === 0) ? 'bg-primaryPurple' : 'bg-white'"
							:to="`${$route.path}?tab=${item.id}`">
							<sofa-normal-text
								:color="(currentTab && item.id === currentTab) || (!currentTab && i === 0) ? 'text-white' : 'text-deepGray'"
								:class="'!font-semibold'"
								:content="item.name" />
						</router-link>
					</div>
				</div>
				<div class="flex flex-col gap-4 h-full overflow-y-auto">
					<slot />
				</div>
			</div>
		</template>
	</dashboard-layout>
</template>

<script setup lang="ts">
import { useAuth } from '@app/composables/auth/auth'
import { useEditFolder, useMyFolders } from '@app/composables/study/folders'
import { useMyOrganizations } from '@app/composables/users/organizations'
import { Logic } from 'sofa-logic'
import { PropType, computed, defineProps } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

const { isAdmin } = useAuth()
const libraryOptions = computed(() => [
	{
		title: 'In progress',
		icon: 'in-progress',
		routePath: '/library/in-progress',
		options: [
			{
				name: 'All',
				id: 'all',
			},
			{
				name: 'Tests',
				id: 'tests',
			},
			{
				name: 'Games',
				id: 'games',
			},
		],
	},
	{
		title: 'Quizzes',
		icon: 'quiz',
		routePath: '/library/quizzes',
		options: [
			{
				name: 'Recent',
				id: 'recent',
			},
			{
				name: 'Published',
				id: 'published',
			},
			{
				name: 'Draft',
				id: 'draft',
			},
			{
				name: 'Tutors',
				id: 'tutors',
				hide: !isAdmin.value,
			},
		],
	},
	{
		title: 'Courses',
		icon: 'course-list',
		routePath: '/library/courses',
		options: [
			{
				name: 'Recent',
				id: 'recent',
			},
			{
				name: 'Published',
				id: 'published',
			},
			{
				name: 'Draft',
				id: 'draft',
			},
		],
	},
	{
		title: 'Purchased',
		icon: 'purchased',
		routePath: '/library/purchased',
		options: [],
	},
	{
		title: 'Results',
		icon: 'results',
		routePath: '/library/results',
		options: [
			{
				name: 'All',
				id: 'all',
			},
			{
				name: 'Tests',
				id: 'tests',
			},
			{
				name: 'Games',
				id: 'games',
			},
		],
	},
])

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	index: {
		type: Boolean,
		required: false,
		default: false,
	},
	options: {
		type: Array as PropType<{ name: string; id: string; hide?: boolean }[]>,
		required: false,
		default: null,
	},
})

const route = useRoute()
const currentTab = computed(() => route.query.tab as string | undefined)
const tabs = props.options ?? libraryOptions.value.find((o) => o.routePath === route.path)?.options ?? []
const { folders } = useMyFolders()
const { factory, edit, saveFolder, generateNewFolder, deleteFolder } = useEditFolder()

const { organizations } = useMyOrganizations()

useMeta(
	computed(() => ({
		title: props.title,
	})),
)
</script>
