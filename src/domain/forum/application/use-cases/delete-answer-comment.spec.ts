import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { beforeEach, expect } from 'vitest'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete answer comment', async () => {
    const answerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-comment-id'),
    )

    inMemoryAnswerCommentsRepository.create(answerComment)

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)

    await sut.execute({
      authorId: 'author-id',
      answerCommentId: 'answer-comment-id',
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer comment that does not exist', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(
      async () =>
        await sut.execute({
          authorId: 'author-id',
          answerCommentId: 'answer-comment-id',
        }),
    ).rejects.toThrow('Comment not found')
  })

  it('should not be able to delete answer comment that does not belong to the user', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    expect(
      async () =>
        await sut.execute({
          authorId: 'another-author-id',
          answerCommentId: answerComment.id,
        }),
    )
  })
})
