import { MemberEntity } from '../entities/members'
import { IMemberRepository } from '../irepositories/members'
import { MemberTypes } from '../types'
import { Listeners } from '@modules/core'

export class MembersUseCase {
	repository: (organizationId: string) => IMemberRepository

	constructor(repo: (organizationId: string) => IMemberRepository) {
		this.repository = repo
	}

	async find(organizationId: string, email: string) {
		return await this.repository(organizationId).find(email)
	}

	async add(input: { organizationId: string; emails: string[]; type: MemberTypes }) {
		return await this.repository(input.organizationId).add(input)
	}

	async request(data: { type: MemberTypes; organizationId: string; code: string }) {
		return await this.repository(data.organizationId).request(data)
	}

	async accept(data: { organizationId: string; email: string; type: MemberTypes; accept: boolean }) {
		return await this.repository(data.organizationId).accept(data)
	}

	async leave(data: { organizationId: string; type: MemberTypes }) {
		return await this.repository(data.organizationId).leave(data)
	}

	async remove(data: { organizationId: string; email: string; type: MemberTypes }) {
		return await this.repository(data.organizationId).remove(data)
	}

	async getAll(organizationId: string) {
		return await this.repository(organizationId).get({
			all: true,
		})
	}

	async listenToAll(organizationId: string, listener: Listeners<MemberEntity>) {
		return await this.repository(organizationId).listenToMany({ all: true }, listener, () => true)
	}
}
