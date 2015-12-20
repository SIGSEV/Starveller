import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { fetchRepo } from 'actions/repo'

import Graph from 'components/Graph'

@connect(
  state => ({
    repo: state.repo
  })
)
class Home extends Component {

  handleSearch (e) {
    e.preventDefault()
    const search = this.refs.name.value

    this.props.dispatch(fetchRepo(search))
  }

  render () {
    const { repo } = this.props

    return (
      <div>

        <h1>{'Add a 4th dimension to Github stars.'}</h1>

        <form className='f' onSubmit={::this.handleSearch}>
          <input
            defaultValue='42Zavattas/generator-bangular'
            ref='name'
            autoFocus
            className='repo-search'
            type='text'
            placeholder='Find repository...' />
          <button className='b'>
            {'Show'}
          </button>
        </form>

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
