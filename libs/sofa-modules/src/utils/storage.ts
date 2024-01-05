// import { Preferences } from '@capacitor/preferences'

export const storage = {
	get: async (key: string) => {
		// const { value } = await Preferences.get({ key })
		const value = localStorage.getItem(key)
		if (!value) return null
		return JSON.parse(value as string)
	},
	set: async (key: string, value: any) => {
		// await Preferences.set({ key, value: JSON.stringify(value) })
		localStorage.setItem(key, JSON.stringify(value))
	},
	remove: async (key: string) => {
		// await Preferences.remove({ key })
		localStorage.removeItem(key)
	},
}
