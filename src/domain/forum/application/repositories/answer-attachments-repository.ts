import { PaginationForm } from '@/core/repositories/pagination-forms'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(
    answerId: string,
    params?: PaginationForm,
  ): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
