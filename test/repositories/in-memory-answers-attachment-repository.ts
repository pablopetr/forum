import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { PaginationForm } from '@/core/repositories/pagination-forms'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswersAttachmentRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async deleteManyByQuestionId(answerId: string): Promise<void> {
    this.items.filter((item) => item.answerId.toString() === answerId)
  }

  async findManyByAnswerId(
    answerId: string,
    params?: PaginationForm,
  ): Promise<AnswerAttachment[]> {
    return (this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    ))
  }
}
