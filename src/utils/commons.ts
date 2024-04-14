/* import { Clipboard } from '@capacitor/clipboard'
import { Share } from '@capacitor/share'
import { Notify } from '@utils/dialog' */
import { formatNumber } from 'valleyed'
import { isWeb } from '@utils/constants'

export const copyToClipboard = async (text: string) => {
	const result = await window.navigator.permissions.query({ name: 'clipboard-write' as any })
	if (result.state === 'granted' || result.state === 'prompt') {
		await window.navigator.clipboard.writeText(text)
		return true
	}
	return false
	// await Clipboard.write({ string: text })
}

export const share = async (data: { title: string; text: string; url: string }) => {
	try {
		await navigator.share(data)
		return true
	} catch {
		return false
	}
	/* const { value } = await Share.canShare()
	if (value) await Share.share({
		...data, dialogTitle: data.title
	})
	else {
		await copyToClipboard(url)
		await Notify({ message: 'Copied link to your clipboard!' })
	} */
}

const localURL = 'http://localhost'
const ngrokURL = 'https://local.stranerd.eu.ngrok.io'

export const parseURL = (url: string) => url.replace(isWeb ? ngrokURL : localURL, isWeb ? localURL : ngrokURL)
export const unParseURL = (url: string) => (!isWeb ? url.replace(ngrokURL, localURL) : url)

export const formatDuration = (duration: number) => {
	duration = duration < 0 ? 0 : duration
	const hours = Math.floor(duration / 3600)
	const minutes = Math.floor((duration - hours * 3600) / 60)
	const seconds = Math.floor(duration - hours * 3600 - minutes * 60)
	const paths = [minutes, seconds]
	if (hours > 0) paths.unshift(hours)
	return paths.map((x) => x.toString().padStart(2, '0')).join(':')
}

export const formatFileSize = (size: number) => {
	const ranges = [
		{ val: -1, key: 'b' },
		{ val: 1024, key: 'kb' },
		{ val: 1024 * 1024, key: 'mb' },
		{ val: 1024 * 1024 * 1024, key: 'gb' },
	]
	const range = ranges.find(({ val }) => size >= val)
	return `${formatNumber(size / (range?.val ?? -1))}${range?.key ?? 'b'}`
}

export const ordinalSuffixOf = (i: number) => {
	if (i <= 0) return '-'
	const j = i % 10,
		k = i % 100
	if (j == 1 && k != 11) return i + 'st'
	if (j == 2 && k != 12) return i + 'nd'
	if (j == 3 && k != 13) return i + 'rd'
	return i + 'th'
}
