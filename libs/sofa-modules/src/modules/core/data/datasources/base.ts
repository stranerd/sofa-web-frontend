import { EmitTypes } from '../../services/sockets'

export type Listeners<Model> = {
	[EmitTypes.created]: (model: Model) => void | Promise<void>
	[EmitTypes.updated]: (model: Model) => void | Promise<void>
	[EmitTypes.deleted]: (model: Model) => void | Promise<void>
}
