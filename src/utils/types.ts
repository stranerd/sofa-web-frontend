interface showType {
	show?: boolean
}

export interface contentType extends showType {
	title: string
	desc?: string
	heading: string
	sub_heading?: string
	content: string
	link: string
}

export interface IMoreOnStranerd {
	study: contentType
	classes: contentType
	place: contentType
	create: contentType
	testimonial: showType
	learningCenters: showType
	faqs: showType
	getApp: showType
	access: showType
	discover: showType
}
