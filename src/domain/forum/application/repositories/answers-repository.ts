import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface AnswersRepository {
  create(answer: Answer): Promise<Answer>
  findById(id: string): Promise<Answer | null>
  save(answer: Answer): Promise<Answer>
  delete(answer: Answer): Promise<void>
}
