import { Component, Ref, ref } from 'vue'

type Comp = Component & (abstract new (...args: any) => any)
type Args = Record<string, any>
type ModalArgs = { closeOnClickOutside?: boolean } & Record<string, any>
type ModalsDef<K extends string = string, C = Comp> = Record<K, { component: C; args?: Args; modalArgs?: ModalArgs; event?: Event }>

const merge = (...args: string[]) => args.join('-')

const spreadModals = (type: string, modals: ModalsDef) =>
	Object.fromEntries(Object.entries(modals).map(([key, val]) => [merge(type, key), { ...val, type }]))

const registerModals = (stack: Ref<string[]>, modals: ModalsDef) => {
	const registeredTypes = {}

	const close = (id: string) => {
		stack.value = stack.value.filter((comp) => comp !== id)
	}

	const open = (id: string, args: Args, event?: Event) => {
		if (Object.keys(modals).includes(id) && !stack.value.includes(id)) {
			stack.value.push(id)
			modals[id].args = args
			modals[id].event = event
		}
	}

	function register<M extends ModalsDef<string>>(type: string, modalObject: M) {
		type Result = {
			[K in keyof M]: {
				open: (args: Omit<InstanceType<M[K]['component']>['$props'], 'close'>, e?: Event) => void
				close: () => void
			}
		} & { closeAll: () => void }

		if (registeredTypes[type]) return registeredTypes[type] as Result

		Object.assign(modals, spreadModals(type, modalObject))

		const keys = Object.keys(modalObject)

		const helpers = Object.fromEntries(
			keys.map((key) => [
				key,
				{
					open: (args: Args, event?: Event) => open(merge(type, key), args, event),
					close: () => close(merge(type, key)),
				},
			]),
		)

		const closeAll = () => keys.forEach((key) => helpers[key]?.close?.())

		registeredTypes[type] = { ...helpers, closeAll }
		return registeredTypes[type] as Result
	}

	return { register, open, close }
}

export const useModal = (stack: Ref<string[]>) => {
	const modals: ModalsDef = {}
	return { stack, modals, ...registerModals(stack, modals) }
}

export const usePopover = (stack: Ref<string[]>) => {
	const popovers: ModalsDef = {}
	return { stack, popovers, ...registerModals(stack, popovers) }
}

export const modal = useModal(ref([]))
export const popover = usePopover(ref([]))
