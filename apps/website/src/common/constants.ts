import { packageName } from 'sofa-logic/src/utils/environment'

export { apiBase as apiUrl, packageName, googleClientId } from 'sofa-logic/src/utils/environment'

const clientId = packageName.replace('.app', '')
const redirectURI = 'https://' + clientId.split('.').reverse().join('.')

export const appleDetails = {
  clientId,
  redirectURI,
  usePopup: true,
  scopes: 'name email',
  state: Date.now().toString()
}