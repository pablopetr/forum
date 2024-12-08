import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { beforeEach } from 'vitest'

let inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
let SendNotificationsUseCase: SendNotificationUseCase

describe('Send Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    SendNotificationsUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )
  })

  it('should be able to send notification', async () => {
    const response = await SendNotificationsUseCase.execute({
      recipientId: '1',
      title: 'title',
      content: 'content',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
  })
})
