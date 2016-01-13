import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { prefetch } from 'react-fetcher'

import { askandgo, fetchTrendingRepos } from 'actions/repos'

import RepoSearch from 'components/RepoSearch'
import ReposCollection from 'components/ReposCollection'

@prefetch(({ dispatch }) => dispatch(fetchTrendingRepos()))
@connect(
  state => ({
    trending: state.repos.trending.map(id => state.repos.all[id])
  })
)
class Home extends Component {

  handleRepoSelect (repo) {
    this.props.dispatch(askAndGo(repo))
  }

  render () {
    const { trending } = this.props

    return (
      <div>
        <div className='contained'>

          <div className='search-container'>
            <RepoSearch
              onRepoSelect={::this.handleRepoSelect}
              className='repo-search'/>
          </div>

          <ReposCollection repos={trending} />

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

          <hr />

          <h2>{'"Why have I to submit my repo and don\'t see results instantly?"'}</h2>

          <p>
            <a href='https://github.com/SIGSEV/Starveller/pulls' target='_blank'>
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
