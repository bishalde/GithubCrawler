import { describe, expect, it } from 'vitest'
import { isValidLogin, normalizeLogin } from './username'

describe('isValidLogin', () => {
  it.each(['torvalds', 'a', 'sindre-sorhus', 'A1b2', 'x'.repeat(39)])('accepts %s', (v) => {
    expect(isValidLogin(v)).toBe(true)
  })
  it.each(['', '-lead', 'trail-', 'dou--ble', 'has space', 'x'.repeat(40), 'dot.name', 'a/b'])('rejects %j', (v) => {
    expect(isValidLogin(v)).toBe(false)
  })
})

describe('normalizeLogin', () => {
  it('strips @, whitespace and profile URLs', () => {
    expect(normalizeLogin('  @gaearon ')).toBe('gaearon')
    expect(normalizeLogin('https://github.com/torvalds')).toBe('torvalds')
    expect(normalizeLogin('github.com/torvalds/linux')).toBe('torvalds')
    expect(normalizeLogin('www.github.com/octo?tab=repos')).toBe('octo')
  })
})
