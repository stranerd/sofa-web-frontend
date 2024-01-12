import { Logic } from 'sofa-logic'
import { Ref, Component as Vue, ref } from 'vue'

const merge = (...args: string[]) => args.join('')

const spreadModals = <T>(type: string, modals: Record<string, T>) =>
	Object.fromEntries(Object.entries(modals).map(([key, val]) => [merge(type, key), { component: val, type }]))

const registerModals = (stack: Ref<string[]>, modals: Record<string, any>) => {
	const registeredTypes = {}

	const close = async (id: string) => {
		stack.value = stack.value.filter((comp) => comp !== id)
	}

	const open = async (id: string, ...args: any[]) => {
		if (Object.keys(modals).includes(id) && !stack.value.includes(id)) {
			stack.value.push(id)
			modals[id].args = args
		}
	}

	function register<Key extends string>(type: string, modalObject: Record<Key, Vue>) {
		type Result = Record<`open${Capitalize<Key>}` | `close${Capitalize<Key>}`, () => void> & { closeAll: () => void }

		if (registeredTypes[type]) return registeredTypes[type] as Result

		Object.assign(modals, spreadModals(type, modalObject))

		const helpers = Object.fromEntries(
			Object.keys(modalObject)
				.map((key) => Logic.capitalize(key))
				.map((key) => {
					return [
						[`open${key}`, async (...args: any[]) => open(merge(type, key), ...args)],
						[`close${key}`, async () => close(merge(type, key))],
					]
				})
				.reduce((acc, curr) => acc.concat(curr), []),
		) as Record<`open${Capitalize<Key>}` | `close${Capitalize<Key>}`, () => void>

		const closeAll = () => Object.keys(modalObject).forEach((key) => helpers[`close${Logic.capitalize(key) as Capitalize<Key>}`]?.())

		registeredTypes[type] = { ...helpers, closeAll }
		return registeredTypes[type] as Result
	}

	return { register, open, close }
}

export const useModal = (stack: Ref<string[]>) => {
	const modals = {} as Record<string, { component: Vue; args: any[] }>
	return { stack, modals, ...registerModals(stack, modals) }
}

export const usePopover = (stack: Ref<string[]>) => {
	const popovers = {} as Record<string, { component: Vue; args: any[] }>
	return { stack, popovers, ...registerModals(stack, popovers) }
}

export const modal = useModal(ref([]))
export const popover = usePopover(ref([]))
