import { reactive, ref } from 'vue'
import { CreateDocumentInput, Logic, UpdateCourseSectionsInput } from 'sofa-logic'

const hasUnsavedChanges = ref(false)

const updateCourseSectionForm = reactive<UpdateCourseSectionsInput>({
	sections: [],
	id: '',
})

const addCourseFileForm = reactive<CreateDocumentInput>({
	description: '',
	tags: [],
	title: '',
	type: '',
	media: undefined,
	topic: '',
	id: '',
})

const updateCourseSections = () => {
	if (Logic.Study.SingleCourse) {
		Logic.Study.UpdateCourseSectionForm = {
			id: Logic.Study.SingleCourse.id,
			sections: updateCourseSectionForm.sections,
		}

		const unsectionedSection = updateCourseSectionForm.sections.filter((item) => item.label == 'unsectioned')[0]

		Logic.Study.UpdateCourseSectionForm.sections = updateCourseSectionForm.sections.filter((item) => item.label != 'unsectioned')

		Logic.Study.UpdateCourseSectionForm.sections.push(unsectionedSection)

		Logic.Study.SaveCourseChangesToLocal(Logic.Study.UpdateCourseSectionForm)
		hasUnsavedChanges.value = true
	}
}

const addCourseFile = () => {
	Logic.Study.CreateFileForm = {
		description: addCourseFileForm.description,
		tags: addCourseFileForm.tags,
		title: addCourseFileForm.title,
		type: addCourseFileForm.type,
		media: addCourseFileForm.media,
		topic: addCourseFileForm.topic,
		id: '',
	}

	Logic.Study.CreateFile(true)?.then((data) => {
		if (data) {
			// empty quiz
			Logic.Study.SingleQuiz = undefined
			// move item to course
			Logic.Study.MoveItemToCourseForm = {
				add: true,
				coursableId: Logic.Study.SingleFile?.id ?? '',
				type: 'file',
				id: Logic.Study.SingleCourse?.id ?? '',
			}
			Logic.Study.MoveItemToCourse(true)

			Logic.Common.showAlert({
				message: 'Material added.',
				type: 'success',
			})
		}
	})
}

const addQuizToCourse = (quizId: string) => {
	Logic.Study.GetQuiz(quizId).then(() => {
		Logic.Study.SingleFile = undefined
		Logic.Study.MoveItemToCourseForm = {
			add: true,
			coursableId: quizId,
			type: 'quiz',
			id: Logic.Study.SingleCourse?.id ?? '',
		}
		Logic.Study.MoveItemToCourse(true)?.then((data) => {
			if (data) {
				Logic.Common.showAlert({
					message: 'Quiz added.',
					type: 'success',
				})
			}
		})
	})
}

export { addCourseFile, addCourseFileForm, addQuizToCourse, hasUnsavedChanges, updateCourseSectionForm, updateCourseSections }
