<template>
	<SofaText v-bind="props" clamp :to="`/profile/${user.id}`" class="gap-2 flex items-center">
		<SofaAvatar v-if="avatar" :size="24" class="!size-[1.75em]" :photoUrl="user.bio.photo?.link" :userId="user.id" />
		<span class="line-clamp-1">{{ !name && user.id === id ? 'You' : publicName }}</span>
		<SofaIcon v-if="user.roles.isVerified" name="verify" class="h-[1em]" />
		<SofaIcon v-if="user.type?.type === UserType.teacher" name="tutor-badge" class="h-[1em]" />
	</SofaText>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { EmbeddedUser, UserEntity, UserType } from '@modules/users'
import { SofaText } from 'sofa-ui-components'

type TextProps = InstanceType<typeof SofaText>['$props']

const props = withDefaults(
	defineProps<{
		user: UserEntity | EmbeddedUser
		avatar?: boolean
		name?: boolean
		size?: TextProps['size']
		as?: TextProps['as']
		bold?: TextProps['bold']
	}>(),
	{
		avatar: true,
		name: false,
		size: undefined,
		as: undefined,
		bold: undefined,
	},
)

const { id } = useAuth()

const publicName = computed(() => ('publicName' in props.user ? props.user.publicName : props.user.bio.publicName))
</script>
