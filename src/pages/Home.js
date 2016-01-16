import React, { Component } from 'react'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'

import { fetchTrendingRepos } from 'actions/repos'

@prefetch(({ dispatch }) => dispatch(fetchTrendingRepos()))
@connect(
  state => ({
    trending: state.repos.trending.map(id => state.repos.all[id])
  })
)
class Home extends Component {

  render () {
    const { trending } = this.props

    return (
      <div className='container'>

        <h1>{'Hi there.'}</h1>

        <hr />

        <h3>{'Trending'}</h3>

        {trending.map(repo => (
          <div key={repo._id}>{repo.name}</div>
        ))}

      </div>
    )
  }

}

export default Home
