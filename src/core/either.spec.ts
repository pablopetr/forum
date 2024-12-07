import { expect } from 'vitest'
import { Either, left, right } from '@/core/either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error')
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.isLeft()).toBeFalsy()
  expect(result.isRight()).toBeTruthy()
})

test('error result', () => {
  const result = left('error')

  expect(result.isLeft()).toBeTruthy()
  expect(result.isRight()).toBeFalsy()
})
