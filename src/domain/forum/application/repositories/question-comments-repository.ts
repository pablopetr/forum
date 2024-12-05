import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationForm } from '@/core/repositories/pagination-forms'

export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationForm,
  ): Promise<QuestionComment[]>
  delete(questionComment: QuestionComment): Promise<void>
}
