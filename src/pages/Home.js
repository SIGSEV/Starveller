import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'

import RepoSearch from 'components/RepoSearch'
import { Feat1, Feat2 } from 'components/Featured'
import Trending from 'components/Trending'

import { fetchFeaturedRepos, fetchTrendingRepos, askAndGo } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Featured.scss')
  require('styles/Trending.scss')
}

@prefetch(({ dispatch }) => dispatch(fetchTrendingRepos()) && dispatch(fetchFeaturedRepos()))
@connect(
  state => ({
    featured: state.repos.featured.map(id => state.repos.all[id]),
    trending: state.repos.trending.map(id => state.repos.all[id])
  })
)
class Home extends Component {

  goToRepo (name) {
    this.props.dispatch(askAndGo({ name }))
  }

  render () {
    const { featured, trending } = this.props

    return (
      <div>

        <div className='HomeMarged'>
          <h1>{'Dig into Github repo\'s popularity'}</h1>
          <h2 className='mb2'>{'See & analyze stars origin in time and more!'}</h2>
          <RepoSearch onSelect={::this.goToRepo} setNameAfterSearch />
        </div>

        <div className='container pb3 mt2'>

          <div className='f mb2'>
            <h2 className='fg'>{'Featured repos'}</h2>
            <Link to='battle'>{'Battle'}</Link>
          </div>

          <div className='Featured'>

            <div>
              <Feat1 repo={featured[0]} />
            </div>

            <div>
              <Feat1 repo={featured[1]} />
              <Feat1 repo={featured[2]} />
            </div>

            <div>
              <Feat2 repo={featured[3]} />
            </div>

          </div>

        </div>

        <div className='HomeSecondary'>
          <div className='z'>
            <h2>{'Trending today'}</h2>
            <div className='Trending-container'>
              <div>
                <Trending repo={trending[0]} />
                <Trending repo={trending[2]} />
                <Trending repo={trending[4]} />
                <Trending repo={trending[6]} />
              </div>
              <div>
                <Trending repo={trending[1]} />
                <Trending repo={trending[3]} />
                <Trending repo={trending[5]} />
                <Trending repo={trending[7]} />
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }

}

export default Home
