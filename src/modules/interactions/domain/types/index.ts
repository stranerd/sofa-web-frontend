export enum InteractionEntities {
	comments = 'comments',
	courses = 'courses',
	quizzes = 'quizzes',
	users = 'users',
	quizQuestions = 'quizQuestions',
	conversations = 'conversations',
}

export type Interaction = {
	type: InteractionEntities
	id: string
}

export type InteractionEntity = Interaction & { userId: string }

export enum CommentMeta {
	comments = 'comments',
	total = 'total',
}

export enum TagMeta {
	courses = 'courses',
	quizzes = 'quizzes',
	images = 'images',
	documents = 'documents',
	videos = 'videos',

	total = 'total',
}

export enum TagTypes {
	generic = 'generic',
	topics = 'topics',
}
