import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeQuestion(override: Partial<QuestionProps> = {}) {
  return Question.create({
    title: 'Example question',
    slug: Slug.create('example-question'),
    content: 'Content Example',
    authorId: new UniqueEntityID(),
    ...override,
  })
}
