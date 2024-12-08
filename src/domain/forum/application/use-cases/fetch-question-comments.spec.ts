import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { beforeEach, expect } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionCommentsUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-id'))

    inMemoryQuestionsRepository.create(question)

    const questionComment1 = makeQuestionComment(
      {
        questionId: question.id,
      },
      new UniqueEntityID('comment-id-1'),
    )
    const questionComment2 = makeQuestionComment(
      {
        questionId: question.id,
      },
      new UniqueEntityID('comment-id-2'),
    )

    inMemoryQuestionCommentsRepository.create(questionComment1)
    inMemoryQuestionCommentsRepository.create(questionComment2)

    const response = await sut.execute({
      questionId: 'question-id',
      page: 1,
    })

    expect(response.value.questionComments).toEqual([
      questionComment1,
      questionComment2,
    ])
  })

  it('should be able to fetch question comments paginated', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    for (let i = 0; i < 22; i++) {
      const questionComment = makeQuestionComment({
        questionId: question.id,
      })

      await inMemoryQuestionCommentsRepository.create(questionComment)
    }

    const response = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })

    expect(response.value.questionComments.length).toBe(2)
  })

  it('should not be able to fetch question comments if question does not exist', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
