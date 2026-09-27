import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useParams } from 'react-router'
import { SearchBar } from './SearchBar'

function Profile() {
  const { login } = useParams()
  return <p>profile:{login}</p>
}

function renderSearch() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<SearchBar hotkey />} />
        <Route path="/user/:login" element={<Profile />} />
      </Routes>
    </MemoryRouter>,
  )
  return screen.getByRole('searchbox', { name: /github username/i })
}

describe('SearchBar', () => {
  it('navigates to the profile for a valid username', async () => {
    const input = renderSearch()
    await userEvent.type(input, '  @torvalds {Enter}')
    expect(await screen.findByText('profile:torvalds')).toBeInTheDocument()
  })

  it('accepts a pasted profile URL', async () => {
    const input = renderSearch()
    await userEvent.type(input, 'https://github.com/gaearon{Enter}')
    expect(await screen.findByText('profile:gaearon')).toBeInTheDocument()
  })

  it('shows an inline error for an invalid username and stays put', async () => {
    const input = renderSearch()
    await userEvent.type(input, 'bad--name{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent(/letters, numbers and single hyphens/i)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    await userEvent.type(input, 'x')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('asks for input when empty', async () => {
    renderSearch()
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/enter a github username/i)
  })

  it('focuses on the "/" hotkey', async () => {
    const input = renderSearch()
    input.blur()
    await userEvent.keyboard('/')
    expect(input).toHaveFocus()
  })
})
