import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationForm } from '@/core/repositories/pagination-forms'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionCommentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )

    if (questionCommentIndex === -1) {
      return null
    }

    return this.items[questionCommentIndex]
  }

  async findManyByQuestionId(questionId: string, params: PaginationForm) {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === questionComment.id.toString(),
    )

    this.items.splice(itemIndex, 1)
  }
}
