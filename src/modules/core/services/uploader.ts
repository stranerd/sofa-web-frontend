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

export class UploadedFile implements Media {
	readonly name: string
	readonly path: string
	readonly link: string
	readonly type: string
	readonly size: number
	readonly duration = 0
	readonly timestamp = Date.now()
	readonly data: Blob
	readonly ref: File

	constructor({ file }: { file: File }) {
		this.name = file.name
		this.path = file.webkitRelativePath
		this.link = window.URL.createObjectURL(file)
		this.type = file.type
		this.size = file.size
		this.data = file.slice()
		this.ref = file
	}

	static async convertBase64ToBlob(b64: string) {
		const byteCharacters = atob(b64)
		const byteNumbers = new Array(byteCharacters.length)
		for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i)
		const byteArray = new Uint8Array(byteNumbers)
		return new Blob([byteArray])
	}

	static is(val: any): val is UploadedFile {
		return val?.constructor?.name === 'UploadedFile'
	}
}

declare module 'valleyed/lib/types' {
	interface File extends UploadedFile, Media {}
}
