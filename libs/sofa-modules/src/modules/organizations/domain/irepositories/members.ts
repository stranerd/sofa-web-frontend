import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { MemberEntity } from '../entities/members'
import { MemberTypes } from '../types'

export interface IMemberRepository {
	find: (organizationId: string, email: string) => Promise<MemberEntity | null>
	get: (organizationId: string, query: QueryParams) => Promise<QueryResults<MemberEntity>>
	add: (data: { organizationId: string, emails: string[], type: MemberTypes }) => Promise<MemberEntity[]>
	request: (data: { email: string, type: MemberTypes, organizationId: string, code: string }) => Promise<MemberEntity>
	accept: (data: { email: string, type: MemberTypes, organizationId: string, accept: boolean }) => Promise<boolean>
	leave: (data: { organizationId: string, type: MemberTypes }) => Promise<boolean>
	remove: (data: { organizationId: string, email: string, type: MemberTypes }) => Promise<boolean>
	listenToOne: (organizationId: string, email: string, listeners: Listeners<MemberEntity>) => Promise<() => void>
	listenToMany: (organizationId: string, query: QueryParams, listeners: Listeners<MemberEntity>,  matches: (entity: MemberEntity) => boolean) => Promise<() => void>
}