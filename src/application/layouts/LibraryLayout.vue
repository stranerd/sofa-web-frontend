<template>
	<ExpandedLayout v-if="!index && !$screen.desktop" :hide="{ top: true, bottom: true }">
		<div class="w-full flex items-center gap-3 z-50 justify-between bg-lightGray p-4 sticky top-0 left-0">
			<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
			<SofaHeading>{{ title }}</SofaHeading>
			<span class="w-4" />
		</div>
		<div v-if="tabs.length" class="w-full">
			<div class="w-full flex flex-nowrap overflow-x-auto scrollbar-hide px-4 pb-2 gap-3">
				<router-link
					v-for="(item, i) in tabs.filter((t) => !t.hide)"
					:key="item.id"
					class="px-6 py-2 rounded-custom flex items-center justify-center"
					:class="
						(currentTab && item.id === currentTab) || (!currentTab && i === 0)
							? 'bg-primaryPurple text-white'
							: 'bg-white text-deepGray'
					"
					:to="`${$route.path}?tab=${item.id}`">
					<SofaHeading :content="item.name" />
				</router-link>
			</div>
		</div>

		<div class="w-full flex flex-col gap-3 px-4 py-3 flex-1 overflow-y-auto">
			<slot />
		</div>
	</ExpandedLayout>
	<FullLayout v-else :topbarOptions="{ title }" :hide="{ right: true }">
		<template #left-session>
			<div class="w-full shadow-custom bg-white rounded-[16px] flex flex-col py-4 px-3 gap-1">
				<router-link
					v-for="item in libraryOptions"
					:key="item.routePath"
					class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-lightBlue"
					:to="item.routePath"
					exactActiveClass="bg-lightBlue font-semibold">
					<SofaIcon :name="item.icon" class="h-[17px] fill-deepGray" />
					<SofaText>{{ item.title }}</SofaText>
				</router-link>

				<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
					<SofaHeading>Folders</SofaHeading>
					<SofaText class="text-primaryPink" as="a" @click="generateNewFolder">Add</SofaText>
				</div>

				<component
					:is="item.id === factory.entityId ? 'span' : 'router-link'"
					v-for="item in folders"
					:key="item.id"
					class="w-full flex items-center justify-start text-left gap-3 px-4 py-3 relative rounded-[8px] hover:bg-lightBlue group folder-link"
					:to="`/library/folders/${item.id}`"
					exactActiveClass="bg-lightBlue font-semibold">
					<SofaIcon name="folder" class="h-[16px]" />

					<SofaCustomInput
						v-if="item.id === factory.entityId"
						v-model="factory.title"
						class="grow"
						:autoFocus="true"
						placeholder="Folder name"
						@onBlur="saveFolder"
						@onEnter="saveFolder" />
					<SofaText v-else class="grow" clamp>{{ item.title }}</SofaText>

					<div
						v-if="item.id !== factory.entityId"
						class="px-3 ml-auto justify-center rounded-r-lg hidden group-hover-[.folder-link]:flex group-focus-within-[.folder-link]:flex gap-2 items-center">
						<SofaIcon class="h-[15px] fill-grayColor" name="edit" @click.stop.prevent="edit(item)" />
						<SofaIcon class="h-[15px] fill-grayColor" name="trash" @click.stop.prevent="deleteFolder(item)" />
					</div>
				</component>

				<template v-if="organizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<SofaHeading>Organizations</SofaHeading>
					</div>
					<router-link
						v-for="item in organizations"
						:key="item.id"
						class="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-lightBlue"
						:to="`/library/organizations/${item.id}`"
						exactActiveClass="bg-lightBlue font-semibold">
						<SofaIcon name="organization" class="h-[20px]" />
						<SofaText clamp>{{ item.name }}</SofaText>
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
						<SofaIcon :name="item.icon" class="h-[16px] fill-deepGray" />
						<SofaText>{{ item.title }}</SofaText>
					</router-link>
				</div>

				<div class="w-full flex flex-col gap-2">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<SofaHeading>Folders</SofaHeading>
						<SofaText class="text-primaryPink" @click="generateNewFolder">Add</SofaText>
					</div>

					<component
						:is="item.id === factory.entityId ? 'span' : 'router-link'"
						v-for="item in folders"
						:key="item.id"
						class="w-full flex items-center relative gap-3 p-4 rounded-custom text-left bg-white shadow-custom group folder-link"
						:to="`/library/folders/${item.id}`"
						exactActiveClass="bg-lightBlue font-semibold">
						<SofaIcon name="folder" class="h-[16px]" />
						<SofaCustomInput
							v-if="item.id === factory.entityId"
							v-model="factory.title"
							placeholder="Folder name"
							:autoFocus="true"
							class="grow !py-1 !bg-lightGray rounded"
							@onBlur="saveFolder"
							@onEnter="saveFolder" />
						<SofaText v-else class="grow" clamp>{{ item.title }}</SofaText>

						<div
							v-if="item.id !== factory.entityId"
							class="ml-auto justify-center hidden group-hover-[.folder-link]:flex group-focus-within-[.folder-link]:flex gap-2 items-center">
							<SofaIcon class="h-[15px] fill-grayColor" name="edit" @click.stop.prevent="edit(item)" />
							<SofaIcon class="h-[15px] fill-grayColor" name="trash" @click.stop.prevent="deleteFolder(item)" />
						</div>
					</component>
				</div>

				<template v-if="organizations.length">
					<div class="w-full flex items-center justify-between px-2 mt-3 mb-2">
						<SofaHeading>Organizations</SofaHeading>
					</div>
					<router-link
						v-for="item in organizations"
						:key="item.id"
						class="w-full flex items-center relative justify-start gap-2 p-4 rounded-custom bg-white shadow-custom"
						:to="`/library/organizations/${item.id}`"
						exactActiveClass="bg-lightBlue font-semibold">
						<SofaIcon name="organization" class="h-[20px]" />
						<SofaText clamp>{{ item.name }}</SofaText>
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
							:class="
								(currentTab && item.id === currentTab) || (!currentTab && i === 0)
									? 'bg-primaryPurple text-white'
									: 'bg-white text-deepGray'
							"
							:to="`${$route.path}?tab=${item.id}`">
							<SofaHeading :content="item.name" />
						</router-link>
					</div>
				</div>
				<div class="flex flex-col gap-4 h-full overflow-y-auto">
					<slot />
				</div>
			</div>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useEditFolder, useMyFolders } from '@app/composables/study/folders'
import { useMyOrganizations } from '@app/composables/users/organizations'
import { PlayTypes } from '@modules/plays'
import { DraftStatus } from '@modules/study'

const { isAdmin } = useAuth()
const playOptions = [
	{
		name: 'All',
		id: 'all',
		hide: false,
	},
	{
		name: 'Tests',
		id: PlayTypes.tests,
		hide: false,
	},
	{
		name: 'Games',
		id: PlayTypes.games,
		hide: false,
	},
	{
		name: 'Assessments',
		id: PlayTypes.assessments,
		hide: false,
	},
	/* {
		name: 'Practice',
		id: PlayTypes.practice,
		hide: false,
	}, */
]
const libraryOptions = computed(() => [
	{
		title: 'In progress',
		icon: 'in-progress' as const,
		routePath: '/library/in-progress',
		options: playOptions,
	},
	{
		title: 'Quizzes',
		icon: 'quiz' as const,
		routePath: '/library/quizzes',
		options: [
			{
				name: 'Recent',
				id: 'recent',
				hide: false,
			},
			{
				name: 'Published',
				id: DraftStatus.published,
				hide: false,
			},
			{
				name: 'Draft',
				id: DraftStatus.draft,
				hide: false,
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
		icon: 'courses' as const,
		routePath: '/library/courses',
		options: [
			{
				name: 'Recent',
				id: 'recent',
				hide: false,
			},
			{
				name: 'Published',
				id: DraftStatus.published,
				hide: false,
			},
			{
				name: 'Draft',
				id: DraftStatus.draft,
				hide: false,
			},
		],
	},
	{
		title: 'Purchased',
		icon: 'purchased' as const,
		routePath: '/library/purchased',
		options: [],
	},
	{
		title: 'Results',
		icon: 'results' as const,
		routePath: '/library/results',
		options: playOptions,
	},
])

const props = withDefaults(
	defineProps<{
		title: string
		index?: boolean
		options?: { name: string; id: string; hide?: boolean }[]
	}>(),
	{
		index: false,
		options: undefined,
	},
)

const route = useRoute()
const currentTab = computed(() => route.query.tab as string | undefined)
const tabs = props.options ?? libraryOptions.value.find((o) => o.routePath === route.path)?.options ?? []
const { folders } = useMyFolders()
const { factory, edit, saveFolder, generateNewFolder, deleteFolder } = useEditFolder()

const { organizations } = useMyOrganizations()

useHead(
	computed(() => ({
		title: props.title,
	})),
)
</script>
