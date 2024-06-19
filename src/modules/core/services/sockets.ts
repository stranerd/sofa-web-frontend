import io, { Socket } from 'socket.io-client'
import { StatusCodes } from './http'
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

type SocketEmit<Model> = {
	channel: string
} & (
	| {
			type: EmitTypes.created
			before: null
			after: Model
	  }
	| {
			type: EmitTypes.updated
			before: Model
			after: Model
	  }
	| {
			type: EmitTypes.deleted
			before: Model
			after: null
	  }
)

type SockerListener<Model> = Record<keyof Listeners<Model>, (data: SocketEmit<Model>) => Promise<unknown>>

async function listenOnSocket<Model>(channel: string, listeners: SockerListener<Model>, query: Record<string, any>) {
	const { accessToken } = await getTokens()
	// @ts-expect-error token is not defined in the Socket auth
	if (!socket || (!socket.auth['token'] && accessToken) || (accessToken && socket.auth['token'] !== accessToken)) {
		const url = new URL(`${$utils.environment.apiBase}/socket.io`)
		socket = io(url.origin, {
			path: url.pathname,
			auth: { token: accessToken },
		})
	}

	let finalChannel = ''
	socket.emit('join', { channel, query }, (res: SocketReturn) => {
		finalChannel = res.channel
		if (res.code !== StatusCodes.Ok) return
		socket?.on(finalChannel, async (data: SocketEmit<any>) => {
			if (finalChannel !== data.channel) return
			await listeners[data.type]?.(data)
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
			created: async (data) => {
				if (!data.after) return
				await listeners.created(mapper(data.after))
			},
			updated: async (data) => {
				if (!data.after) return
				await listeners.updated(mapper(data.after))
			},
			deleted: async (data) => {
				if (!data.before) return
				await listeners.deleted(mapper(data.before))
			},
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
			created: async (data) => {
				if (!data.after) return
				const entity = mapper(data.after)
				if (matches(entity)) await listeners.created(entity)
			},
			updated: async (data) => {
				if (!data.after || !data.before) return
				const after = mapper(data.after)
				const before = mapper(data.before)
				if (matches(after)) await listeners.updated(after)
				else if (matches(before)) await listeners.deleted(after)
			},
			deleted: async (data) => {
				if (!data.before) return
				const entity = mapper(data.before)
				if (matches(entity)) await listeners.deleted(entity)
			},
		},
		query,
	)
}

export async function closeSocket() {
	socket?.disconnect()
}
