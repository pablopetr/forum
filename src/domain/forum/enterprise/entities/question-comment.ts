import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'
import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  public static create(
    props: QuestionCommentProps,
    id?: UniqueEntityID,
  ): QuestionComment {
    return new QuestionComment(props, id)
  }
}
