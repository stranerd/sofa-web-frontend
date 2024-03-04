<template>
	<ExpandedLayout width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:py-4 bg-white" :hide="{ bottom: true }">
		<div class="mdlg:flex hidden justify-between items-center w-full">
			<div class="text-grayColor w-full flex justify-start gap-1">
				<SofaNormalText as="router-link" to="/classes/explore" class="text-current">Classes</SofaNormalText>
				<SofaNormalText class="text-current">/ {{ classInst.title }}</SofaNormalText>
			</div>
		</div>
		<div class="block mdlg:!hidden p-4 self-end">
			<SofaIcon class="h-[16px]" name="circle-close" @click="Logic.Common.goBack()" />
		</div>
		<div class="w-full mdlg:rounded-2xl flex flex-col flex-grow overflow-y-auto p-4">
			<div
				class="w-full flex mdlg:flex md:flex-row mdlg:flex-none flex-col mdlg:items-start h-auto items-start justify-start gap-3 mdlg:gap--3">
				<div class="mdlg:!w-[33%] w-full">
					<SofaImageLoader
						customClass="mdlg:w-full w-full h-[200px] rounded-custom relative !object-cover"
						:photoUrl="classInst.picture">
					</SofaImageLoader>
				</div>
				<div class="w-full flex flex-col gap-2 flex-grow">
					<div class="w-full flex flex-row items-center justify-between">
						<SofaHeaderText :content="classInst.title" />
						<SofaIcon name="share" class="h-[16px]" @click="shareClass" />
					</div>
					<SofaNormalText>{{ classInst.description }}</SofaNormalText>
					<div class="flex flex-row mdlg:flex-col gap-2">
						<div class="flex items-center gap-1">
							<SofaIcon name="lessons" class="fill-black h-[16px]" />
							<SofaNormalText color="text-deepGray">
								{{ classInst.lessons.length }} {{ pluralize(classInst.lessons.length, 'lesson', 'lessons') }}
							</SofaNormalText>
						</div>
						<div class="flex items-center gap-1">
							<SofaIcon name="user-unfilled" class="!fill-black h-[16px]" />
							<SofaNormalText color="text-deepGray">
								{{ classInst.members.students.length }}
								{{ pluralize(classInst.members.students.length, 'student', 'students') }}
							</SofaNormalText>
						</div>
					</div>
					<div class="flex items-center gap-1">
						<SofaAvatar :photoUrl="classInst.user.bio.photo?.link" class="!h-[24px] !w-[24px]" />
						<SofaNormalText :content="classInst.user.bio.name.full" />
						<div class="h-[5px] w-[5px] rounded-full bg-deepGray"></div>
						<SofaNormalText>
							{{ `Created on ${formatTime(classInst.createdAt)}` }}
						</SofaNormalText>
					</div>
					<SofaButton padding="py-3 px-5" class="hidden mdlg:block self-start mt-3" @click="enrollInClassProps.handler">
						{{ enrollInClassProps.label }}
					</SofaButton>
				</div>
			</div>
			<!-- Tabs -->
			<div class="w-full flex gap-4 items-center border-b border-lightGray pr-4 pt-3 my-4">
				<SofaNormalText
					v-for="(tab, index) in tabs"
					:key="index"
					:color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'"
					:customClass="`!font-semibold cursor-pointer pb-2  ${selectedTab == tab.key ? 'border-b-2 border-bodyBlack' : ''}`"
					@click="selectedTab = tab.key">
					{{ tab.name }}
				</SofaNormalText>
			</div>
			<div v-if="selectedTab == 'activity'" class="flex-grow overflow-y-auto">
				<div v-if="classInst.lessons.length" class="flex gap-4">
					<!-- For larger screen -->
					<div class="w-full hidden mdlg:flex gap-4">
						<div class="flex mdlg:w-[30%] flex-col">
							<SofaHeaderText content="Lessons" customClass="!text-xl" />
							<div class="flex flex-col gap-4 mt-3">
								<LessonCard
									v-for="lesson in classInst.lessons"
									:key="lesson.id"
									:lesson="lesson"
									hideJoin
									:class="lesson.id === selectedLesson?.id ? '!bg-lightBlue' : ''"
									:classInst="classInst"
									@click="selectedLesson = lesson" />
							</div>
						</div>
						<LessonsForExplore :classInst="classInst" :lesson="selectedLesson" />
					</div>
					<div class="w-full mdlg:hidden flex flex-col">
						<div class="flex flex-col">
							<SofaHeaderText content="Lessons" customClass="!text-xl" />
							<div class="flex flex-col gap-4 mt-3">
								<button
									v-for="lesson in classInst.lessons"
									:key="lesson.id"
									class="flex items-center justify-between pr-4 rounded-md cursor-pointer"
									:class="lesson.id === selectedLesson?.id ? '!bg-lightBlue' : 'bg-lightGray'"
									@click="openPreviewModal(lesson)">
									<LessonCard
										:lesson="lesson"
										hideJoin
										:classInst="classInst"
										:class="lesson.id === selectedLesson?.id ? '!bg-lightBlue' : 'bg-lightGray'" />
									<SofaIcon
										class="h-[8px]"
										name="chevron-down"
										:class="{ 'rotate-180': lesson.id === selectedLesson?.id }" />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="flex flex-col gap-4 items-center py-10">
					<img src="/images/empty-lessons.png" class="w-[84px] h-[84px]" />
					<SofaNormalText color="text-grayColor" customClass="font-bold">No lessons created yet!</SofaNormalText>
				</div>
			</div>
			<div v-if="selectedTab == 'similar_classes'" class="flex-grow overflow-y-auto">
				<div v-if="similarClasses.length === 0" class="flex flex-col gap-4 items-center py-10">
					<img src="/images/empty-classes.png" class="w-[84px] h-[84px]" />
					<SofaNormalText color="text-grayColor" customClass="font-bold">No classes found!</SofaNormalText>
				</div>
				<div v-else class="grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 gap-3 mdlg:gap-6">
					<ExploreClassCard
						v-for="classItem in similarClasses"
						:key="classItem.id"
						:classInst="classItem"
						class="!bg-[#FAFAFA]" />
				</div>
			</div>
			<SofaButton padding="px-6 py-3" class="mdlg:hidden w-full mt-4" @click="enrollInClassProps.handler">
				{{ enrollInClassProps.label }}
			</SofaButton>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts" setup>
import { pluralize } from 'valleyed'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMeta } from 'vue-meta'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { usePurchaseClass, useSimilarClasses } from '@app/composables/organizations/classes'
import { ClassEntity, ClassLesson } from '@modules/organizations'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	classInst: ClassEntity
}>()

const router = useRouter()
const { user, wallet } = useAuth()
const tabs = [
	{
		name: 'Activity',
		key: 'activity',
	},
	{
		name: 'Similar Classes',
		key: 'similar_classes',
	},
]
const selectedTab = ref(tabs[0].key)
const lessons = computed(() => props.classInst.lessons)
const selectedLesson = ref(lessons.value[0])
const { purchaseClass } = usePurchaseClass()
const { similarClasses } = useSimilarClasses(props.classInst.organizationId, props.classInst.id)

useMeta({ title: props.classInst.title })

const openPreviewModal = (lesson: ClassLesson) => {
	selectedLesson.value = lesson
	useModals().organizations.previewCurriculum.open({
		lesson: selectedLesson.value,
		classInst: props.classInst,
		curriculum: lesson.curriculum,
		isPreview: false,
	})
}

const shareClass = () => {
	Logic.Common.share(`Join ${props.classInst.title} class on SOFA`, props.classInst.description, props.classInst.shareLink)
}
const enrollInClassProps = computed(() => {
	const classInst = props.classInst
	if (classInst.isEnrolled(user.value!))
		return {
			label: 'Go to class',
			handler: () => router.push(classInst.pageLink),
		}
	const classSub = wallet.value?.getClassSubscription({ organizationId: classInst.organizationId, classId: classInst.id })
	if (classSub && !classSub.active)
		return {
			label: 'Renew enrollment',
			handler: () => purchaseClass(classInst),
		}
	const canAccessFree = classInst.canAccessForFree(user.value!)
	return {
		label: `Enroll for ${canAccessFree ? 'free' : Logic.Common.formatPrice(classInst.price.amount, classInst.price.currency)}/month`,
		handler: () => purchaseClass(classInst),
	}
})
</script>
