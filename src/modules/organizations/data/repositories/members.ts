import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { MemberEntity } from '../../domain/entities/members'
import { IMemberRepository } from '../../domain/irepositories/members'
import { MemberTypes } from '../../domain/types'
import { MemberFromModel } from '../models/members'

export class MemberRepository implements IMemberRepository {
	private static instances: Record<string, MemberRepository> = {}
	private client: HttpClient
	private mapper = (model: MemberFromModel | null) => (model ? new MemberEntity(model) : null)

	private constructor(organizationId: string) {
		this.client = new HttpClient(`/organizations/${organizationId}/members`)
	}

	static getInstance(organizationId: string) {
		return (MemberRepository.instances[organizationId] ??= new MemberRepository(organizationId))
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<MemberFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)!),
		}
	}

	async find(email: string) {
		const d = await this.client.get<QueryParams, MemberFromModel | null>(`/${email}`, {})
		return this.mapper(d)
	}

	async listenToOne(id: string, listeners: Listeners<MemberEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<MemberEntity>, matches: (entity: MemberEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async add(data: { organizationId: string; emails: string[]; type: MemberTypes }) {
		const d = await this.client.post<
			{
				emails: string[]
				type: MemberTypes
			},
			MemberFromModel[]
		>('/', data)
		return d.map(this.mapper)
	}

	async request(data: { type: MemberTypes; organizationId: string; code: string }) {
		const d = await this.client.post<
			{
				code: string
				type: MemberTypes
			},
			MemberFromModel
		>('/request', data)
		return this.mapper(d)
	}

	async leave(data: { type: MemberTypes; organizationId: string }) {
		return await this.client.post<{ type: MemberTypes }, boolean>('/leave', data)
	}

	async remove(data: { email: string; type: MemberTypes; organizationId: string }) {
		return await this.client.post<{ type: MemberTypes; email: string }, boolean>('/remove', data)
	}

	async accept(data: { email: string; type: MemberTypes; organizationId: string; accept: boolean }) {
		return await this.client.post<{ type: MemberTypes; email: string; accept: boolean }, boolean>('/accept', data)
	}
}
