import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { getRandomValue } from 'valleyed'
import { App } from 'vue'

const stores: Record<string, { value: any; stack: string[] }> = {}

const config = {
	componentStateTypes: ['Global Stores'],
	enableEarlyProxy: true,
	id: 'com.stranerd.global-stores',
	label: 'Global Stores',
}

function isValid(payload: Record<string, any>, data: Record<string, any>) {
	for (const [key, value] of Object.entries(data)) {
		if (payload[key] !== value) return false
	}
	return true
}

export function devtools(app: App) {
	setupDevtoolsPlugin({ ...config, app }, (api) => {
		api.addInspector({
			id: config.id,
			label: config.label,
			icon: 'storage',
			actions: [
				{
					icon: 'refresh',
					tooltip: 'Refresh',
					action: () => api.sendInspectorTree(config.id),
				},
			],
			nodeActions: [
				{
					icon: 'refresh',
					tooltip: 'Refresh',
					action: () => api.sendInspectorState(config.id),
				},
			],
		})

		api.on.inspectComponent((payload) => {
			Object.entries(stores).forEach(([key, store]) => {
				payload.instanceData.state.push({
					key,
					type: config.componentStateTypes[0],
					value: store.value,
					editable: false,
				})
			})
		})

		api.on.editComponentState((payload) => {
			if (!isValid(payload, { app, type: config.componentStateTypes[0] })) return

			payload.set(stores)
		})

		api.on.getInspectorTree((payload) => {
			if (!isValid(payload, { app, inspectorId: config.id })) return

			payload.rootNodes = Object.keys(stores)
				.filter((key) => key.toLowerCase().includes(payload.filter.toLowerCase()))
				.sort()
				.map((key) => ({
					id: key,
					label: key,
					children: [],
					tags: [],
				}))
		})

		api.on.getInspectorState((payload) => {
			if (!isValid(payload, { app, inspectorId: config.id })) return
			const store = stores[payload.nodeId]
			if (!store) return

			payload.state = {
				State: [
					{
						key: 'value',
						value: store.value,
						editable: false,
					},
				],
				Stack: store.stack.map((value, index) => ({ key: index.toString(), value })),
			}
		})

		api.on.editInspectorState((payload) => {
			if (!isValid(payload, { app, inspectorId: config.id })) return
			const store = stores[payload.nodeId]
			if (!store) return

			payload.set(store.value)
		})
	})
}

function getStack() {
	const stack = <string[]>new Error().stack!.split('\n')
	const index = stack.findIndex((line) => line.includes('getStack'))
	return stack.slice(index + 2).map((line) => line.trim())
}

export function createStore<T>(initial: T, name?: string): T {
	name ??= getRandomValue()
	if (stores[name]) name += `-${getRandomValue()}`

	stores[name] = { value: initial, stack: getStack() }
	return initial
}
