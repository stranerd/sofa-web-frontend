<template>
	<ExpandedLayout width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:py-5" :hide="{ bottom: true }">
		<div v-if="$screen.desktop" class="text-grayColor w-full flex gap-1">
			<SofaText as="router-link" to="/marketplace/classes" content="Explore classes" />
			<SofaText>/ {{ classInst.title }}</SofaText>
		</div>
		<div v-else class="w-full p-4 flex justify-between items-center gap-4 bg-white text-deepGray">
			<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
			<SofaHeading :content="classInst.title" />
			<span class="w-4" />
		</div>
		<div class="w-full mdlg:rounded-2xl flex flex-col max-h-full overflow-y-auto px-4 pb-4 mdlg:p-4 bg-white text-deepGray">
			<div class="w-full flex mdlg:flex-row flex-col items-start gap-4">
				<SofaImageLoader class="w-full mdlg:w-[33%] aspect-video rounded-custom" :photoUrl="classInst.picture" />
				<div class="w-full flex flex-col gap-2 grow">
					<div class="w-full flex items-center justify-between gap-4">
						<SofaHeading :content="classInst.title" />
						<SofaIcon name="share" class="h-[16px]" @click="shareClass" />
					</div>
					<SofaText :content="classInst.description" />
					<div class="flex items-center mdlg:items-start mdlg:flex-col gap-2">
						<div class="flex items-center gap-1">
							<SofaIcon name="lessons" class="fill-current h-[16px]" />
							<SofaText clamp>
								{{ classInst.lessons.length }} {{ $utils.pluralize(classInst.lessons.length, 'lesson', 'lessons') }}
							</SofaText>
						</div>
						<div class="flex items-center gap-1">
							<SofaIcon name="user-unfilled" class="fill-current h-[16px]" />
							<SofaText clamp>
								{{ classInst.members.students.length }}
								{{ $utils.pluralize(classInst.members.students.length, 'student', 'students') }}
							</SofaText>
						</div>
					</div>
					<div class="flex items-center gap-1">
						<UserName :user="classInst.user" />
						<div class="size-[5px] rounded-full bg-current" />
						<SofaText :content="`Created on ${$utils.formatTime(classInst.createdAt)}`" />
					</div>
					<SofaButton padding="py-3 px-5" class="hidden mdlg:inline self-start mt-3" @click="enrollInClassProps.handler">
						{{ enrollInClassProps.label }}
					</SofaButton>
				</div>
			</div>

			<div class="w-full flex gap-4 items-center border-b border-lightGray pr-4 pt-3 my-4">
				<SofaText
					v-for="tab in tabs.filter((tab) => !tab.hide)"
					:key="tab.name"
					as="a"
					class="font-semibold pb-2 text-grayColor"
					:content="tab.name"
					:class="{ 'border-b-2 border-current !text-bodyBlack': selectedTab === tab.key }"
					@click="selectedTab = tab.key" />
			</div>

			<div v-if="selectedTab == 'activity'" class="grow overflow-y-auto">
				<div v-if="classInst.lessons.length" class="flex w-full flex-col">
					<SofaHeaderText content="Subjects" class="!text-xl" />
					<div class="flex flex-col gap-4 mt-3">
						<LessonCard
							v-for="(lesson, index) in classInst.lessons"
							:key="lesson.id"
							:lesson="lesson"
							:index="index"
							:class="lesson.id === selectedLesson?.id ? '!bg-lightBlue' : ''"
							:classInst="classInst"
							@click="selectedLesson = lesson" />
					</div>
				</div>
				<div v-else class="flex flex-col gap-4 items-center py-10">
					<img src="/images/empty-lessons.png" class="w-[84px] h-[84px]" />
					<SofaNormalText color="text-grayColor" customClass="font-bold">No lessons created yet!</SofaNormalText>
				</div>
			</div>

			<div
				v-if="selectedTab == 'similar'"
				class="grow overflow-y-auto flex items-start mdlg:flex-col gap-4 flex-nowrap overflow-x-auto scrollbar-hide">
				<ClassCard
					v-for="classItem in similarClasses"
					:key="classItem.id"
					:classInst="classItem"
					class="!bg-lightGray"
					:wrapped="!$screen.desktop" />
			</div>

			<SofaButton v-if="!$screen.desktop" padding="px-6 py-3" class="w-full sticky bottom-0 mt-4" @click="enrollInClassProps.handler">
				{{ enrollInClassProps.label }}
			</SofaButton>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useRedirectToAuth } from '@app/composables/auth/session'
import { useModals } from '@app/composables/core/modals'
import { usePurchaseClass, useSimilarClasses } from '@app/composables/organizations/classes'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{ classInst: ClassEntity }>()

const router = useRouter()
useMeta({ title: props.classInst.title })
const { user, wallet } = useAuth()
const { runInAuth } = useRedirectToAuth()
const { purchaseClass } = usePurchaseClass()
const { classes: similarClasses } = useSimilarClasses(props.classInst.organizationId, props.classInst.id)

const tabs = computed(() => [
	{ name: 'Activity', key: 'activity', hide: !props.classInst.lessons.length },
	{ name: 'Similar Classes', key: 'similar', hide: !similarClasses.value.length },
])
const selectedTab = ref(tabs.value[0]?.key)
const lessons = computed(() => props.classInst.lessons)
const selectedLesson = ref(lessons.value[0])

const shareClass = () => {
	$utils.share(`Join ${props.classInst.title} class on SOFA`, props.classInst.description, props.classInst.shareLink)
}
const purchase = runInAuth(() => {
	const canAccessFree = user.value ? props.classInst.canAccessForFree(user.value) : false
	useModals().payment.selectPaymentMethod.open({
		price: props.classInst.price,
		onSelect: (method) => purchaseClass(props.classInst, method),
		autoSelect: canAccessFree,
	})
})
const enrollInClassProps = computed(() => {
	const classInst = props.classInst
	if (user.value && wallet.value) {
		if (classInst.isEnrolled(user.value))
			return {
				label: 'Go to class',
				handler: () => router.push(classInst.pageLink),
			}
		const classSub = wallet.value.getClassSubscription({ organizationId: classInst.organizationId, classId: classInst.id })
		if (classSub && !classSub.active)
			return {
				label: 'Renew enrollment',
				handler: purchase,
			}
	}
	const canAccessFree = user.value ? classInst.canAccessForFree(user.value) : false
	return {
		label: `Enroll for ${canAccessFree ? 'free' : $utils.formatPrice(classInst.price.amount, classInst.price.currency)}/month`,
		handler: purchase,
	}
})
</script>
