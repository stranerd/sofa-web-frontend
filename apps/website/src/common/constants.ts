import { packageName } from '@utils/environment'

export { googleClientId, packageName } from '@utils/environment'

const clientId = packageName.replace('.app', '')
const redirectURI = 'https://' + clientId.split('.').reverse().join('.')

export const appleDetails = {
	clientId,
	redirectURI,
	usePopup: true,
	scopes: 'name email',
	state: Date.now().toString()
}