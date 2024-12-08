import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { beforeEach, expect } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer({}, new UniqueEntityID('answer-id'))

    await inMemoryAnswersRepository.create(answer)

    const response = await sut.execute({
      authorId: 'author-id',
      questionId: 'answer-id',
      content: 'content',
    })

    expect(response.value.answerComment).toMatchObject({
      authorId: new UniqueEntityID('author-id'),
      answerId: new UniqueEntityID('answer-id'),
      content: 'content',
    })
  })

  it('should be able to comment on answer that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'author-id',
      questionId: 'answer-id',
      content: 'content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
