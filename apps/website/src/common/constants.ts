const googleClients = JSON.parse(process.env.VUE_APP_GOOGLE_CLIENT_IDS ?? '{}')

export const AuthClientIDs = {
  google_client_ids: {
    web: googleClients.web ?? '',
    android: googleClients.web ?? '',
    ios: googleClients.ios ?? ''
  },
}

export const packageName = process.env.VUE_APP_PACKAGE_NAME

export const apiUrl = process.env.VUE_APP_API_URL