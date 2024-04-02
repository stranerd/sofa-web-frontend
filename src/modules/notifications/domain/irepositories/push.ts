import { EnablePushInput, PushInput } from '../types'

export interface IPushRepository {
	enable: (data: EnablePushInput) => Promise<boolean>
	subscribe: (data: PushInput) => Promise<boolean>
	unsubscribe: (data: PushInput) => Promise<boolean>
}
