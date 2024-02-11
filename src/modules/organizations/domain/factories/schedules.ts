import { v } from 'valleyed'
import { ScheduleToModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../entities/schedules'
import { BaseFactory } from '@modules/core'
import { getDateString, getTimeString } from '@utils/dates'

type Keys = Omit<ScheduleToModel, 'lessonId' | 'time'> & { date: Date; start: Date; end: Date }

export class ScheduleFactory extends BaseFactory<ScheduleEntity, Omit<ScheduleToModel, 'lessonId'>, Keys> {
	readonly rules = {
		title: v.string().min(1),
		description: v.string().min(1),
		date: v.time().asDate(),
		start: v.time().asDate(),
		end: v.time().asDate(),
	}

	constructor() {
		const tmr = new Date()
		tmr.setDate(tmr.getDate() + 1)
		const end = new Date(tmr.getTime() + 2 * 60 * 60 * 1000)
		super({ title: '', description: '', date: tmr, start: tmr, end })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	get description() {
		return this.values.description
	}

	set description(value: string) {
		this.set('description', value)
	}

	get start() {
		return getTimeString(this.values.start)
	}

	set start(value: string) {
		this.set('start', `${this.date} ${value}`)
	}

	get end() {
		return getTimeString(this.values.end)
	}

	set end(value: string) {
		this.set('end', `${this.date} ${value}`)
	}

	get date() {
		return getDateString(this.values.date)
	}

	set date(value: string) {
		const valid = this.set('date', new Date(value))
		if (!valid) return
		this.start = '00:00'
		this.end = '02:00'
	}

	model = async () => {
		const { title, description, start, end } = this.validValues
		return {
			title,
			description,
			time: {
				start: start.getTime(),
				end: end.getTime(),
			},
		}
	}

	loadEntity = (entity: ScheduleEntity) => {
		this.entityId = entity.id
		this.title = entity.title
		this.description = entity.description
		const start = new Date(entity.time.start)
		this.date = getDateString(start)
		this.start = getTimeString(start)
		this.end = getTimeString(new Date(entity.time.end))
	}
}
