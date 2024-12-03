import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { beforeEach, expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-answers-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'title',
      content: 'content',
    })

    expect(question.id).toBeTruthy()
  })
})
