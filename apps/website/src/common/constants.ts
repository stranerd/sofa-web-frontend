const googleClients = JSON.parse(process.env.VUE_APP_GOOGLE_CLIENT_IDS ?? '{}')

export const AuthClientIDs = {
  google_client_ids: {
    web: googleClients.web ?? '',
    android: googleClients.web ?? '',
    ios: googleClients.ios ?? ''
  },
}

export const apiUrl = process.env.VUE_APP_API_URL

const packageName = process.env.VUE_APP_PACKAGE_NAME

const clientId = packageName.replace('.app', '')
const redirectURI = 'https://' + clientId.split('.').reverse().join('.')

export const appleDetails = {
  clientId,
  redirectURI,
  usePopup: true,
  scopes: 'name email',
  state: Date.now().toString()
}