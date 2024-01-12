import { Logic } from 'sofa-logic'
import { Ref, Component as Vue, ref } from 'vue'

type Args = Record<string, any>
type ModalsDef<K extends string = string, C = Vue> = Record<K, { component: C; args?: Args; modalArgs?: Args }>

const merge = (...args: string[]) => args.join('-')

const spreadModals = (type: string, modals: ModalsDef) =>
	Object.fromEntries(Object.entries(modals).map(([key, val]) => [merge(type, key), { component: val, type }]))

const registerModals = (stack: Ref<string[]>, modals: ModalsDef) => {
	const registeredTypes = {}

	const close = async (id: string) => {
		stack.value = stack.value.filter((comp) => comp !== id)
	}

	const open = async (id: string, args: any) => {
		if (Object.keys(modals).includes(id) && !stack.value.includes(id)) {
			stack.value.push(id)
			modals[id].args = args
		}
	}

	function register<Key extends string, C extends Vue & (abstract new (...args: any) => any)>(
		type: string,
		modalObject: ModalsDef<Key, C>,
	) {
		type Result = Record<
			`open${Capitalize<Key>}`,
			(args: Omit<InstanceType<(typeof modalObject)[Key]['component']>['$props'], 'close'>) => void
		> &
			Record<`close${Capitalize<Key>}`, () => void> & { closeAll: () => void }

		if (registeredTypes[type]) return registeredTypes[type] as Result

		Object.assign(modals, spreadModals(type, modalObject))

		const keys = Object.keys(modalObject)

		const helpers = Object.fromEntries(
			keys
				.map((key) => {
					return [
						[`open${Logic.capitalize(key)}`, (args: Args) => open(merge(type, Logic.capitalize(key)), args)],
						[`close${Logic.capitalize(key)}`, () => close(merge(type, Logic.capitalize(key)))],
					]
				})
				.flat(1),
		)

		const closeAll = () => keys.forEach((key) => helpers[`close${Logic.capitalize(key)}`]?.())

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
