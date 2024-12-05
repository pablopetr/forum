import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  answerId: string
}

interface DeleteQuestionUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.answersRepository.findById(answerId)

    if (!question) {
      throw new Error('Answer not found.')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    await this.answersRepository.delete(question)

    return {}
  }
}
