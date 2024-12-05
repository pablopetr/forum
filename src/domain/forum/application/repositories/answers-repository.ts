import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PaginationForm } from '@/core/repositories/pagination-forms'

export interface AnswersRepository {
  create(answer: Answer): Promise<Answer>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationForm,
  ): Promise<Answer[]>
  save(answer: Answer): Promise<Answer>
  delete(answer: Answer): Promise<void>
}
