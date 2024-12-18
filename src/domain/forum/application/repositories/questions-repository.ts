import { Question } from '@/domain/forum/enterprise/entities/question'

export interface QuestionsRepository {
  create(question: Question): Promise<void>
  findById(id: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(page?: number): Promise<Question[]>
  save(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
