import io, { Socket } from 'socket.io-client'
import { StatusCodes } from './http'
import { apiBase } from '@utils/environment'
import { getTokens } from '@utils/tokens'

let socket = null as Socket<any, any> | null

export enum EmitTypes {
	created = 'created',
	updated = 'updated',
	deleted = 'deleted',
}

export type Listeners<Model> = {
	[EmitTypes.created]: (model: Model) => void | Promise<void>
	[EmitTypes.updated]: (model: Model) => void | Promise<void>
	[EmitTypes.deleted]: (model: Model) => void | Promise<void>
}

type SocketReturn = { code: StatusCodes; message: string; channel: string }

async function listenOnSocket<Model>(channel: string, listeners: Listeners<Model>, query: Record<string, any>) {
	const { accessToken } = await getTokens()
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (!socket || (!socket.auth['token'] && accessToken) || (accessToken && socket.auth['token'] !== accessToken)) {
		const url = new URL(`${apiBase}/socket.io`)
		socket = io(url.origin, {
			path: url.pathname,
			auth: { token: accessToken },
		})
	}

	let finalChannel = ''
	socket.emit('join', { channel, query }, (res: SocketReturn) => {
		finalChannel = res.channel
		if (res.code !== StatusCodes.Ok) return
		socket?.on(finalChannel, async (data: { channel: string; type: EmitTypes; data: Model }) => {
			if (finalChannel !== data.channel) return
			await listeners[data.type]?.(data.data)
		})
	})
	return () => {
		try {
			socket?.emit('leave', { channel: finalChannel }, () => {
				/* any cleanup fn */
			})
		} catch (e) {
			console.log(e)
		}
	}
}

export async function listenToOne<Model, Entity>(
	channel: string,
	listeners: Listeners<Entity>,
	mapper: (model: Model) => Entity,
	query: Record<string, any> = {},
) {
	return listenOnSocket<Model>(
		channel,
		{
			created: async (model) => await listeners.created(mapper(model)),
			updated: async (model) => await listeners.updated(mapper(model)),
			deleted: async (model) => await listeners.deleted(mapper(model)),
		},
		query,
	)
}

export async function listenToMany<Model, Entity>(
	channel: string,
	listeners: Listeners<Entity>,
	mapper: (model: Model) => Entity,
	matches: (entity: Entity) => boolean = () => true,
	query: Record<string, any> = {},
) {
	return listenOnSocket<Model>(
		channel,
		{
			created: async (model) => {
				const entity = mapper(model)
				if (matches(entity)) await listeners.created(entity)
			},
			updated: async (model) => {
				const entity = mapper(model)
				if (matches(entity)) await listeners.updated(entity)
			},
			deleted: async (model) => {
				const entity = mapper(model)
				if (matches(entity)) await listeners.deleted(entity)
			},
		},
		query,
	)
}

export async function closeSocket() {
	socket?.disconnect()
}
