<template>
	<router-link
		:to="classInst.pageLink"
		class="bg-white flex gap-2 p-3 mdlg:p-4 rounded-custom h-auto items-start"
		:class="isWrapped ? 'flex-col w-[156px]' : 'flex-row'">
		<SofaImageLoader
			class="mdlg:w-[168px] aspect-video rounded-custom"
			:class="isWrapped ? 'w-full' : 'w-[150px]'"
			:photoUrl="classInst.picture" />
		<div class="flex flex-col gap-1 w-full">
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

			<SofaHeading class="text-grayColor">
				{{ $utils.formatPrice(classInst.price.amount, classInst.price.currency) }}/month
			</SofaHeading>

			<router-link class="gap-2 flex items-center" :to="`/profile/${classInst.user.id}`">
				<SofaAvatar :size="20" :photoUrl="classInst.user.bio.photo?.link" :userId="classInst.user.id" />
				<SofaText clamp :content="classInst.user.bio.publicName" />
				<SofaIcon v-if="classInst.user.roles.isVerified" name="verify" class="h-[13px]" />
				<SofaIcon v-if="classInst.user.type?.type === UserType.teacher" name="tutor-bagde" class="h-[13px]" />
			</router-link>
		</div>
	</router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ClassEntity } from '@modules/organizations'
import { UserType } from '@modules/users'
import { useModals } from '@app/composables/core/modals'
import { useAuth } from '@app/composables/auth/auth'

const props = withDefaults(
	defineProps<{
		classInst: ClassEntity
		isWrapped?: boolean
		hasShowMore?: boolean
	}>(),
	{
		isWrapped: false,
		hasShowMore: false,
	},
)

const { id } = useAuth()

const moreOptionsHandler = (e: Event) => useModals().organizations.classCardMoreOptions.open({ classInst: props.classInst }, e)

const lessonsIn = computed(() =>
	props.classInst.lessons.filter((lesson) => lesson.users.students.includes(id.value) || lesson.users.teachers.includes(id.value)),
)
</script>
