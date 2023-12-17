import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import { Report, Review, View } from '../types/domains/interactions'
import {
	AddReportInput,
	AddReviewInput,
	AddViewInput,
} from '../types/forms/common'
import Common from './Common'

export default class Interactions extends Common {
	constructor() {
		super()
	}

	public AllViews: Paginated<View> | undefined
	public SingleView: View | undefined
	public AllReviews: Paginated<Review> | undefined
	public SingleReview: Review | undefined
	public AllReports: Paginated<Report> | undefined
	public SingleReport: Report | undefined

	// Form input
	public CreateViewForm: AddViewInput | undefined
	public CreateReviewForm: AddReviewInput | undefined
	public CreateReportForm: AddReportInput | undefined

	public GetViews = (filters: QueryParams) => {
		return $api.interactions.views.fetch(filters).then((response) => {
			this.AllViews = response.data
		})
	}

	public GetView = (id: string) => {
		return $api.interactions.views.get(id).then((response) => {
			this.SingleView = response.data
		})
	}

	public GetReviews = (filters: QueryParams) => {
		return $api.interactions.reviews.fetch(filters).then((response) => {
			this.AllReviews = response.data
		})
	}

	public GetReview = (id: string) => {
		return $api.interactions.reviews.get(id).then((response) => {
			this.SingleReview = response.data
		})
	}

	public GetReports = (filters: QueryParams) => {
		return $api.interactions.reports.fetch(filters).then((response) => {
			this.AllReports = response.data
		})
	}

	public GetReport = (id: string) => {
		return $api.interactions.reports.get(id).then((response) => {
			this.SingleReport = response.data
		})
	}

	public CreateView = (CreateViewForm: AddViewInput) => {
		return $api.interactions.views
			.post(null, CreateViewForm)
			.then((response) => {
				this.SingleView = response.data
				return this.SingleView
			})
	}

	public CreateReview = (formIsValid: boolean) => {
		if (formIsValid && this.CreateReviewForm) {
			return $api.interactions.views
				.post(null, this.CreateReviewForm)
				.then((response) => {
					this.SingleReview = response.data
				})
				.catch((error) => {
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}

	public CreateReport = (formIsValid: boolean) => {
		if (formIsValid && this.CreateReportForm) {
			Logic.Common.showLoading()
			return $api.interactions.reports
				.post(null, this.CreateReportForm)
				.then((response) => {
					this.SingleReport = response.data
					Logic.Common.hideLoading()
					Logic.Common.showAlert({
						message: 'Your report has been sent',
						type: 'success',
					})
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}

	public DeleteReport = (id: string) => {
		return $api.interactions.reports
			.delete(id)
			.catch((error) => {
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
	}
}
