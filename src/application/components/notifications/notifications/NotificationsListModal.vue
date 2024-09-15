<template>
	<div class="w-full h-full flex flex-col gap-4 p-4 mdlg:p-6">
		<div class="w-full flex items-center justify-between">
			<SofaHeading> Notifications </SofaHeading>
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<div v-if="!notifications.length" class="w-full flex flex-col gap-2 items-center justify-center flex-1">
			<SofaIcon name="empty-notification" class="h-[48px]" />
			<SofaNormalText color="text-inherit" class="text-center"> You have no notifications </SofaNormalText>
		</div>
		<div v-if="notifications.length" class="w-full flex-1 flex flex-col items-center gap-3 overflow-y-auto">
			<router-link
				v-for="notification in notifications"
				:key="notification.hash"
				:to="notification.link"
				class="w-full flex items-start justify-between"
				:class="{ 'opacity-80': notification.seen }"
				@click="markNotificationSeen(notification)">
				<div class="flex flex-col gap-1">
					<SofaNormalText color="text-inherit" :content="notification.body" />
					<SofaNormalText color="text-inherit" :content="$utils.formatTime(notification.createdAt)" />
				</div>
				<span v-if="!notification.seen" class="size-[8px] rounded-full bg-primaryBlue" />
			</router-link>
			<SofaButton v-if="hasMore" textColor="text-grayColor" bgColor="bg-transparent" @click="fetchOlderNotifications">
				Load More
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNotificationList } from '@app/composables/notifications/notifications'

defineProps<{ close: () => void }>()

const { notifications, hasMore, fetchOlderNotifications, markNotificationSeen } = useNotificationList()
</script>
