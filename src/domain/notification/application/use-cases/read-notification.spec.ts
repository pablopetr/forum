import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
import { beforeEach, expect } from 'vitest'
import { makeNotification } from '../../../../../test/factories/make-notification'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

let inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })
})
