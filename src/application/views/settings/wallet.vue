<template>
	<SettingsLayout title="Wallet">
		<setting-wallet />
	</SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from '@app/components/settings/SettingsLayout.vue'
import SettingWallet from '@app/components/settings/wallet.vue'
import { Conditions, Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'WalletSettingPage',
	components: {
		SettingsLayout,
		SettingWallet,
	},
	routeConfig: {
		fetchRules: [
			{
				domain: 'Payment',
				property: 'UserWallet',
				method: 'GetUserWallet',
				params: [],
				requireAuth: true,
				ignoreProperty: false,
			},
			{
				domain: 'Payment',
				property: 'AllCommercialBanks',
				method: 'GetCommercialBanks',
				params: [],
				requireAuth: true,
				ignoreProperty: false,
			},
			{
				domain: 'Payment',
				property: 'AllTransactions',
				method: 'GetTransactions',
				params: [
					{
						limit: 10,
						where: [
							{
								field: 'userId',
								condition: Conditions.eq,
								value: Logic.Common.AuthUser?.id,
							},
						],
						sort: [
							{
								field: 'createdAt',
								desc: false,
							},
						],
					},
				],
				requireAuth: true,
				ignoreProperty: false,
			},
			{
				domain: 'Payment',
				property: 'PaymentMethods',
				method: 'GetPaymentMethods',
				params: [
					{
						where: [
							{
								field: 'userId',
								condition: Conditions.eq,
								value: Logic.Common.AuthUser?.id,
							},
						],
					},
				],
				requireAuth: true,
				ignoreProperty: false,
			},
		],
		goBackRoute: '/settings',
	},
	setup() {
		useMeta({
			title: 'Wallet',
		})
	},
})
</script>
