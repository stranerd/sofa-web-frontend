<template>
	<SettingsLayout title="Security">
		<div class="w-full flex flex-col gap-5 mdlg:px-0 px-4">
			<form class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom" @submit.prevent="updatePassword">
				<SofaHeaderText size="xl" content="Password" />

				<SofaTextField
					v-if="hasPassword"
					v-model="factory.oldPassword"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					placeholder="Current password"
					:error="factory.errors.oldPassword"
					borderColor="border-transparent" />

				<SofaTextField
					v-model="factory.password"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					placeholder="New password"
					:error="factory.errors.password"
					borderColor="border-transparent" />

				<SofaTextField
					v-model="factory.cPassword"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					placeholder="Confirm new password"
					:error="factory.errors.cPassword"
					borderColor="border-transparent" />

				<SofaButton :disabled="!factory.valid" type="submit" padding="px-7 py-2" class="self-end"> Update </SofaButton>
			</form>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { usePasswordUpdate } from '@app/composables/auth/passwords'

export default defineComponent({
	name: 'SettingsSecurityPage',
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
			title: 'Security',
		})

		const { hasPassword } = useAuth()
		const { factory, updatePassword } = usePasswordUpdate()
		return { hasPassword, factory, updatePassword }
	},
})
</script>
