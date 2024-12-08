import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { expect } from 'vitest'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    const newQuestion = makeQuestion()
    const newQuestion2 = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    await inMemoryQuestionsRepository.create(newQuestion2)

    const response = await sut.execute({ page: 1 })

    expect(response.value?.questions).toHaveLength(2)

    expect(response.value?.questions[0].title).toEqual(newQuestion.title)

    expect(response.value?.questions[1].title).toEqual(newQuestion2.title)
  })

  it('should be able to fetch recent questions with pagination', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const response = await sut.execute({ page: 2 })

    expect(response.value?.questions).toHaveLength(2)
  })
})
