import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { RepoExplorer } from './RepoExplorer'
import { makeRepo } from '../../test/fixtures'

const repos = [
  makeRepo({ name: 'react-app', stargazers_count: 50, language: 'TypeScript', description: 'A UI thing' }),
  makeRepo({ name: 'go-server', stargazers_count: 80, language: 'Go' }),
  makeRepo({ name: 'forked-lib', stargazers_count: 999, language: 'Go', fork: true }),
  makeRepo({ name: 'old-stuff', stargazers_count: 1, language: 'TypeScript', archived: true, homepage: 'example.com' }),
]

function LocationProbe() {
  const { search } = useLocation()
  return <output data-testid="search">{search}</output>
}

function renderExplorer(url = '/user/octo?tab=repositories') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <RepoExplorer repos={repos} />
      <LocationProbe />
    </MemoryRouter>,
  )
}

const cardNames = () => screen.getAllByRole('article').map((a) => within(a).getByRole('heading').textContent)

describe('RepoExplorer', () => {
  it('lists all repos sorted by stars', () => {
    renderExplorer()
    expect(cardNames()).toEqual(['forked-lib', 'go-server', 'react-app', 'old-stuff'])
  })

  it('filters by text query and writes it to the URL', async () => {
    renderExplorer()
    await userEvent.type(screen.getByRole('searchbox', { name: /filter repositories/i }), 'ui thing')
    expect(cardNames()).toEqual(['react-app'])
    expect(screen.getByTestId('search')).toHaveTextContent('q=ui+thing')
  })

  it('filters by language and hides forks/archived', async () => {
    renderExplorer()
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /language/i }), 'Go')
    expect(cardNames()).toEqual(['forked-lib', 'go-server'])
    await userEvent.click(screen.getByRole('checkbox', { name: /hide forks/i }))
    expect(cardNames()).toEqual(['go-server'])
    expect(screen.getByTestId('search')).toHaveTextContent('lang=Go')
    expect(screen.getByTestId('search')).toHaveTextContent('forks=hide')
    expect(screen.getByTestId('search')).toHaveTextContent('tab=repositories')
  })

  it('restores filters from the URL', () => {
    renderExplorer('/user/octo?sort=name&archived=hide')
    expect(cardNames()).toEqual(['forked-lib', 'go-server', 'react-app'])
    expect(screen.getByRole('combobox', { name: /sort by/i })).toHaveValue('name')
  })

  it('shows an empty state and clears filters', async () => {
    renderExplorer()
    await userEvent.type(screen.getByRole('searchbox', { name: /filter repositories/i }), 'zzz')
    expect(screen.getByText(/no repositories match/i)).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: /clear filters/i })[0])
    expect(cardNames()).toHaveLength(4)
  })

  it('renders the homepage link outside the card link (no nested anchors)', () => {
    renderExplorer()
    const card = screen.getAllByRole('article').find((a) => a.textContent?.includes('old-stuff'))!
    const links = within(card).getAllByRole('link')
    expect(links).toHaveLength(2)
    for (const link of links) expect(link.querySelector('a')).toBeNull()
    expect(links[1]).toHaveAttribute('href', 'https://example.com/')
  })
})
