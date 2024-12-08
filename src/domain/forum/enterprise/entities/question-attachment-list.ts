import { WatchedList } from '@/core/entities/watched-lists'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId === b.attachmentId
  }
}
