import { AxiosResponse } from 'axios'
import { Course } from '../../logic/types/domains/study'
import {
  AddItemToCourseInput,
  UpdateCourseSectionsInput,
} from '../../logic/types/forms/study'
import { ModelApiService } from '../common/ModelService'

export default class CoursesApi extends ModelApiService {
  constructor() {
    super('study/courses')
  }

  public async similarCourses(courseId: string) {
    try {
      const response: AxiosResponse<Course[]> = await this.axiosInstance.get(
        this.getUrl() + `/${courseId}/similar`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async moveItemIntoCourse(data: AddItemToCourseInput) {
    try {
      const response: AxiosResponse<Course> = await this.axiosInstance.post(
        this.getUrl() + `/${data.id}/move`,
        data,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async updateCourseSections(data: UpdateCourseSectionsInput) {
    try {
      const response: AxiosResponse<Course> = await this.axiosInstance.post(
        this.getUrl() + `/${data.id}/sections`,
        data,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async publishCourse(courseId: string) {
    try {
      const response: AxiosResponse<Course> = await this.axiosInstance.post(
        this.getUrl() + `/${courseId}/publish`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }

  public async freezeCourse(courseId: string) {
    try {
      const response: AxiosResponse<Course> = await this.axiosInstance.post(
        this.getUrl() + `/${courseId}/freeze`,
      )

      return response
    } catch (err) {
      this.handleErrors(err)
      if (err.response) {
      }
    }
  }
}
