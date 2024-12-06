import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { expect } from 'vitest'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    const newQuestionDate = new Date().setDate(new Date().getDate() - 1)
    const newQuestionDate2 = new Date().setDate(new Date().getDate())

    const newQuestion = makeQuestion({ createdAt: newQuestionDate })
    const newQuestion2 = makeQuestion({ createdAt: newQuestionDate2 })

    await inMemoryQuestionsRepository.create(newQuestion)

    await inMemoryQuestionsRepository.create(newQuestion2)

    const response = await sut.execute({ page: 1 })

    expect(response.value.questions).toHaveLength(2)

    expect(response.value.questions[1]).toMatchObject({
      title: newQuestion.title,
      content: newQuestion.content,
    })

    expect(response.value.questions[0]).toMatchObject({
      title: newQuestion2.title,
      content: newQuestion2.content,
    })
  })

  it('should be able to fetch recent questions with pagination', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const response = await sut.execute({ page: 2 })

    expect(response.value.questions).toHaveLength(2)
  })
})
