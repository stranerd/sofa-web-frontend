import { parseURL } from '@utils/commons'
import { isAndroid, isIos } from '@utils/constants'

const isDev = process.env.VUE_APP_ENVIRONMENT === 'local'

export const isServer = () => false
export const isClient = () => true

const googleClients = JSON.parse(process.env.VUE_APP_GOOGLE_CLIENT_IDS ?? '{}')
const googleClientIds = {
	web: googleClients.web ?? '',
	android: googleClients.web ?? '',
	ios: googleClients.ios ?? ''
}

export const googleClientId = isIos ? googleClientIds.ios : isAndroid ? googleClientIds.android : googleClientIds.web

const host = process.env.VUE_APP_DOMAIN ?? ''
export const domain = parseURL(`http${!isDev ? 's' : ''}://${host}`)

export const apiBase = 'https://development.apis.sofa.stranerd.com/api' || parseURL(process.env.VUE_APP_API_URL ?? '')

export const packageName = process.env.VUE_APP_PACKAGE_NAME
