<template>
	<router-link
		:to="classInst.pageLink"
		class="bg-white flex gap-2 p-3 mdlg:p-4 rounded-custom h-auto items-start"
		:class="isWrapped ? 'flex-col w-[156px]' : 'flex-row'">
		<SofaImageLoader
			class="mdlg:w-[168px] aspect-video rounded-custom"
			:class="isWrapped ? 'w-full' : 'w-[150px]'"
			:photoUrl="classInst.picture" />
		<div class="flex flex-col gap-1 w-full grow truncate">
			<SofaHeading :content="classInst.title" />
			<div class="flex gap-2 items-center">
				<SofaIcon name="lessons" class="fill-current w-[16px]" />
				<SofaText clamp :content="classInst.lessons.map((lesson) => lesson.title).join(' | ')" />
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
import { ClassEntity } from '@modules/organizations'
import { UserType } from '@modules/users'

withDefaults(
	defineProps<{
		classInst: ClassEntity
		isWrapped?: boolean
	}>(),
	{
		isWrapped: false,
	},
)
</script>
