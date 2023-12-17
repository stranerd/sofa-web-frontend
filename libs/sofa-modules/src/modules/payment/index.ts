export enum Currencies {
	NGN = 'NGN'
}

export type Saleable = {
	frozen: boolean
	price: {
		amount: number
		currency: Currencies
	}
}