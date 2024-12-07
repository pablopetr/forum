import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

interface CreateQuestionUseCaseRequest {
  authorId: UniqueEntityID
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId,
      title,
      content,
    })

    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      }),
    )

    question.attachments = questionAttachments

    await this.questionsRepository.create(question)

    return right({ question })
  }
}
