import { parseURL } from '@utils/commons'
import { isAndroid, isIos } from '@utils/constants'

const isDev = import.meta.env.VITE_ENVIRONMENT === 'local'

export const isServer = () => false
export const isClient = () => true

const googleClients = JSON.parse(import.meta.env.VITE_GOOGLE_CLIENT_IDS ?? '{}')
const googleClientIds = {
	web: googleClients.web ?? '',
	android: googleClients.web ?? '',
	ios: googleClients.ios ?? ''
}

export const googleClientId = isIos ? googleClientIds.ios : isAndroid ? googleClientIds.android : googleClientIds.web

const host = import.meta.env.VITE_DOMAIN ?? ''
export const domain = parseURL(`http${!isDev ? 's' : ''}://${host}`)

export const apiBase = 'https://development.apis.sofa.stranerd.com/api' || parseURL(import.meta.env.VITE_API_URL ?? '')

export const packageName = import.meta.env.VITE_PACKAGE_NAME
