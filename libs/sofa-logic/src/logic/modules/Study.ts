import { valleyed } from '@utils/commons'
import { reactive } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { Conditions, QueryParams } from '../types/common'
import { ContentDetails, FileData, Paginated } from '../types/domains/common'
import { Review, Tags } from '../types/domains/interactions'
import { Course, Quiz, SofaFile } from '../types/domains/study'
import { AddReviewInput, AddTagInput } from '../types/forms/common'
import {
	AddItemToCourseInput,
	CreateCourseInput,
	CreateDocumentInput,
	ReorderQuizInput,
	UpdateCourseSectionsInput,
} from '../types/forms/study'
import Common from './Common'

const { capitalize } = valleyed
const wrap = (v: string) => `<p>${v}</p>`

export default class Study extends Common {
	constructor() {
		super()
	}

	public Tags: Paginated<Tags> | undefined
	public AllTopics: Paginated<Tags> | undefined
	public AllOtherTags: Paginated<Tags> | undefined
	public SingleTag: Tags | undefined
	public AllQuzzies: Paginated<Quiz> | undefined
	public TutorQuizzes: Paginated<Quiz> | undefined
	public SingleQuiz: Quiz | undefined
	public AllCourses: Paginated<Course> | undefined
	public PurchasedCourses: Paginated<Course> | undefined
	public SingleCourse: Course | undefined
	public AllFiles: Paginated<SofaFile> | undefined
	public SingleFile: SofaFile | undefined
	public SingleMediaFile: FileData | undefined
	public NewCoursableItem: any
	public CoursableItemRemoved: any
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

	public GetTagName = (id: string) => {
		const Tag = [...(this.Tags?.results || []), ...(this.AllTopics?.results || []), ...(this.AllOtherTags?.results || [])].filter(
			(tag) => {
				return tag.id == id
			},
		)

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

	public GetQuizzes = (filters: QueryParams, updateItems = true): Promise<Paginated<Quiz>> => {
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

	public getShape(index: number) {
		const shapes = ['circle', 'triangle', 'square', 'kite']
		return shapes[index % shapes.length]
	}

	public getShapeSize(shape: string) {
		if (shape == 'circle') return 'md:h-[23px] h-[20px]'
		if (shape == 'triangle') return 'md:h-[23px] h-[20px]'
		if (shape == 'square') return 'md:h-[23px] h-[20px]'
		if (shape == 'kite') return 'md:h-[23px] h-[20px]'
		return 'h-[23px]'
	}

	public GetCourses = (filters: QueryParams, updateItems = true): Promise<Paginated<Course>> => {
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

	public GetCoursesWithQuery = async (query = 'nill', tagId = '', userId = '') => {
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

	public GetQuizzesWithQuery = async (query = 'nill', tagId = '', userId = '') => {
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
							Logic.Common.GoToRoute(`/course/create?id=${Logic.Study.SingleCourse.id}`)
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
				const allCourseableFiles = response.data?.coursables?.filter((item) => item.type == 'file').map((item) => item.id)
				const allCourseableQuizzes = response.data?.coursables?.filter((item) => item.type == 'quiz').map((item) => item.id)

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
						value: Logic.Common.AuthUser.id,
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

	public SaveCourseChangesToLocal = (UpdateCourseSections: UpdateCourseSectionsInput) => {
		localStorage.setItem('couse_section_update', JSON.stringify(UpdateCourseSections))
	}

	public SaveCourseLocalChanges = () => {
		if (localStorage.getItem('couse_section_update')) {
			const content = JSON.parse(localStorage.getItem('couse_section_update'))

			this.UpdateCourseSectionForm = content

			const unsectioned = this.UpdateCourseSectionForm.sections.filter((item) => item.label == 'unsectioned')[0]
			if (unsectioned) {
				if (unsectioned.items.length > 0) {
					Logic.Common.showAlert({
						type: 'error',
						message: 'Unsectioned has to be empty. Please, move all your materials to a section.',
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

	public async PublishQuiz(id: string) {
		return $api.study.quiz.publishQuiz(id).then((response) => {
			this.SingleQuiz = response.data
			return response.data
		})
	}

	public ReorderQuizQuestions = (id: string, ReorderQuizQuestionsForm: ReorderQuizInput) => {
		return $api.study.quiz.reorderQuiz(id, ReorderQuizQuestionsForm).then((response) => {
			this.SingleQuiz = response.data
			return this.SingleQuiz
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
							item.items = item.items.filter((eachitem) => eachitem.id != this.MoveItemToCourseForm.coursableId)
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
							item.items = item.items.filter((eachitem) => this.SingleCourse.coursables.includes(eachitem))
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
		return $api.interactions.tag.delete(id).then().catch()
	}

	public DeleteQuiz = (id: string) => {
		return $api.study.quiz.delete(id).then((response) => {
			return response.data
		})
	}

	public DeleteQuestion = (id: string, quizId: string) => {
		return $api.study.quiz.deleteQuestion(quizId, id).then((response) => {
			return response.data
		})
	}

	public DeleteCourse = (id: string) => {
		return $api.study.course.delete(id).then().catch()
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

	public async requestAccess(id: string, add: boolean) {
		return $api.study.quiz.requestAccess(id, add).then((res) => res.data)
	}

	public async grantAccess(id: string, userId: string, grant: boolean) {
		return $api.study.quiz.grantAccess(id, userId, grant).then((res) => res.data)
	}

	public async manageMembers(id: string, userIds: string[], grant: boolean) {
		return $api.study.quiz.manageMembers(id, userIds, grant).then((res) => res.data)
	}
}
