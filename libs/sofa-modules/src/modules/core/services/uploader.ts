import { parseURL } from '@utils/commons'

export interface Media {
	name: string
	type: string
	size: number
	path: string
	timestamp: number
	duration: number
	link: string
}

export const parseMedia = (media: Media) => {
	media.link = parseURL(media.link)
	return media
}

export class UploadedFile {
	readonly name: string
	readonly path: string
	readonly type: string
	readonly size: number
	readonly data: Blob
	readonly ref: File

	constructor({ name, path, type, size, data, ref }: { name: string; path: string; type: string; size: number; data: Blob; ref: File }) {
		this.name = name
		this.path = path
		this.type = type
		this.size = size
		this.data = data
		this.ref = ref
	}

	get link() {
		return window.URL.createObjectURL(this.data)
	}

	static async convertBase64ToBlob(b64: string) {
		const byteCharacters = atob(b64)
		const byteNumbers = new Array(byteCharacters.length)
		for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i)
		const byteArray = new Uint8Array(byteNumbers)
		return new Blob([byteArray])
	}
}

declare module 'valleyed/lib/types' {
	interface File extends UploadedFile, Media {}
}
