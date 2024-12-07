import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { beforeEach, expect } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const answer1 = makeAnswer({
      questionId: new UniqueEntityID('question-id'),
    })

    const answer2 = makeAnswer({
      questionId: new UniqueEntityID('question-id'),
    })

    inMemoryAnswersRepository.create(answer1)
    inMemoryAnswersRepository.create(answer2)

    const response = await sut.execute({
      questionId: 'question-id',
      page: 1,
    })

    expect(response.value.answers).toEqual([answer1, answer2])
  })

  it('should be able to fetch question answers paginated', async () => {
    for (let i = 0; i < 22; i++) {
      const answer = makeAnswer({
        questionId: new UniqueEntityID('question-id'),
      })

      await inMemoryAnswersRepository.create(answer)
    }

    const response = await sut.execute({
      questionId: 'question-id',
      page: 2,
    })

    expect(response.value.answers.length).toBe(2)
  })
})
