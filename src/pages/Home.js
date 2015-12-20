import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Select from 'react-select'

import { fetchRepo, resetRepo } from 'actions/repo'

import Graph from 'components/Graph'

@connect(
  state => ({
    repo: state.repo,
    repos: state.repos
  })
)
class Home extends Component {

  handleSearch (search) {
    if (search && search.value) {
      const { name } = search.value
      this.props.dispatch(fetchRepo(name))
    } else {
      this.props.dispatch(resetRepo())
    }
  }

  renderOption (option) {
    const repo = option.value
    const { name, starsCount } = repo

    return (
      <div className='repo-option'>
        <div className='name'>
          <i className='octicon octicon-repo' />
          <h4>{name}</h4>
        </div>
        <div className='infos'>
          <span>{starsCount}</span>
          <i className='octicon octicon-star' />
        </div>
      </div>
    )
  }

  render () {
    const { repo, repos } = this.props

    const options = repos.map(r => ({ value: r, label: r.name }))
    const selectValue = repo ? { value: repo, label: repo.name } : null

    return (
      <div>

        <div className='contained'>

          <h1>
            {'Add a new dimension to Github st'}
            <i className='mega-octicon octicon-star' />
            {'rs.'}
          </h1>

          <Select
            value={selectValue}
            options={options}
            placeholder='Find a repo'
            optionRenderer={::this.renderOption}
            onChange={::this.handleSearch}
            className='repo-search'/>

          {repo && (
            <Graph
              repo={repo} />
          )}

          <hr />

          <h2>
            {'No idea? You can '}
            <a href=''>
              <i className='octicon octicon-plus' />
              {' submit a repo'}
            </a>
            {' or check this '}
            <strong>{'awesome'}</strong>
            {' selection:'}
          </h2>

          <ul className='collection'>

            <li>
              <div className='repo'>
                <header>
                  <a href='https://github.com/SIGSEV/minus' target='_blank'>
                    {'SIGSEV/minus'}
                  </a>
                </header>
              </div>
            </li>

            <li>
              <div className='repo'>
                <header>
                  <a href='https://github.com/SIGSEV/minus' target='_blank'>
                    {'SIGSEV/minus'}
                  </a>
                </header>
              </div>
            </li>

            <li>
              <div className='repo'>
                <header>
                  <a href='https://github.com/SIGSEV/minus' target='_blank'>
                    {'SIGSEV/minus'}
                  </a>
                </header>
              </div>
            </li>

            <li>
              <div className='repo'>
                <header>
                  <a href='https://github.com/SIGSEV/minus' target='_blank'>
                    {'SIGSEV/minus'}
                  </a>
                </header>
              </div>
            </li>

          </ul>

          <div className='collection-actions'>
            <Link to='/browse'>
              {'Browse all repos '}
              <i className='octicon octicon-chevron-right' />
            </Link>
          </div>

          <hr />

          <div className='explain'>
            <h3>{'Analyse stars origin in time'}</h3>
            <p>
              {'Easily detect importants stars movement, and link them with events (social event, releases, etc.). Display all of that in a nice manner, and you make the world a better place. Here. Now.'}
            </p>
          </div>

          <div className='explain'>
            <h3>{'Visualize tech choices directions'}</h3>
            <p>
              {'Github stars are a '}
              <strong>{'very good'}</strong>
              {' indicator of the "health" of a project. But sometimes they can be "false positive". Observe star progression to see if the repo is still liked!'}
            </p>
          </div>

          <div className='z' style={{ margin: '4em 0' }}>
            <button className='b'>
              <i className='octicon octicon-plus' />
              {'Submit your repo now!'}
            </button>
          </div>

          <hr />

          <h2>{'"Why have I to submit my repo and don\'t see results instantly?"'}</h2>

          <p>
            <a href='https://github.com/SIGSEV/Statoss/pulls' target='_blank'>
              {'PR accepted'}
            </a>
            {'.'}
          </p>

        </div>

      </div>
    )
  }

}

export default Home
