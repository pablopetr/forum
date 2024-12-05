import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { beforeEach } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to fetch answer comments', async () => {
    const answer = makeAnswer({}, new UniqueEntityID('answer-id'))

    inMemoryAnswersRepository.create(answer)

    const comment1 = makeAnswerComment(
      {
        answerId: answer.id,
      },
      new UniqueEntityID('comment-id-1'),
    )

    const comment2 = makeAnswerComment(
      {
        answerId: answer.id,
      },
      new UniqueEntityID('comment-id-2'),
    )

    inMemoryAnswerCommentsRepository.create(comment1)
    inMemoryAnswerCommentsRepository.create(comment2)

    const response = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    })

    expect(response.answerComments).toEqual([comment1, comment2])
  })

  it('should be able to fetch answer comments paginated', async () => {
    const answer = makeAnswer({}, new UniqueEntityID('answer-id'))

    await inMemoryAnswersRepository.create(answer)

    for (let i = 0; i < 22; i++) {
      const comment = makeAnswerComment({
        answerId: answer.id,
      })

      await inMemoryAnswerCommentsRepository.create(comment)
    }

    const response = await sut.execute({
      answerId: 'answer-id',
      page: 2,
    })

    expect(response.answerComments).toHaveLength(2)
  })

  it('should not be able to fetch answer comments from an answer that does not exist', async () => {
    await expect(
      async () =>
        await sut.execute({
          answerId: 'answer-id',
          page: 1,
        }),
    ).rejects.toThrow('Answer not found')
  })
})
