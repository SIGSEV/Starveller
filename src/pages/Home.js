import React, { Component } from 'react'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'

import RepoSearch from 'components/RepoSearch'

import { fetchTrendingRepos, askAndGo } from 'actions/repos'

@prefetch(({ dispatch }) => dispatch(fetchTrendingRepos()))
@connect(
  state => ({
    trending: state.repos.trending.map(id => state.repos.all[id])
  })
)
class Home extends Component {

  goToRepo (name) {
    this.props.dispatch(askAndGo({ name }))
  }

  render () {
    const { trending } = this.props

    return (
      <div>
        <div className='HomeMarged'>
          <h1>{'Dig into Github repo\'s popularity'}</h1>
          <h2>{'See & analyze stars origin in time and more!'}</h2>
          <RepoSearch autofocus onSelect={::this.goToRepo} />
        </div>
        <div className='container'>

          <h1>{'Featured repos'}</h1>

          {trending.map(repo => (
            <div key={repo._id}>{repo.name}</div>
          ))}

        </div>
      </div>
    )
  }

}

export default Home
