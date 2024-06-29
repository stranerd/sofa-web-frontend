import { Preferences } from '@capacitor/preferences'

export const storage = {
	get: async <T>(key: string) => {
		const { value } = await Preferences.get({ key })
		if (!value) return null
		return JSON.parse(value) as T
	},
	set: async <T>(key: string, value: T) => {
		await Preferences.set({ key, value: JSON.stringify(value) })
	},
	remove: async (key: string) => {
		await Preferences.remove({ key })
	},
}
