import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { beforeEach } from 'vitest'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Commend', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-id'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)

    await sut.execute({
      authorId: 'author-id',
      questionCommentId: questionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment that does not exist', async () => {
    await expect(
      async () =>
        await sut.execute({
          authorId: 'author-id',
          questionCommentId: 'question-comment-id',
        }),
    ).rejects.toThrow('Comment not found')
  })

  it('should not be able to delete a question comment that does not belong to the user', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-id'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    expect(
      async () =>
        await sut.execute({
          authorId: 'another-author-id',
          questionCommentId: questionComment.id,
        }),
    )
  })
})
