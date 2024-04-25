<template>
	<Card :wrapped="wrapped" :image="classInst.picture" as="router-link" :to="classInst.pageLink">
		<div class="w-full flex items-center gap-2 truncate">
			<SofaHeading :content="classInst.title" class="grow" />
			<SofaIcon v-if="hasShowMore" name="more-options-horizontal" class="w-[20px] h-3" @click.stop.prevent="moreOptionsHandler" />
			<slot name="side-icons" />
		</div>
		<div class="w-full flex gap-2 items-center text-grayColor truncate line-clamp-1">
			<template v-if="lessonsIn.length">
				<SofaIcon name="lessons" class="fill-current w-[16px]" />
				<SofaText :content="lessonsIn.map((lesson) => lesson.title).join(' | ')" />
			</template>
			<template v-else>
				<SofaText>
					{{ classInst.lessons.length }} {{ $utils.pluralize(classInst.lessons.length, 'subject', 'subjects') }}
				</SofaText>
				<span class="size-[5px] rounded-full bg-current" />
				<SofaText>
					{{ classInst.members.students.length }}
					{{ $utils.pluralize(classInst.members.students.length, 'student', 'students') }}
				</SofaText>
			</template>
		</div>

		<SofaHeading class="text-grayColor"> {{ $utils.formatPrice(classInst.price.amount, classInst.price.currency) }}/month </SofaHeading>

		<div class="flex gap-2 items-center justify-between">
			<UserName :user="classInst.user" as="router-link" />
			<SofaIcon v-if="hasBookmark" :name="saveIcon" class="h-[18px]" @click.stop.prevent="saveClass" />
		</div>
	</Card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useSaveClass } from '@app/composables/organizations/classes-explore'
import { ClassEntity } from '@modules/organizations'

const props = withDefaults(
	defineProps<{
		classInst: ClassEntity
		wrapped?: boolean
		hasShowMore?: boolean
		hasBookmark?: boolean
	}>(),
	{
		wrapped: false,
		hasShowMore: false,
		hasBookmark: false,
	},
)

const { id } = useAuth()
const { saveClass, isSaved } = useSaveClass(props.classInst)
const saveIcon = computed(() => (isSaved.value ? 'bookmark-filled' : 'bookmark'))
const moreOptionsHandler = (e: Event) => useModals().organizations.classCardMoreOptions.open({ classInst: props.classInst }, e)

const lessonsIn = computed(() =>
	props.classInst.lessons.filter((lesson) => lesson.users.students.includes(id.value) || lesson.users.teachers.includes(id.value)),
)
</script>
