import { execSync } from 'child_process'

const content = process.env.BASE64_ZIPPED_CONTENT
const encodedFileName = 'encoded.txt'
const zippedFileName = 'comp.zip'

const command = `echo ${content} > ${encodedFileName} &&
base64 -d -i ${encodedFileName} -o ${zippedFileName} &&
rm ${encodedFileName} &&
unzip -o ${zippedFileName} -d ./bin/config/ &&
rm ${zippedFileName}`

console.log(execSync(command, { maxBuffer: 1024 * 1024 * 5 }).toString())
