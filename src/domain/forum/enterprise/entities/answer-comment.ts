import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'
import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId(): UniqueEntityID {
    return this.props.answerId
  }

  public static create(
    props: AnswerCommentProps,
    id?: UniqueEntityID,
  ): AnswerComment {
    return new AnswerComment(props, id)
  }
}
