import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { beforeEach } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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

    expect(response.answerComment).toMatchObject({
      authorId: new UniqueEntityID('author-id'),
      answerId: new UniqueEntityID('answer-id'),
      content: 'content',
    })
  })

  it('should be able to comment on answer that does not exist', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-id',
        questionId: 'answer-id',
        content: 'content',
      }),
    ).rejects.toThrow('Answer not found')
  })
})
