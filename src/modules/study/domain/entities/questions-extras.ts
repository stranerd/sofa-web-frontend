import { QuestionToModel } from '../../data/models/questions'
import { QuestionTypes } from '../types'

const wrap = (v: string) => `<p>${v}</p>`

export const indicator = '----------'

const defaultQuestion = {
	question: wrap('Enter question'),
	questionMedia: null,
	timeLimit: 30,
	explanation: '',
}

export const questionTypes: Record<QuestionTypes, { template: QuestionToModel; extras: { label: string; image: string; icon: IconName } }> =
	{
		[QuestionTypes.multipleChoice]: {
			template: {
				...defaultQuestion,
				data: {
					type: QuestionTypes.multipleChoice,
					options: ['a', 'b', 'c', 'd'].map(wrap),
					answers: [0, 1],
				},
			},
			extras: {
				label: 'Multiple choice',
				image: 'multiple-choice',
				icon: 'question-multiple-choice',
			},
		},
		[QuestionTypes.writeAnswer]: {
			template: {
				...defaultQuestion,
				data: {
					type: QuestionTypes.writeAnswer,
					answers: ['a', 'b'].map(wrap),
				},
			},
			extras: {
				label: 'Write answer',
				image: 'write-answer',
				icon: 'question-write-answer',
			},
		},
		[QuestionTypes.trueOrFalse]: {
			template: {
				...defaultQuestion,
				data: {
					type: QuestionTypes.trueOrFalse,
					answer: true,
				},
			},
			extras: {
				label: 'True/False',
				image: 'true-false',
				icon: 'question-true-false',
			},
		},
		[QuestionTypes.fillInBlanks]: {
			template: {
				...defaultQuestion,
				question: `Enter question ${indicator} and another ${indicator}`,
				data: {
					type: QuestionTypes.fillInBlanks,
					indicator: indicator,
					answers: ['a', 'b'],
				},
			},
			extras: {
				label: 'Fill in blank(s)',
				image: 'fill-in-blanks',
				icon: 'question-fill-in-blanks',
			},
		},
		[QuestionTypes.dragAnswers]: {
			template: {
				...defaultQuestion,
				question: `Enter question ${indicator} and another ${indicator}`,
				data: {
					type: QuestionTypes.dragAnswers,
					indicator: indicator,
					answers: ['a', 'b'],
				},
			},
			extras: {
				label: 'Drag answers',
				image: 'drag-answers',
				icon: 'question-drag-answers',
			},
		},
		[QuestionTypes.sequence]: {
			template: {
				...defaultQuestion,
				data: {
					type: QuestionTypes.sequence,
					answers: ['a', 'b', 'c', 'd', 'e', 'f'].map(wrap),
				},
			},
			extras: {
				label: 'Sequence',
				image: 'sequence',
				icon: 'question-sequence',
			},
		},
		[QuestionTypes.match]: {
			template: {
				...defaultQuestion,
				data: {
					type: QuestionTypes.match,
					set: [
						{ q: 'Left 1', a: 'Right 1' },
						{ q: 'Left 2', a: 'Right 2' },
						{ q: 'Left 3', a: 'Right 3' },
						{ q: 'Left 4', a: 'Right 4' },
					].map((s) => ({ q: wrap(s.q), a: wrap(s.a) })),
				},
			},
			extras: {
				label: 'Match',
				image: 'match',
				icon: 'question-match',
			},
		},
	}
