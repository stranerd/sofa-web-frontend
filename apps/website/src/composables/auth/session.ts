import { AuthResponse, Logic } from 'sofa-logic'
import { useAuth } from './auth'

export const createSession = async (afterAuth: AuthResponse) => {
	await Logic.Auth.SetTokens(afterAuth)
	Logic.Common.SocketClient?.disconnect()

	if (!afterAuth.user.isEmailVerified) return await Logic.Common.GoToRoute('/auth/verify')

	const { setAuthUser, signin } = useAuth()
	await setAuthUser(afterAuth.user)
	const successful = await signin(false)
	if (successful) await Logic.Common.GoToRoute((await Logic.Auth.getRedirectToRoute()) ?? '/')
}
