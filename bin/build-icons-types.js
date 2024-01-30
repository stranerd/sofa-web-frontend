import * as fs from 'fs'

const iconPath = 'public/images/icons'
const tsFile = 'src/types/icons.ts'

if (fs.existsSync(iconPath)) {
	const iconsPath = fs.readdirSync(iconPath)
	const iconsNames = iconsPath.map((icon) => icon.split('.svg')[0])

	const literalTypesFromIconsNames = iconsNames.map((iconName) => `'${iconName}'`)

	const tsFileContent = ['export type IconName =', ...literalTypesFromIconsNames].join('\n\t| ') + '\n'
	fs.writeFileSync(tsFile, tsFileContent)
}
