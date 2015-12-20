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
    const { name, starCount } = repo
    return (
      <div className='repo-option'>
        <div className='name'>
          <i className='octicon octicon-repo' />
          <h4>{name}</h4>
        </div>
        <div className='infos'>
          <span>{starCount}</span>
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

        <h1>{'Add a 4th dimension to Github stars.'}</h1>

        <Select
          value={selectValue}
          options={options}
          optionRenderer={::this.renderOption}
          onChange={::this.handleSearch}
          className='repo-search'/>

        {repo && (
          <Graph
            repo={repo} />
        )}

        <hr />

        <h2>
          {'No idea? '}
          <Link to='/browse'>{'Browse all repos'}</Link>
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

        </ul>

        <div style={{ textAlign: 'right' }}>
          <Link to='/browse'>{'More...'}</Link>
        </div>

      </div>
    )
  }

}

export default Home
