<template>
	<a
		class="size-[30px] mdlg:size-[36px] flex items-center justify-center mdlg:border border-darkLightGray rounded-full"
		@click="openNotificationModal">
		<SofaIcon class="h-[22px] mdlg:h-[16px]" name="bell" />
	</a>
</template>

<script lang="ts" setup>
import { useModals } from '@app/composables/core/modals'
const openNotificationModal = () => useModals().notifications.notificationList.open({})
</script>
