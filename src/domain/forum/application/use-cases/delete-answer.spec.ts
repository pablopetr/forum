import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { beforeEach } from 'vitest'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '../../../../../test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', async () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer by id', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer that does not exist', async () => {
    await expect(async () => {
      await sut.execute({
        answerId: 'answer-1',
        authorId: 'author-1',
      })
    }).rejects.toThrowError('Answer not found')
  })

  it('should not be able to delete an answer that not belongs to the author', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    await expect(async () => {
      await sut.execute({
        answerId: 'answer-1',
        authorId: 'author-2',
      })
    }).rejects.toThrowError('Not allowed')
  })
})
