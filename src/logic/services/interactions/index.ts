import ReportsApi from './ReportsApi'
import ReviewsApi from './ReviewsApi'
import TagsApi from './TagsApi'
import ViewsApi from './ViewsApi'

export const InteractionApi = {
	tag: new TagsApi(),
	reports: new ReportsApi(),
	reviews: new ReviewsApi(),
	views: new ViewsApi(),
}
