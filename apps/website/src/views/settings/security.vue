<template>
	<SettingsLayout title="Security">
		<div class="w-full flex flex-col gap-5 mdlg:px-0 px-4">
			<form
				ref="formComp"
				class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom"
				@submit.prevent="updatePassword">
				<SofaHeaderText size="xl" content="Password" />

				<SofaTextField
					v-if="hasPassword"
					v-model="factory.oldPassword"
					custom-class="rounded-custom !bg-lightGray"
					type="password"
					placeholder="Current password"
					:error="factory.errors.oldPassword"
					border-color="border-transparent" />

				<SofaTextField
					v-model="factory.password"
					custom-class="rounded-custom !bg-lightGray"
					type="password"
					placeholder="New password"
					:error="factory.errors.password"
					border-color="border-transparent" />

				<SofaTextField
					v-model="factory.cPassword"
					custom-class="rounded-custom !bg-lightGray"
					type="password"
					placeholder="Confirm new password"
					:error="factory.errors.cPassword"
					border-color="border-transparent" />

				<SofaButton :disabled="!factory.valid" type="submit" padding="px-7 py-2" class="self-end"> Update </SofaButton>
			</form>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from '@/components/settings/SettingsLayout.vue'
import { useAuth } from '@/composables/auth/auth'
import { usePasswordUpdate } from '@/composables/auth/passwords'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'SecuritySettingPage',
	components: {
		SettingsLayout,
	},
	middlewares: { goBackRoute: '/settings' },
	setup() {
		useMeta({
			title: 'Security',
		})

		const { hasPassword } = useAuth()
		const { factory, updatePassword } = usePasswordUpdate()
		return { hasPassword, factory, updatePassword }
	},
})
</script>
