import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerCommentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )

    if (answerCommentIndex === -1) {
      return null
    }

    return this.items[answerCommentIndex]
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === answerComment.id.toString(),
    )

    this.items.splice(itemIndex, 1)
  }
}
