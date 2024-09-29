import path from 'path'
import { fileURLToPath } from 'url'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { OpenAI } from 'openai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

const getContent = async (pdfPath: string) => {
	const doc = await pdfjs.getDocument(pdfPath).promise
	const page = await doc.getPage(1)
	return await page.getTextContent()
}

const getItems = async (pdfPath: string) => {
	const content = await getContent(pdfPath)
	const items = content.items.map((item) => item.str)
	return items
}

async function main() {
	try {
		const pdfPath = path.join(__dirname, '..', '/sofa-web-frontend/EnergyScience.pdf')
		const pdfContent = await getItems(pdfPath)
		const chatCompletion = await client.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: `Generate a quiz based on the following educational content: ${pdfContent}. The quiz should include a title, description, image, relevant tags, and multiple-choice questions.`,
				},
			],
			model: 'gpt-40',
		})
		console.log(chatCompletion.choices[0].message.content)
	} catch (error) {
		console.error('An error occurred:', error)
	}
}

main()
