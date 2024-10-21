import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { chunkArray } from 'valleyed'
import { UploadedFile } from '@modules/core'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const getContents = async (
	width: number,
	height: number,
	text: string,
	populateCanvas: (context: CanvasRenderingContext2D) => Promise<void>,
) => {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const context = canvas.getContext('2d')!

	await populateCanvas(context as any)
	const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)))
	const url = URL.createObjectURL(blob)
	return {
		text,
		image: url,
	}
}

async function getPDFContent(content: ArrayBuffer) {
	const pdfDocument = await pdfjsLib.getDocument(content).promise

	const res = new Array(pdfDocument.numPages)
		.fill(0)
		.map((_, i) => i + 1)
		.map(async (i) => {
			const page = await pdfDocument.getPage(i)

			const viewport = page.getViewport({ scale: 0.5 })

			return getContents(
				viewport.width,
				viewport.height,
				await page.getTextContent().then((content) =>
					content.items.reduce((acc, cur) => {
						if ('type' in cur) return acc
						return acc + cur.str + (cur.hasEOL ? '\n' : '')
					}, ''),
				),
				async (canvasContext) => {
					await page.render({ canvasContext, viewport }).promise
				},
			)
		})

	return Promise.all(res)
}

async function getTxtContent(content: ArrayBuffer) {
	const charsPerLine = 48
	const linesPerPage = 48
	const lines = content
		.toString()
		.split('\n')
		.flatMap((line) => chunkArray(line.split(''), charsPerLine).map((line) => line.join('')))

	const charWidth = 1
	const lineHeight = charWidth * 2
	const xPadding = 5
	const yPadding = 3
	const [width, height] = [(charsPerLine + 2 * xPadding) * charWidth, (linesPerPage + 2 * yPadding) * lineHeight]

	const res = chunkArray(lines, linesPerPage).map(async (page) =>
		getContents(width, height, page.join('\n'), async (context) => {
			context.fillStyle = '#ffffff'
			context.fillRect(0, 0, context.canvas.width, context.canvas.height)
			context.fillStyle = '#000000'
			context.font = `${(charWidth * 10) / 5.56}px Arial`

			page.forEach((line, i) => {
				context.fillText(line, xPadding * charWidth, (yPadding + i) * lineHeight)
			})
		}),
	)

	return Promise.all(res)
}

export async function generatePreview(media: UploadedFile) {
	if (media.type === 'application/pdf') {
		return getPDFContent(await media.data.arrayBuffer())
	} else if (media.type === 'text/plain') {
		return getTxtContent(await media.data.arrayBuffer())
	}
	throw new Error(`Unsupported file type: ${media.type}`)
}
