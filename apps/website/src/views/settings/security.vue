<template>
	<SettingsLayout title="Security">
		<div class="w-full flex flex-col gap-5 mdlg:px-0 px-4">
			<form @submit.prevent="updatePassword" ref="formComp"
				class="w-full flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl" content="Password" />

				<SofaTextField v-if="hasPassword" customClass="rounded-custom !bg-lightGray"
					type="password" placeholder="Current password" :error="factory.errors.oldPassword"
					borderColor="border-transparent" v-model="factory.oldPassword" />

				<SofaTextField customClass="rounded-custom !bg-lightGray"
					type="password" placeholder="New password" :error="factory.errors.password"
					borderColor="border-transparent" v-model="factory.password" />

				<SofaTextField customClass="rounded-custom !bg-lightGray"
					type="password" placeholder="Confirm new password" :error="factory.errors.cPassword"
					borderColor="border-transparent" v-model="factory.cPassword" />

				<SofaButton :disabled="!factory.valid" type="submit" padding="px-7 py-2" class="self-end">
					Update
				</SofaButton>
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
	components: {
		SettingsLayout,
	},
	name: 'SecuritySettingPage',
	middlewares: { goBackRoute: '/settings' },
	setup () {
		useMeta({
			title: 'Security',
		})

		const { hasPassword } = useAuth()
		const { factory, updatePassword } = usePasswordUpdate()
		return { hasPassword, factory, updatePassword }
	},
})
</script>