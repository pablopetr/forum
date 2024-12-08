import { PaginationForm } from '@/core/repositories/pagination-forms'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachments
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByAnswerId(
    questionId: string,
    params: PaginationForm,
  ): Promise<QuestionAttachment[]> {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )
  }
}
