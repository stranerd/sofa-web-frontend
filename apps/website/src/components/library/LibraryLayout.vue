<template>
	<sub-page-layout v-if="!index && !Logic.Common.isLarge">
		<div class="w-full h-full flex-grow flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 z-50 justify-between bg-backgroundGray p-4 sticky top-0 left-0">
				<sofa-icon :customClass="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
				<sofa-normal-text :customClass="'!font-bold !text-base'">{{ title }}</sofa-normal-text>
				<span class="w-4" />
			</div>
			<div v-if="tabs.length">
				<div class="w-full flex flex-nowrap overflow-x-auto scrollbar-hide px-4 py-2 gap-3">
					<router-link class="px-6 py-2 rounded-custom flex items-center justify-center"
						:class="(currentTab && item.id === currentTab) || (!currentTab && index === 0) ? 'bg-primaryPurple' : 'bg-white'"
						v-for="(item, index) in tabs.filter((t) => !t.hide)" :key="item.id"
						:to="`${$route.path}?tab=${item.id}`">
						<sofa-normal-text
							:color="(currentTab && item.id === currentTab) || (!currentTab && index === 0) ? 'text-white' : 'text-deepGray'"
							:custom-class="'!font-semibold'">{{ item.name }}</sofa-normal-text>
					</router-link>
				</div>
			</div>

			<div class="w-full flex flex-col gap-3 px-4 pt-3 h-full overflow-y-auto">
				<slot />
			</div>
		</div>
	</sub-page-layout>
	<dashboard-layout v-else :topbarOptions="{ title }" :hide="{ right: true }">
		<div
			class="mdlg:hidden w-full flex items-center gap-3 z-[100] justify-between bg-backgroundGray p-4 sticky top-0 left-0">
			<sofa-icon customClass="h-[15px]" :name="'back-arrow'" @click="Logic.Common.goBack()" />
			<sofa-normal-text customClass="!font-bold !text-base">{{ title }}</sofa-normal-text>
			<span />
		</div>

		<template v-slot:left-session>
			<div class="w-full shadow-custom bg-white rounded-[16px] flex flex-col py-4 px-3 gap-2">
				<router-link class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-[#E5F2FD]"
					v-for="item in libraryOptions" :key="item.routePath" :to="item.routePath"
					exact-active-class="bg-[#E5F2FD] !font-bold">
					<sofa-icon :name="item.icon" :custom-class="'h-[17px]'" />
					<sofa-normal-text>{{ item.title }}</sofa-normal-text>
				</router-link>

				<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
					<sofa-normal-text :customClass="'!font-bold'">Folders</sofa-normal-text>
					<sofa-normal-text :color="'text-primaryPink'" customClass="cursor-pointer"
						@click="addFolder">Add</sofa-normal-text>
				</div>

				<component :is="item.edit ? 'span' : 'router-link'"
					class="w-full flex items-center justify-start gap-3 p-3 relative rounded-[8px] hover:bg-[#E5F2FD] group folder-link"
					v-for="item in folders" :key="item.id" :to="`/library/folders/${item.id}`"
					exact-active-class="bg-[#E5F2FD] font-bold">
					<sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />

					<sofa-custom-input v-if="item.edit"
						custom-class="lg:text-sm mdlg:text-[12px] text-xs w-full cursor-text !bg-white"
						:updateValue="item.name" placeholder="Folder name" @onBlur="() => {
							item.edit = false
							handleFolderNameBlur()
						}" @onEnter="() => {
	item.edit = false
	handleFolderNameBlur()
}" @onContentChange="(content) => {
	item.name = content
	currentFolder.name = content
	currentFolder.id = item.id
}" />
					<sofa-normal-text v-else>{{ item.name }}</sofa-normal-text>

					<div v-if="!item.edit"
						class="absolute right-0 top-0 h-full px-3 justify-center bg-[#E5F2FD] rounded-r-[8px] hidden group-hover-[.folder-link]:flex group-focus-within-[.folder-link]:flex gap-2 items-center">
						<sofa-icon @click.stop.prevent="item.edit = true" customClass="h-[15px] cursor-pointer"
							name="edit-gray" />
						<sofa-icon customClass="h-[15px] cursor-pointer" name="trash-gray"
							@click.stop.prevent="deleteFolder(item.id)" />
					</div>
				</component>

				<template v-if="allOrganizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text customClass="!font-bold">Organizations</sofa-normal-text>
					</div>
					<router-link
						class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-[#E5F2FD]"
						:to="`/library/organizations/${item.id}`" v-for="item in allOrganizations" :key="item.id"
						exact-active-class="bg-[#E5F2FD]">
						<sofa-icon :name="'organization'" :custom-class="'h-[20px]'" />
						<sofa-normal-text>{{ item.name }}</sofa-normal-text>
					</router-link>
				</template>
			</div>
		</template>

		<template v-slot:middle-session>
			<div v-if="index" class="w-full flex flex-col gap-4 px-4 mdlg:!hidden">
				<div class="px-2 bg-white flex flex-col shadow-custom rounded-custom">
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
						class="w-full flex items-center relative justify-between gap-3 p-4 rounded-custom bg-white shadow-custom group folder-link"
						v-for="item in folders" :key="item.id" :to="`/library/folders/${item.id}`"
						exact-active-class="font-bold">
						<div class="flex items-center gap-3 w-full">
							<sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />
							<sofa-custom-input v-if="item.edit" :updateValue="item.name" :placeholder="'Folder name'"
								custom-class="lg:text-sm mdlg:text-[12px] text-xs w-full !py-1 !bg-backgroundGray rounded cursor-text"
								@onBlur="() => {
									item.edit = false
									handleFolderNameBlur()
								}" @onEnter="() => {
	item.edit = false
	handleFolderNameBlur()
}" @onContentChange="(content) => {
	item.name = content
	currentFolder.name = content
	currentFolder.id = item.id
}" />
							<sofa-normal-text v-else>{{ item.name }}</sofa-normal-text>
						</div>

						<div v-if="!item.edit"
							class="h-full justify-center hidden group-hover-[.folder-link]:flex group-focus-within-[.folder-link]:flex gap-2 items-center">
							<sofa-icon @click.stop.prevent="item.edit = true" :customClass="'h-[15px] cursor-pointer'"
								:name="'edit-gray'" />
							<sofa-icon :customClass="'h-[15px] cursor-pointer'" :name="'trash-gray'"
								@click.stop.prevent="deleteFolder(item.id)" />
						</div>
					</component>
				</div>

				<template v-if="allOrganizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<sofa-normal-text customClass="!font-bold">Organizations</sofa-normal-text>
					</div>
					<router-link
						class="w-full flex items-center relative justify-start gap-2 p-4 rounded-custom bg-white shadow-custom"
						:to="`/library/organizations/${item.id}`" v-for="item in allOrganizations" :key="item.id"
						exact-active-class="bg-[#E5F2FD]">
						<sofa-icon :name="'organization'" :custom-class="'h-[20px]'" />
						<sofa-normal-text>{{ item.name }}</sofa-normal-text>
					</router-link>
				</template>
			</div>
			<div v-else class="w-full flex flex-col gap-4 mdlg:!pl-3 mdlg:!pr-7 h-full">
				<div class="w-full flex gap-2 justify-between items-center" v-if="tabs.length">
					<div class="w-full flex-nowrap overflow-x-auto scrollbar-hide flex gap-3 items-center">
						<router-link class="px-6 py-2 rounded-custom flex items-center justify-center"
							:class="(currentTab && item.id === currentTab) || (!currentTab && index === 0) ? 'bg-primaryPurple' : 'bg-white'"
							v-for="(item, index) in tabs.filter((t) => !t.hide)" :key="item.id"
							:to="`${$route.path}?tab=${item.id}`">
							<sofa-normal-text
								:color="(currentTab && item.id === currentTab) || (!currentTab && index === 0) ? 'text-white' : 'text-deepGray'"
								:custom-class="'!font-semibold'">{{ item.name }}</sofa-normal-text>
						</router-link>
					</div>
				</div>
				<div class="flex flex-col gap-4 h-full overflow-y-auto">
					<slot />
				</div>
			</div>
		</template>
	</dashboard-layout>

	<sofa-modal v-if="showMoreOptions" :close="() => showMoreOptions = false">
		<div class="mdlg:w-[300px] mdlg:!h-full w-full h-auto flex flex-col items-center relative">
			<div class="bg-white w-full flex flex-col md:!rounded-[16px] rounded-t-2xl">
				<div
					class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 px-4 border-[#F1F6FA] border-b">
					<sofa-normal-text :customClass="'!font-bold !text-base'">Options</sofa-normal-text>
					<sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="showMoreOptions = false" />
				</div>

				<a class="w-full flex items-center gap-2 p-4" v-for="item in moreOptions" :key="item.title"
					@click.stop.prevent="item.action()">
					<sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
					<sofa-normal-text>{{ item.title }}</sofa-normal-text>
				</a>
			</div>
		</div>
	</sofa-modal>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { AllFolders, addFolder, currentFolder, deleteFolder, folders, handleFolderNameBlur, moreOptions, setFolders, showMoreOptions } from '@/composables/library'
import { Conditions, Logic, SingleUser } from "sofa-logic"
import { SofaCustomInput, SofaIcon, SofaModal, SofaNormalText } from "sofa-ui-components"
import { PropType, computed, defineProps, onMounted, ref, watch } from 'vue'
import { useMeta } from "vue-meta"
import { useRoute } from 'vue-router'

const UserProfile = ref(Logic.Users.UserProfile)
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
				name: "Tutors",
				id: "tutors",
				hide: !UserProfile.value?.roles.isAdmin
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
		required: true
	},
	index: {
		type: Boolean,
		required: false,
		default: false
	},
	options: {
		type: Array as PropType<{ name: string; id: string; hide?: boolean }[]>,
		required: false
	}
})

const route = useRoute()
const { user } = useAuth()
const currentTab = computed(() => route.query.tab as string | undefined)
const allOrganizations = ref<{ id: string; name: string }[]>([])
const tabs = props.options ?? libraryOptions.value.find((o) => o.routePath === route.path)?.options ?? []

useMeta(computed(() => ({
	title: props.title
})))

const setOrganizations = async () => {
	const users: SingleUser[] = await Logic.Users.GetUsers({
		where: [
			{
				field: 'id',
				value: user.value?.account.organizationsIn ?? [],
				condition: Conditions.in,
			},
		],
	})
	allOrganizations.value = users.map((item) => ({
		id: item.id,
		name: item.type?.name ?? item.bio.name.full,
	}))
}

watch(AllFolders, setFolders)
watch(UserProfile, setOrganizations)

onMounted(async () => {
	Logic.Study.watchProperty("UserProfile", UserProfile)
	Logic.Study.watchProperty("AllFolders", AllFolders)
	if (!Logic.Study.Tags) Logic.Study.GetTags({
		where: [{ field: "type", value: "topics" }],
		all: true
	})
	if (!Logic.Study.RecentMaterials) Logic.Study.GetRecentMaterials()
	Logic.Study.GetFolders({ all: true })
	setOrganizations()
})
</script>