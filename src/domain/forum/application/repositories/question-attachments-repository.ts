import { PaginationForm } from '@/core/repositories/pagination-forms'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  findManyByAnswerId(
    questionId: string,
    params?: PaginationForm,
  ): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
