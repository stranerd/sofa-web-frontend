import { v } from 'valleyed'
import { ScheduleToModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../entities/schedules'
import { getDateString, getTimeString } from '@utils/dates'
import { BaseFactory } from '@modules/core'

type Keys = Omit<ScheduleToModel, 'lessonId' | 'time'> & { timeDate: Date; timeStart: Date; timeEnd: Date }

export class ScheduleFactory extends BaseFactory<ScheduleEntity, Omit<ScheduleToModel, 'lessonId'>, Keys> {
	readonly rules = {
		title: v.string().min(1),
		description: v.string().min(1),
		timeDate: v.time().asDate(),
		timeStart: v.time().asDate(),
		timeEnd: v.time().asDate(),
	}

	constructor() {
		const tmr = new Date()
		tmr.setDate(tmr.getDate() + 1)
		const end = new Date(tmr.getTime() + 2 * 60 * 60 * 1000)
		super({ title: '', description: '', timeDate: tmr, timeStart: tmr, timeEnd: end })
	}

	get start() {
		return getTimeString(this.values.timeStart)
	}

	set start(value: string) {
		this.set('timeStart', `${this.date} ${value}`)
	}

	get end() {
		return getTimeString(this.values.timeEnd)
	}

	set end(value: string) {
		this.set('timeEnd', `${this.date} ${value}`)
	}

	get date() {
		return getDateString(this.values.timeDate)
	}

	set date(value: string) {
		const valid = this.set('timeDate', new Date(value))
		if (!valid) return
		this.start = '00:00'
		this.end = '02:00'
	}

	model = () => {
		const { title, description, timeStart, timeEnd } = this.validValues
		return {
			title,
			description,
			time: {
				start: timeStart.getTime(),
				end: timeEnd.getTime(),
			},
		}
	}

	load = (entity: ScheduleEntity) => {
		this.entityId = entity.id
		this.title = entity.title
		this.description = entity.description
		const start = new Date(entity.time.start)
		this.date = getDateString(start)
		this.start = getTimeString(start)
		this.end = getTimeString(new Date(entity.time.end))
	}
}
