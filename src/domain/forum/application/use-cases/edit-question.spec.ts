import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { beforeEach, expect } from 'vitest'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
    )

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    expect(inMemoryQuestionsRepository.items).toHaveLength(1)

    await sut.execute({
      authorId: 'author-1',
      title: 'Question Test',
      content: 'content',
      questionId: newQuestion.id.toValue(),
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Question Test',
      content: 'content',
      slug: Slug.create('question-test'),
    })

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(inMemoryQuestionsRepository.items).toHaveLength(1)

    const result = await sut.execute({
      authorId: 'author-2',
      title: 'Question Test',
      content: 'content',
      questionId: newQuestion.id.toValue(),
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
