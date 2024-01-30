import { v } from 'valleyed'
import { ScheduleToModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../entities/schedules'
import { BaseFactory } from '@modules/core'

type Keys = Omit<ScheduleToModel, 'lessonId' | 'time'> & ScheduleToModel['time']

export class ScheduleFactory extends BaseFactory<ScheduleEntity, Omit<ScheduleToModel, 'lessonId'>, Keys> {
	readonly rules = {
		title: v.string().min(1),
		start: v.time().asStamp(),
		end: v.time().asStamp(),
	}

	constructor() {
		const now = Date.now()
		super({ title: '', start: now, end: now + 2 * 60 * 60 * 1000 })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	get start() {
		return this.values.start
	}

	set start(value: number) {
		this.set('start', value)
	}

	get end() {
		return this.values.end
	}

	set end(value: number) {
		this.set('end', value)
	}

	model = async () => {
		const { title, start, end } = this.validValues
		return { title, time: { start, end } }
	}

	loadEntity = (entity: ScheduleEntity) => {
		this.entityId = entity.id
		this.title = entity.title
		this.start = entity.time.start
		this.end = entity.time.end
	}
}
