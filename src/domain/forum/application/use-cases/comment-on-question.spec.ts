import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { beforeEach, describe } from 'vitest'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let InMemoryCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    InMemoryCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      InMemoryCommentsRepository,
    )
  })

  it('should be able to commend on a question', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-id'))

    await inMemoryQuestionsRepository.create(question)

    const response = await sut.execute({
      authorId: 'author-id',
      questionId: 'question-id',
      content: 'content',
    })

    expect(response.questionComment).toMatchObject({
      authorId: new UniqueEntityID('author-id'),
      questionId: new UniqueEntityID('question-id'),
      content: 'content',
    })

    expect(InMemoryCommentsRepository.items).toHaveLength(1)
  })

  it('should not be able to comment on a question that does not exist', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-id',
        questionId: 'question-id',
        content: 'content',
      }),
    ).rejects.toThrow('Question not found')
  })
})