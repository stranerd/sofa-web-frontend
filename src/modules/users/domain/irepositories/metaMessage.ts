import { MetaMessageData } from '../types'
export interface IMetaMessageRepository {
	send: (value: MetaMessageData) => Promise<boolean>
}
