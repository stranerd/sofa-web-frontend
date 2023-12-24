import { valleyed } from '@utils/commons'
import stringSimilarity from 'string-similarity'
import { reactive } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { Conditions, QueryParams } from '../types/common'
import { ContentDetails, FileData, Paginated } from '../types/domains/common'
import { Review, Tags } from '../types/domains/interactions'
import {
	Course,
	Folder,
	Question,
	QuestionAnswer,
	Quiz,
	SofaFile,
} from '../types/domains/study'
import { AddReviewInput, AddTagInput } from '../types/forms/common'
import {
	AddItemToCourseInput,
	CreateCourseInput,
	CreateDocumentInput,
	CreateFolderInput,
	CreateQuestionInput,
	CreateQuizInput,
	ReorderQuizInput,
	SaveItemToFolderInput,
	UpdateCourseSectionsInput,
} from '../types/forms/study'
import Common from './Common'

const { Differ, capitalize, stripHTML } = valleyed
const wrap = (v: string) => `<p>${v}</p>`

export default class Study extends Common {
	constructor() {
		super()
	}

	public Tags: Paginated<Tags> | undefined
	public AllTopics: Paginated<Tags> | undefined
	public AllOtherTags: Paginated<Tags> | undefined
	public SingleTag: Tags | undefined
	public AllFolders: Paginated<Folder> | undefined
	public AllFoldersCourses: Course[] | undefined
	public AllFoldersQuizzes: Quiz[] | undefined
	public SingleFolder: Folder | undefined
	public AllQuzzies: Paginated<Quiz> | undefined
	public TutorQuizzes: Paginated<Quiz> | undefined
	public SingleQuiz: Quiz | undefined
	public AllQuestions: Paginated<Question> | undefined
	public SingleQuestion: Question | undefined
	public AllCourses: Paginated<Course> | undefined
	public PurchasedCourses: Paginated<Course> | undefined
	public SingleCourse: Course | undefined
	public AllFiles: Paginated<SofaFile> | undefined
	public SingleFile: SofaFile | undefined
	public SaveItemToFolderForm: SaveItemToFolderInput | undefined
	public SingleMediaFile: FileData | undefined
	public NewCoursableItem: any
	public CoursableItemRemoved: any
	public UpdatedQuestion: Question | undefined
	public SingleCourseFiles: SofaFile[] | undefined
	public SingleCourseQuizzes: Quiz[] | undefined
	public SelectedMaterialDetails = reactive({
		title: '',
		descriptions: '',
	})
	public UpdatedFile: SofaFile | undefined
	public RecentMaterials: (Course | Quiz)[] | undefined
	public MyOrgMaterials: (Course | Quiz)[] | undefined
	public SuggestedMaterials: (Course | Quiz)[] | undefined
	public LatestMaterials: (Course | Quiz)[] | undefined
	public RatedMaterials: (Course | Quiz)[] | undefined
	public PopularMaterials: (Course | Quiz)[] | undefined
	public HomeMaterials:
    | {
        recent: (Course | Quiz)[]
        my_org: (Course | Quiz)[]
        suggested: (Course | Quiz)[]
      }
    | undefined

	public MarketplaceMaterials:
    | {
        lastest: (Course | Quiz)[]
        rated: (Course | Quiz)[]
        popular: (Course | Quiz)[]
      }
    | undefined
	public SingleReview: Review | undefined
	public AllReviews: Paginated<Review> | undefined

	// Form input
	public CreateTagForm: AddTagInput | undefined
	public UpdateTagForm: AddTagInput | undefined
	public CreateFolderForm: CreateFolderInput | undefined
	public UpdateFolderForm: CreateFolderInput | undefined
	public CreateQuizForm: CreateQuizInput | undefined
	public UpdateQuizForm: CreateQuizInput | undefined
	public CreateQuestionForm: CreateQuestionInput | undefined
	public UpdateQuestionForm: CreateQuestionInput | undefined
	public CreateCourseForm: CreateCourseInput | undefined
	public UpdateCourseForm: CreateCourseInput | undefined
	public CreateFileForm: CreateDocumentInput | undefined
	public UpdateFileForm: CreateDocumentInput | undefined
	public ReorderQuizQuestionsForm: ReorderQuizInput | undefined
	public MoveItemToCourseForm: AddItemToCourseInput | undefined
	public UpdateCourseSectionForm: UpdateCourseSectionsInput | undefined
	public AddReviewForm: AddReviewInput | undefined

	public questionSettings = reactive([])
	public selectedQuestion = reactive({})
	public quizDataUpdate = Math.random() * 100000
	public quizQuestionDeleted = Math.random() * 100000
	public contentDetails = reactive<ContentDetails>({
		original: null,
		type: 'course',
		route: '/marketplace/',
		price: 0,
		currency: 'NGN',
		image: '/images/default.png',
		title: '',
		status: '',
		id: '',
		hasCourse: true,
		info: '',
		courseId: '',
		labels: {
			color: 'pink',
			main: 'Course',
			sub: '',
		},
		ratings: {
			avg: 4,
			label: '24 ratings',
			count: 24,
			stats: {
				'5': 3,
				'4': 21,
				'3': 0,
				'2': 0,
				'1': 0,
			},
			reviews: [],
		},
		user: {
			name: '',
			photoUrl: '',
			role: 'Teacher',
			id: '',
			stats: {
				quizzes: 34,
				courses: 18,
				followers: '1.1k',
			},
		},
		lastUpdated: '',
		tags: [],
		content: {
			materialsCount: 11,
			sections: [],
		},
		questions: [],
	})

	public getQuestionTypeLabel (type: Question['strippedData']['type']) {
		const data = this.questionTypes[type] ?? this.questionTypes['multipleChoice']
		return data.extras.label
	}

	public getQuestionTypeIcon (type: Question['strippedData']['type']) {
		const data = this.questionTypes[type] ?? this.questionTypes['multipleChoice']
		return data.extras.icon
	}

	public getQuestionTypeImage (type: Question['strippedData']['type']) {
		const data = this.questionTypes[type] ?? this.questionTypes['multipleChoice']
		return data.extras.image
	}

	public getQuestionTypeTemplate (type: Question['strippedData']['type']) :CreateQuestionInput {
		const data = this.questionTypes[type] ?? this.questionTypes['multipleChoice']
		return data.template
	}

	public getAllQuestionTypes () {
		return Object.entries(this.questionTypes).map(([key, t]) => ({
			label: t.extras.label,
			value: key as Question['strippedData']['type'],
			icon: t.extras.icon,
			image: t.extras.image
		}))
	}

	public indicator = '----------'

	public questionTypes = {
		multipleChoice: {
			template: {
				question: wrap('Enter question'),
				questionMedia: null,
				timeLimit: 30,
				explanation: '',
				data: {
					type: 'multipleChoice' as const,
					options: ['a', 'b', 'c', 'd'].map(wrap),
					answers: [0,1]
				}
			},
			extras: {
				label: 'Multiple choice',
				image: 'multiple_choice',
				icon: 'multiple-choice-type'
			}
		},
		writeAnswer: {
			template: {
				question: wrap('Enter question'),
				questionMedia: null,
				timeLimit: 30,
				explanation: '',
				data: {
					type: 'writeAnswer' as const,
					answers: ['a', 'b'].map(wrap)
				}
			},
			extras: {
				label: 'Write answer',
				image: 'write_answer',
				icon: 'write-answer-type'
			}
		},
		trueOrFalse: {
			template: {
				question: wrap('Enter question'),
				questionMedia: null,
				timeLimit: 30,
				explanation: '',
				data: {
					type: 'trueOrFalse' as const,
					answer: true
				}
			},
			extras: {
				label: 'True/False',
				icon: 'true-false-type',
				image: 'true_false'
			}
		},
		fillInBlanks: {
			template: {
				question: `Enter question ${this.indicator} and another ${this.indicator}`,
				questionMedia: null,
				timeLimit: 30,
				explanation: '',
				data: {
					type: 'fillInBlanks' as const,
					indicator: this.indicator,
					answers: ['a', 'b']
				}
			},
			extras: {
				label: 'Fill in blank(s)',
				image: 'fill_in_blank',
				icon: 'fill-in-blanks-type'
			}
		},
		dragAnswers: {
			template: {
				question: `Enter question ${this.indicator} and another ${this.indicator}`,
				questionMedia: null,
				timeLimit: 30,
				explanation: '',
				data: {
					type: 'dragAnswers' as const,
					indicator: this.indicator,
					answers: ['a', 'b']
				}
			},
			extras: {
				label: 'Drag answers',
				image: 'drag_answer',
				icon: 'drag-answers-type'
			}
		},
		sequence: {
			template: {
				question: wrap('Enter question'),
				questionMedia: null,
				timeLimit: 30,
				explanation: '',
				data: {
					type: 'sequence' as const,
					answers: ['a', 'b', 'c', 'd', 'e', 'f'].map(wrap)
				}
			},
			extras: {
				label: 'Sequence',
				image: 'sequence',
				icon: 'sequence-type'
			}
		},
		match: {
			template: {
				question: wrap('Enter question'),
				questionMedia: null,
				timeLimit: 30,
				explanation: '',
				data: {
					type: 'match' as const,
					set: [
						{ q: 'Left 1', a: 'Right 1' },
						{ q: 'Left 2', a: 'Right 2' },
						{ q: 'Left 3', a: 'Right 3' },
						{ q: 'Left 4', a: 'Right 4' },
					].map((s) => ({ q: wrap(s.q), a: wrap(s.a) }))
				}
			},
			extras: {
				label: 'Match',
				image: 'match',
				icon: 'match-type'
			}
		}
	}

	public GetTagName = (id: string) => {
		const Tag = [
			...(this.Tags?.results || []),
			...(this.AllTopics?.results || []),
			...(this.AllOtherTags?.results || []),
		].filter((tag) => {
			return tag.id == id
		})

		if (Tag.length) {
			return Tag[0].title
		} else {
			return 'Not set'
		}
	}

	public GetTags = (filters: QueryParams) => {
		return $api.interactions.tag.fetch(filters).then((response) => {
			this.Tags = response.data
			return this.Tags
		})
	}

	public GetTopics = () => {
		return $api.interactions.tag
			.fetch({
				where: [
					{
						field: 'type',
						value: 'topics',
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				this.AllTopics = response.data
				return response.data
			})
	}

	public GetOtherTags = () => {
		return $api.interactions.tag
			.fetch({
				where: [
					{
						field: 'type',
						value: 'generic',
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				this.AllOtherTags = response.data
				return response.data
			})
	}

	public GetTag = (id: string) => {
		return $api.interactions.tag.get(id).then((response) => {
			this.SingleTag = response.data
		})
	}

	public async getFolders (filters: QueryParams) {
		return $api.study.folder.fetch(filters)
			.then((response) => response.data)
	}

	public GetFolders = async (filters: QueryParams, showLoader = false) => {
		if (showLoader) Logic.Common.showLoading()

		const response = await $api.study.folder.fetch(filters)
		const allFolderCourses: string[] = []
		const allFolderQuizzes: string[] = []
		this.AllFolders = response.data

		this.AllFolders.results.forEach((folder) => {
			allFolderCourses.push(...folder.saved.courses)
			allFolderQuizzes.push(...folder.saved.quizzes)
		})

		const allQuizzes = await $api.study.quiz.fetch({
			where: [
				{
					field: 'id',
					condition: Conditions.in,
					value: [...new Set(allFolderQuizzes)],
				},
			],
		})

		this.AllFoldersQuizzes = allQuizzes.data.results

		const allCourses = await $api.study.course.fetch({
			where: [
				{
					field: 'id',
					condition: Conditions.in,
					value: [...new Set(allFolderCourses)],
				},
			],
		})

		this.AllFoldersCourses = allCourses.data.results

		if (showLoader) Logic.Common.hideLoading()

		return this.AllFolders
	}

	public GetFolder = async (id: string) => {
		const folder: Folder | null = (await $api.study.folder.get(id)).data

		if (folder) await Promise.all([
			$api.study.course.fetch({
				where: [
					{
						field: 'id',
						value: folder.saved.courses,
						condition: Conditions.in,
					},
				],
				all: true,
			}).then((response) => {
				folder.courses = response.data.results
			}),
			$api.study.quiz
				.fetch({
					where: [
						{
							field: 'id',
							value: folder.saved.quizzes,
							condition: Conditions.in,
						},
					],
					all: true,
				}).then((response) => {
					folder.quizzes = response.data.results
				})
		])
		this.SingleFolder = folder
		return folder
	}

	public GetQuizzes = (filters: QueryParams, updateItems = true) :Promise<Paginated<Quiz>> => {
		return $api.study.quiz.fetch(filters).then((response) => {
			if (updateItems) this.AllQuzzies = response.data
			return response.data
		})
	}

	public GetTutorQuizzes = (filters: QueryParams) => {
		return $api.study.quiz.tutorQuizzes(filters).then((response) => {
			this.TutorQuizzes = response.data
			return this.TutorQuizzes
		})
	}

	public GetQuiz = async (id: string) => {
		if (!id || id == 'nill') return null
		return $api.study.quiz.get(id).then((response) => {
			this.SingleQuiz = response.data
			return this.SingleQuiz
		})
	}

	public GetQuestions = (quizId: string, filters: QueryParams = {}) :Promise<Paginated<Question> | undefined> => {
		if (!quizId || quizId == 'empty') return undefined
		return $api.study.quiz
			.getQuestions(quizId, filters)
			.then((response) => {
				this.AllQuestions = response.data
				return this.AllQuestions
			})
			.catch(() => {
				this.AllQuestions = undefined
				return undefined
			})
	}

	private compare (a: string, b: string, quality = 0.95) {
		return stringSimilarity.compareTwoStrings(
			stripHTML(a).toLowerCase().replaceAll(' ', '').trim(),
			stripHTML(b).toLowerCase().replaceAll(' ', '').trim()
		) >= quality
	}

	checkAnswer (question: Question, answer: any): boolean {
		if (!question.data) return false

		if (question.data.type === 'multipleChoice') {
			return Array.isArray(answer) && Differ.equal(answer.sort(), [...question.data.answers].sort())
		} else if (question.data.type === 'trueOrFalse') {
			return answer === question.data.answer
		} else if (question.data.type === 'writeAnswer') {
			return question.data.answers.some((a) => this.compare(a, answer))
		} else if (question.data.type === 'fillInBlanks') {
			const answers = question.data.answers
			return Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => this.compare(a, answers[i]))
		} else if (question.data.type === 'dragAnswers') {
			const answers = question.data.answers
			return Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => this.compare(a, answers[i], 1))
		} else if (question.data.type === 'sequence') {
			const answers = question.data.answers
			return Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => this.compare(a, answers[i], 1))
		} else if (question.data.type === 'match') {
			const questions = question.data.set
			return Array.isArray(answer) &&
				answer.length === questions.length &&
				answer.every((a, i) => this.compare(a, questions[i].a, 1))
		}
		return false
	}

	public transformQuestion (question: Question) {
		const type = question.strippedData.type

		return {
			...question,
			get type () {
				return type
			},
			get instruction () {
				if (type === 'multipleChoice') return 'Choose the right answer(s)'
				if (type === 'writeAnswer') return 'Type your answer'
				if (type === 'trueOrFalse') return 'Choose an answer'
				if (type === 'fillInBlanks') return 'Fill in the gaps'
				if (type === 'dragAnswers') return 'Drag answers'
				if (type === 'sequence') return 'Drag to rearrange'
				if (type === 'match') return 'Drag items on the right side to rearrange'
				return ''
			},
			get splitQuestions () {
				if (type === 'fillInBlanks' || type === 'dragAnswers') return question.question.split(question.strippedData.indicator)
				return []
			},
			get defaultAnswer () : QuestionAnswer {
				if (type === 'multipleChoice') return []
				if (type === 'writeAnswer') return ''
				if (type === 'trueOrFalse') return '' as unknown as boolean
				if (type === 'fillInBlanks') return new Array(this.splitQuestions.length - 1).fill('')
				if (type === 'dragAnswers') return []
				if (type === 'sequence') return question.strippedData.answers
				if (type === 'match') return this.matchAnswers
				return undefined
			},
			get dragAnswers () {
				if (type === 'dragAnswers') return question.strippedData.answers
				return []
			},
			get matchQuestions () {
				if (type === 'match') return question.strippedData.questions
				return []
			},
			get matchAnswers () {
				if (type === 'match') return question.strippedData.answers
				return []
			},
			get answer () {
				if (!question.data) return ''
				if (type === 'multipleChoice') return question.data.answers.map((idx) => question.data.options[idx]).join('<br>')
				if (type === 'writeAnswer') return question.data.answers.join('<br>-- or --<br>')
				if (type === 'trueOrFalse') return capitalize(question.data.answer.toString())
				if (['fillInBlanks', 'dragAnswers', 'sequence'].includes(type)) return question.data.answers.join('<br>')
				if (type === 'match') return question.data.set.map((s) => s.a).join('<br>')
				return ''
			}
		}
	}

	public getShape (index: number) {
		const shapes = [
			'circle',
			'triangle',
			'square',
			'kite'
		]
		return shapes[index % shapes.length]
	}

	public getShapeSize (shape: string) {
		if (shape == 'circle') return 'md:h-[23px] h-[20px]'
		if (shape == 'triangle') return 'md:h-[23px] h-[20px]'
		if (shape == 'square') return 'md:h-[23px] h-[20px]'
		if (shape == 'kite') return 'md:h-[23px] h-[20px]'
		return 'h-[23px]'
	}

	public GetQuestion = (quidId: string, questionId: string) => {
		return $api.study.quiz.getQuestion(quidId, questionId).then((response) => {
			this.SingleQuestion = response.data
		})
	}

	public GetCourses = (
		filters: QueryParams,
		updateItems = true,
	): Promise<Paginated<Course>> => {
		return $api.study.course.fetch(filters).then((response) => {
			if (updateItems) this.AllCourses = response.data
			return response.data
		})
	}

	public GetSimilarCourses = (courseId: string) => {
		return $api.study.course.similarCourses(courseId).then((response) => {
			return response.data
		})
	}

	public GetSimilarQuizzes = (quizId: string) => {
		return $api.study.quiz.similarQuizzes(quizId).then((response) => {
			return response.data
		})
	}

	public GetCoursesWithQuery = async (
		query = 'nill',
		tagId = '',
		userId = '',
	) => {
		const whereQuery = []

		if (tagId && tagId != 'nill') {
			whereQuery.push({
				field: 'tagIds',
				value: tagId,
				condition: Conditions.in,
			})
		}

		if (userId && userId != 'nill') {
			whereQuery.push({
				field: 'user.id',
				value: userId,
				condition: Conditions.eq,
			})

			await Logic.Users.GetUser(userId)
		}

		whereQuery.push({
			field: 'status',
			value: 'published',
			condition: Conditions.eq,
		})
		return $api.study.course
			.fetch({
				search: {
					fields: ['title'],
					value: query == 'nill' ? '' : query,
				},
				limit: 20,
				where: whereQuery,
			})
			.then((response) => {
				this.AllCourses = response.data
			})
	}

	public GetQuizzesWithQuery = async (
		query = 'nill',
		tagId = '',
		userId = '',
	) => {
		const whereQuery = []

		if (tagId && tagId != 'nill') {
			whereQuery.push({
				field: 'tagIds',
				value: tagId,
				condition: Conditions.in,
			})
		}

		if (userId && userId != 'nill') {
			whereQuery.push({
				field: 'user.id',
				value: userId,
				condition: Conditions.eq,
			})

			await Logic.Users.GetUser(userId)
		}

		whereQuery.push({
			field: 'status',
			value: 'published',
			condition: Conditions.eq,
		})

		return $api.study.quiz
			.fetch({
				search: {
					fields: ['title'],
					value: query == 'nill' ? '' : query,
				},
				limit: 20,
				where: whereQuery,
			})
			.then((response) => {
				this.AllQuzzies = response.data
			})
	}

	public GetCourse = (id: string, autoCreate = false) => {
		if (!id || id == 'nill') {
			if (autoCreate) {
				return new Promise((resolve) => {
					// create course
					this.CreateCourseForm = {
						title: 'Untitled Course',
						description: 'Here is the course description',
						price: {
							amount: 0,
							currency: 'NGN',
						},
						tags: [],
						topic: 'Physics',
					}

					this.CreateCourse(true)
						.then(async () => {
							// create two default sections
							Logic.Study.UpdateCourseSectionForm = {
								id: Logic.Study.SingleCourse.id,
								sections: [
									{
										items: [],
										label: 'Introdution',
									},
									{
										items: [],
										label: 'Section 1',
									},
								],
							}

							await this.UpdateCourseSection()
							Logic.Common.hideLoading()
							Logic.Common.GoToRoute(
								`/course/create?id=${Logic.Study.SingleCourse.id}`,
							)
						})
						.catch(() => {
							resolve('')
						})
				})
			} else {
				return new Promise((resolve) => {
					resolve('')
				})
			}
		}
		return new Promise((resolve) => {
			$api.study.course.get(id).then((response) => {
				const allCourseableFiles = response.data?.coursables
					?.filter((item) => item.type == 'file')
					.map((item) => item.id)
				const allCourseableQuizzes = response.data?.coursables
					?.filter((item) => item.type == 'quiz')
					.map((item) => item.id)

				const allCoursableDataRequests: Promise<any>[] = []

				// files
				allCoursableDataRequests.push(
					$api.study.file
						.fetch({
							where: [
								{
									field: 'id',
									value: allCourseableFiles,
									condition: Conditions.in,
								},
							],
						})
						.then((response) => {
							this.SingleCourseFiles = response.data.results
						}),
				)

				// quizzes

				allCoursableDataRequests.push(
					$api.study.quiz
						.fetch({
							where: [
								{
									field: 'id',
									value: allCourseableQuizzes,
									condition: Conditions.in,
								},
							],
						})
						.then((response) => {
							this.SingleCourseQuizzes = response.data.results
						}),
				)

				Promise.all(allCoursableDataRequests)
					.then(() => {
						this.SingleCourse = response.data
						resolve('')
					})
					.catch((error) => {
						console.log(error)
					})
			})
		})
	}

	public GoToStudyMode = async (mode: string, quizId) => {
		if (mode === 'practice' || mode === 'flashcard') {
			await Logic.Common.GoToRoute(`/quiz/${quizId}/${mode}`)
			return
		}

		if (mode === 'test') {
			Logic.Common.showLoading()
			await Logic.Plays.CreateTest(quizId)
				.then(async (data) => {
					Logic.Common.hideLoading()
					await Logic.Common.GoToRoute(`/tests/${data.id}`)
				})
				.catch(() => {
					Logic.Common.hideLoading()
				})
			return
		}
	}

	public GetHomeMaterials = async () => {
		this.HomeMaterials = {
			recent: await this.GetRecentMaterials(),
			my_org: await this.GetByMyOrgsMaterials(),
			suggested: await this.GetSuggestedMaterials(),
		}
	}

	public GetMarketplaceMaterials = async () => {
		const [latest, rated, popular] = await Promise.all([
			this.GetLatestMaterials(),
			this.GetRatedMaterials(),
			this.GetPopularMaterials(),
		])
		this.MarketplaceMaterials = { lastest: latest, rated, popular }
	}

	public GetRecentMaterials = () => {
		return $api.study.my_study.getRecentMaterials().then((response) => {
			this.RecentMaterials = response.data
			return response.data
		})
	}

	public GetByMyOrgsMaterials = () => {
		return $api.study.my_study.getByMyOrgsMaterials().then((response) => {
			this.MyOrgMaterials = response.data
			return response.data
		})
	}

	public GetSuggestedMaterials = () => {
		return $api.study.my_study.getSuggestedMaterials().then((response) => {
			this.SuggestedMaterials = response.data
			return response.data
		})
	}

	public GetLatestMaterials = () => {
		return $api.study.my_study.getLatestMaterials().then((response) => {
			this.LatestMaterials = response.data
			return response.data
		})
	}

	public GetPopularMaterials = () => {
		return $api.study.my_study.getPopularMaterials().then((response) => {
			this.PopularMaterials = response.data
			return response.data
		})
	}

	public GetRatedMaterials = () => {
		return $api.study.my_study.getRatedMaterials().then((response) => {
			this.RatedMaterials = response.data
			return response.data
		})
	}

	public GetFiles = (filters: QueryParams) => {
		return $api.study.file.fetch(filters).then((response) => {
			this.AllFiles = response.data
			return response.data
		})
	}

	public GetReviews = (uniqueId: string, type: 'quizzes' | 'courses') => {
		return $api.interactions.reviews
			.fetch({
				where: [
					{
						field: 'entity.id',
						value: uniqueId,
						condition: Conditions.eq,
					},
					{
						field: 'entity.type',
						value: type,
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				this.AllReviews = response.data
				return response.data
			})
	}

	public GetSingleReview = (uniqueId: string, type: 'quizzes' | 'courses') => {
		return $api.interactions.reviews
			.fetch({
				where: [
					{
						field: 'entity.id',
						value: uniqueId,
						condition: Conditions.eq,
					},
					{
						field: 'entity.type',
						value: type,
						condition: Conditions.eq,
					},
					{
						field: 'user.id',
						value: Logic.Auth.AuthUser.id,
						condition: Conditions.eq,
					},
				],
			})
			.then((response) => {
				if (response.data.results.length) {
					this.SingleReview = response.data.results[0]
				} else {
					this.SingleReview = undefined
				}

				return response.data
			})
	}

	public GetFileMedia = (fileId: string) => {
		return $api.study.file.getFileMedia(fileId).then((response) => {
			this.SingleMediaFile = response.data
			return response.data
		})
	}

	public CreateTag = (formIsValid: boolean) => {
		if (formIsValid && this.CreateTagForm) {
			return $api.interactions.tag
				.post(null, this.CreateTagForm)
				.then((response) => {
					this.SingleTag = response.data
				})
				.catch()
		}
	}

	public UpdateTag = (formIsValid: boolean, id: string) => {
		if (formIsValid && this.UpdateTagForm) {
			return $api.interactions.tag
				.put(null, id, this.CreateTagForm)
				.then((response) => {
					this.SingleTag = response.data
				})
				.catch()
		}
	}

	public CreateFolder = (CreateFolderForm: CreateFolderInput) => {
		return $api.study.folder
			.post(null, CreateFolderForm)
			.then((response) => {
				this.SingleFolder = response.data
				return this.SingleFolder
			})
	}

	public UpdateFolder = (id: string, UpdateFolderForm: CreateFolderInput) => {
		return $api.study.folder
			.put(null, id, UpdateFolderForm)
			.then((response) => {
				this.SingleFolder = response.data
				return this.SingleFolder
			})
	}

	public SaveItemToFolder = (formIsValid: boolean) => {
		if (formIsValid && this.SaveItemToFolderForm) {
			Logic.Common.showLoading()
			return $api.study.folder
				.saveItemToFolder(this.SaveItemToFolderForm)
				.then((response) => {
					this.SingleFolder = response.data
					Logic.Common.hideLoading()
					Logic.Common.showAlert({
						message: this.SaveItemToFolderForm.add
							? 'Material added to folder'
							: 'Material removed from folder',
						type: 'success',
					})
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}

	public AddReview = () => {
		if (this.AddReviewForm) {
			Logic.Common.showLoading()
			return $api.interactions.reviews
				.post(null, this.AddReviewForm)
				.then((response) => {
					this.SingleReview = response.data
					Logic.Common.hideLoading()
					Logic.Common.showAlert({
						message: 'Your review has been added',
						type: 'success',
					})
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}

	public CreateQuiz = (CreateQuizForm: CreateQuizInput) => {
		return $api.study.quiz
			.post(null, CreateQuizForm)
			.then((response) => {
				this.SingleQuiz = response.data
				return this.SingleQuiz
			})
	}

	public UpdateQuiz = (id: string, UpdateQuizForm: CreateQuizInput) => {
		return $api.study.quiz
			.put(null, id, UpdateQuizForm)
			.then((response) => {
				this.SingleQuiz = response.data
				return response.data
			})
	}

	public SaveCourseChangesToLocal = (
		UpdateCourseSections: UpdateCourseSectionsInput,
	) => {
		localStorage.setItem(
			'couse_section_update',
			JSON.stringify(UpdateCourseSections),
		)
	}

	public SaveCourseLocalChanges = () => {
		if (localStorage.getItem('couse_section_update')) {
			const content = JSON.parse(localStorage.getItem('couse_section_update'))

			this.UpdateCourseSectionForm = content

			const unsectioned = this.UpdateCourseSectionForm.sections.filter(
				(item) => item.label == 'unsectioned',
			)[0]
			if (unsectioned) {
				if (unsectioned.items.length > 0) {
					Logic.Common.showAlert({
						type: 'error',
						message:
              'Unsectioned has to be empty. Please, move all your materials to a section.',
					})
					return
				} else {
					this.UpdateCourseSectionForm.sections = this.UpdateCourseSectionForm.sections.filter(
						(item) => item.label != 'unsectioned',
					)
				}
			}
			this.UpdateCourseSection()
		}
	}

	public async PublishQuiz (id: string) {
		return $api.study.quiz
			.publishQuiz(id)
			.then((response) => {
				this.SingleQuiz = response.data
				return response.data
			})
	}

	public ReorderQuizQuestions = (id: string, ReorderQuizQuestionsForm: ReorderQuizInput) => {
		return $api.study.quiz
			.reorderQuiz(id, ReorderQuizQuestionsForm)
			.then((response) => {
				this.SingleQuiz = response.data
				return this.SingleQuiz
			})
	}

	public CreateQuestion = (quizId: string, CreateQuestionForm: CreateQuestionInput) => {
		return $api.study.quiz
			.createQuestion(quizId, CreateQuestionForm)
			.then((response) => {
				this.SingleQuestion = response.data
				return this.SingleQuestion
			})
	}

	public UpdateQuestion = (quizId: string, questionId: string, UpdateQuestionForm: CreateQuestionInput) => {
		return $api.study.quiz
			.updateQuestion(quizId, questionId, UpdateQuestionForm)
			.then((response) => {
				this.UpdatedQuestion = response.data
				return this.UpdatedQuestion
			})
	}

	public CreateCourse = (formIsValid: boolean) => {
		if (formIsValid && this.CreateCourseForm) {
			Logic.Common.showLoading()
			return $api.study.course
				.post(null, this.CreateCourseForm)
				.then((response) => {
					this.SingleCourse = response.data
					Logic.Common.hideLoading()
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					throw error
				})
		}
	}

	public UpdateCourse = (formIsValid: boolean, id: string) => {
		if (formIsValid && this.UpdateCourseForm) {
			Logic.Common.showLoading()
			return $api.study.course
				.put(null, id, this.UpdateCourseForm)
				.then((response) => {
					this.SingleCourse = response.data
					Logic.Common.hideLoading()
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
					throw error
				})
		}
	}

	public MoveItemToCourse = (formIsValid: boolean) => {
		if (formIsValid && this.MoveItemToCourseForm) {
			Logic.Common.showLoading()
			return $api.study.course
				.moveItemIntoCourse(this.MoveItemToCourseForm)
				.then((response) => {
					// update course section
					this.SingleCourse = response.data

					const currentSections = this.SingleCourse.sections

					if (!this.MoveItemToCourseForm.add) {
						currentSections.forEach((item) => {
							item.items = item.items.filter(
								(eachitem) =>
									eachitem.id != this.MoveItemToCourseForm.coursableId,
							)
						})

						this.UpdateCourseSectionForm = {
							id: response.data.id,
							sections: currentSections,
						}

						this.SaveCourseChangesToLocal(this.UpdateCourseSectionForm)

						this.CoursableItemRemoved = Logic.Common.makeId()
					} else {
						// remove items not in coursable
						currentSections.forEach((item) => {
							item.items = item.items.filter((eachitem) =>
								this.SingleCourse.coursables.includes(eachitem),
							)
						})

						this.UpdateCourseSectionForm = {
							id: response.data.id,
							sections: currentSections,
						}

						this.SaveCourseChangesToLocal(this.UpdateCourseSectionForm)
						this.NewCoursableItem = Logic.Common.makeId()
					}

					Logic.Common.hideLoading()
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}

	public UpdateCourseSection = () => {
		Logic.Common.showLoading()
		if (this.UpdateCourseSectionForm) {
			return $api.study.course
				.updateCourseSections(this.UpdateCourseSectionForm)
				.then((response) => {
					localStorage.removeItem('couse_section_update')
					this.SingleCourse = response.data
					Logic.Common.hideLoading()
					Logic.Common.showAlert({
						message: 'All changes have been saved',
						type: 'success',
					})

					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}

	public PublishCourse = (id: string) => {
		Logic.Common.showLoading()
		return $api.study.course
			.publishCourse(id)
			.then((response) => {
				this.SingleCourse = response.data
				Logic.Common.hideLoading()
			})
			.catch((error) => {
				Logic.Common.hideLoading()
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
	}

	public FreezeCourse = (id: string) => {
		return $api.study.course
			.freezeCourse(id)
			.then((response) => {
				this.SingleCourse = response.data
			})
			.catch((error) => {
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
	}

	public CreateFile = (formIsValid: boolean) => {
		if (formIsValid && this.CreateFileForm) {
			Logic.Common.showLoading()
			return $api.study.file
				.post(null, this.CreateFileForm)
				.then((response) => {
					this.SingleFile = response.data
					Logic.Common.hideLoading()
					return this.SingleFile
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}

	public UpdateFile = (formIsValid: boolean, id: string) => {
		if (formIsValid && this.UpdateFileForm) {
			return $api.study.file
				.put(null, id, this.UpdateFileForm)
				.then((response) => {
					this.UpdatedFile = response.data
				})
				.catch((error) => {
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
				})
		}
	}
	public DeleteTag = (id: string) => {
		return $api.interactions.tag
			.delete(id)
			.then()
			.catch()
	}

	public DeleteFolder = (id: string) => {
		Logic.Common.showLoading()
		return $api.study.folder
			.delete(id)
			.then(() => {
				Logic.Common.hideLoading()
				Logic.Study.GetFolders({
					where: [
						{
							field: 'user.id',
							value: Logic.Auth.AuthUser?.id,
							condition: Conditions.eq,
						},
					],
				})
			})
			.catch(() => {
				Logic.Common.hideLoading()
			})
	}

	public DeleteQuiz = (id: string) => {
		return $api.study.quiz
			.delete(id)
			.then((response) => {
				return response.data
			})
	}

	public DeleteQuestion = (id: string, quizId: string) => {
		return $api.study.quiz
			.deleteQuestion(quizId, id)
			.then((response) => {
				return response.data
			})
	}

	public DeleteCourse = (id: string) => {
		return $api.study.course
			.delete(id)
			.then()
			.catch()
	}

	public DeleteFile = (id: string) => {
		Logic.Common.showLoading()
		return $api.study.file
			.delete(id)
			.then((response) => {
				Logic.Common.hideLoading()
				return response.data
			})
			.catch(() => {
				//
				Logic.Common.hideLoading()
			})
	}

	public async requestAccess (id: string, add: boolean) {
		return $api.study.quiz
			.requestAccess(id, add)
			.then((res) => res.data)
	}

	public async grantAccess (id: string, userId: string, grant: boolean) {
		return $api.study.quiz
			.grantAccess(id, userId, grant)
			.then((res) => res.data)
	}

	public async manageMembers (id: string, userIds: string[], grant: boolean) {
		return $api.study.quiz
			.manageMembers(id, userIds, grant)
			.then((res) => res.data)
	}
}
