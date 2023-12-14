import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { MemberEntity } from '../../domain/entities/members'
import { IMemberRepository } from '../../domain/irepositories/members'
import { MemberTypes } from '../../domain/types'
import { MemberMapper } from '../mappers/members'
import { MemberFromModel } from '../models/members'

export class MemberRepository implements IMemberRepository {
	private static instance: MemberRepository
	private client: HttpClient
	private mapper: MemberMapper

	private constructor () {
		this.client = new HttpClient(apiBase + '/organizations')
		this.mapper = new MemberMapper()
	}

	static getInstance () {
		if (!MemberRepository.instance) MemberRepository.instance = new MemberRepository()
		return MemberRepository.instance
	}

	async get (organizationId: string, query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<MemberFromModel>>(`/${organizationId}/members`, query)

		return {
			...d,
			results: d.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find (organizationId: string, email: string) {
		const d = await this.client.get<QueryParams, MemberFromModel | null>(`/${organizationId}/members/${email}`, {})
		return this.mapper.mapFrom(d)
	}

	async listenToOne (organizationId: string, id: string, listeners: Listeners<MemberEntity>) {
		const listener = listenToOne(`organizations/${organizationId}/members/${id}`, listeners, this.mapper.mapFrom)
		const model = await this.find(organizationId, id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (organizationId: string, query: QueryParams, listeners: Listeners<MemberEntity>, matches: (entity: MemberEntity) => boolean) {
		const listener = listenToMany(`organizations/${organizationId}/members`, listeners, this.mapper.mapFrom, matches)
		const models = await this.get(organizationId, query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}

	async add (data: { organizationId: string, emails: string[], type: MemberTypes }) {
		const d = await this.client.post<{
			emails: string[], type: MemberTypes
		}, MemberFromModel[]>(`/${data.organizationId}/members`, data)
		return d.map(this.mapper.mapFrom)
	}

	async request (data: { type: MemberTypes, organizationId: string, code: string }) {
		const d = await this.client.post<{
			code: string, type: MemberTypes
		}, MemberFromModel>(`/${data.organizationId}/members/request`, data)
		return this.mapper.mapFrom(d)
	}

	async leave (data: { type: MemberTypes, organizationId: string }) {
		return await this.client.post<{ type: MemberTypes }, boolean>(`/${data.organizationId}/members/leave`, data)
	}

	async remove (data: { email: string, type: MemberTypes, organizationId: string }) {
		return await this.client.delete<{ type: MemberTypes, email: string }, boolean>(`/${data.organizationId}/members`, data)
	}

	async accept (data: { email: string, type: MemberTypes, organizationId: string, accept: boolean }) {
		return await this.client.post<{ type: MemberTypes, email: string, accept: boolean }, boolean>(`/${data.organizationId}/members/accept`, data)
	}
}
