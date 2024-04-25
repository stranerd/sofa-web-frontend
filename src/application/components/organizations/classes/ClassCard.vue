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

		<div class="flex gap-2 items-center justify-between pt-1">
			<router-link class="gap-2 flex items-center truncate" :to="`/profile/${classInst.user.id}`">
				<SofaAvatar :size="20" :photoUrl="classInst.user.bio.photo?.link" :userId="classInst.user.id" />
				<SofaText clamp :content="classInst.user.bio.publicName" />
				<SofaIcon v-if="classInst.user.roles.isVerified" name="verify" class="h-[13px]" />
				<SofaIcon v-if="classInst.user.type?.type === UserType.teacher" name="tutor-bagde" class="h-[13px]" />
			</router-link>

			<SofaIcon v-if="hasBookmark" :name="saveIcon" class="h-[18px]" @click.stop.prevent="saveClass" />
		</div>
	</Card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ClassEntity } from '@modules/organizations'
import { UserType } from '@modules/users'
import { useModals } from '@app/composables/core/modals'
import { useAuth } from '@app/composables/auth/auth'
import { useSaveClass } from '@app/composables/organizations/classes-explore'

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
