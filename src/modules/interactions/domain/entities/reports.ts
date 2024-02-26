import { ReportFromModel } from '../../data/models/reports'
import { BaseEntity } from '@modules/core'

export class ReportEntity extends BaseEntity<ReportFromModel> {
	constructor(data: ReportFromModel) {
		super(data)
	}
}
