import { Listeners, QueryParams } from '@modules/core'
import { IMemberRepository } from '../irepositories/members'
import { MemberTypes } from '../types'
import { MemberEntity } from '../entities/members'

export class MembersUseCase {
	repository: IMemberRepository

	constructor (repo: IMemberRepository) {
		this.repository = repo
	}

	async find (organizationId, email: string) {
		return await this.repository.find(organizationId, email)
	}

	async get (organizationId: string, input: QueryParams) {
		return await this.repository.get(organizationId, input)
	}

	async add (input: { organizationId: string, emails: string[], type: MemberTypes }) {
		return await this.repository.add(input)
	}

	async request (data: { type: MemberTypes, organizationId: string, code: string }) {
		return await this.repository.request(data)
	}

	async accept (data: { organizationId: string, email: string, type: MemberTypes, accept: boolean }) {
		return await this.repository.accept(data)
	}

	async remove (data: { organizationId: string, email: string, type: MemberTypes }) {
		return await this.repository.remove(data)
	}

	async getAllMembers (organizationId: string) {
		return await this.repository.get(organizationId, {
			all: true
		})
	}

	async listenToAllMembers (organizationId: string, listener: Listeners<MemberEntity>) {
		return await this.repository.listenToMany(organizationId,
			{ all: true },
			listener,
			(entity) => true
		)
	}
}