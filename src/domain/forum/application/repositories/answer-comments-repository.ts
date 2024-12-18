import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationForm } from '@/core/repositories/pagination-forms'

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    page: PaginationForm,
  ): Promise<AnswerComment[]>
  delete(answerComment: AnswerComment): Promise<void>
}
