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
      this.props.dispatch(fetchRepo(search.value))
    } else {
      this.props.dispatch(resetRepo())
    }
  }

  render () {
    const { repo } = this.props
    const repos = this.props.repos.map(r => ({ value: r.name, label: r.name }))

    const selectValue = repo ? { value: repo.name, label: repo.name } : null

    return (
      <div>

        <h1>{'Add a 4th dimension to Github stars.'}</h1>

        <Select
          value={selectValue}
          options={repos}
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
