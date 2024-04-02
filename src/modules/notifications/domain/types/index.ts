export * from './notifications'

export type ToggleNotificationSeen = {
	seen: boolean
}

export type EnablePushInput = {
	enable: boolean
}

export type PushInput = {
	token: string
}
