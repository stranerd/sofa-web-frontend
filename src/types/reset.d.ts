import '@total-typescript/ts-reset'

declare global {
	interface Window {
		FlutterwaveCheckout: (args: object) => { close: () => void }
	}
}
